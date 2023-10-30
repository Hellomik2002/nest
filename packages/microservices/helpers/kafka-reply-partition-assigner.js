"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.KafkaReplyPartitionAssigner = void 0;
var load_package_util_1 = require("@nestjs/common/utils/load-package.util");
var shared_utils_1 = require("@nestjs/common/utils/shared.utils");
var kafkaPackage = {};
var KafkaReplyPartitionAssigner = /** @class */ (function () {
    function KafkaReplyPartitionAssigner(clientKafka, config) {
        this.clientKafka = clientKafka;
        this.config = config;
        this.name = 'NestReplyPartitionAssigner';
        this.version = 1;
        kafkaPackage = (0, load_package_util_1.loadPackage)('kafkajs', KafkaReplyPartitionAssigner.name, function () { return require('kafkajs'); });
    }
    /**
     * This process can result in imbalanced assignments
     * @param {array} members array of members, e.g: [{ memberId: 'test-5f93f5a3' }]
     * @param {array} topics
     * @param {Buffer} userData
     * @returns {array} object partitions per topic per member
     */
    KafkaReplyPartitionAssigner.prototype.assign = function (group) {
        return __awaiter(this, void 0, void 0, function () {
            var assignment, previousAssignment, membersCount, decodedMembers, sortedMemberIds, topicsPartitions, insertAssignmentsByTopic;
            var _this = this;
            return __generator(this, function (_a) {
                assignment = {};
                previousAssignment = {};
                membersCount = group.members.length;
                decodedMembers = group.members.map(function (member) {
                    return _this.decodeMember(member);
                });
                sortedMemberIds = decodedMembers
                    .map(function (member) { return member.memberId; })
                    .sort();
                // build the previous assignment and an inverse map of topic > partition > memberId for lookup
                decodedMembers.forEach(function (member) {
                    if (!previousAssignment[member.memberId] &&
                        Object.keys(member.previousAssignment).length > 0) {
                        previousAssignment[member.memberId] = member.previousAssignment;
                    }
                });
                topicsPartitions = group.topics
                    .map(function (topic) {
                    var partitionMetadata = _this.config.cluster.findTopicPartitionMetadata(topic);
                    return partitionMetadata.map(function (m) {
                        return {
                            topic: topic,
                            partitionId: m.partitionId
                        };
                    });
                })
                    .reduce(function (acc, val) { return acc.concat(val); }, []);
                // create the new assignment by populating the members with the first partition of the topics
                sortedMemberIds.forEach(function (assignee) {
                    if (!assignment[assignee]) {
                        assignment[assignee] = {};
                    }
                    // add topics to each member
                    group.topics.forEach(function (topic) {
                        if (!assignment[assignee][topic]) {
                            assignment[assignee][topic] = [];
                        }
                        // see if the topic and partition belong to a previous assignment
                        if (previousAssignment[assignee] &&
                            !(0, shared_utils_1.isUndefined)(previousAssignment[assignee][topic])) {
                            // take the minimum partition since replies will be sent to the minimum partition
                            var firstPartition_1 = previousAssignment[assignee][topic];
                            // create the assignment with the first partition
                            assignment[assignee][topic].push(firstPartition_1);
                            // find and remove this topic and partition from the topicPartitions to be assigned later
                            var topicsPartitionsIndex = topicsPartitions.findIndex(function (topicPartition) {
                                return (topicPartition.topic === topic &&
                                    topicPartition.partitionId === firstPartition_1);
                            });
                            // only continue if we found a partition matching this topic
                            if (topicsPartitionsIndex !== -1) {
                                // remove inline
                                topicsPartitions.splice(topicsPartitionsIndex, 1);
                            }
                        }
                    });
                });
                // check for member topics that have a partition length of 0
                sortedMemberIds.forEach(function (assignee) {
                    group.topics.forEach(function (topic) {
                        // only continue if there are no partitions for assignee's topic
                        if (assignment[assignee][topic].length === 0) {
                            // find the first partition for this topic
                            var topicsPartitionsIndex = topicsPartitions.findIndex(function (topicPartition) {
                                return topicPartition.topic === topic;
                            });
                            if (topicsPartitionsIndex !== -1) {
                                // find and set the topic partition
                                var partition = topicsPartitions[topicsPartitionsIndex].partitionId;
                                assignment[assignee][topic].push(partition);
                                // remove this partition from the topics partitions collection
                                topicsPartitions.splice(topicsPartitionsIndex, 1);
                            }
                        }
                    });
                });
                insertAssignmentsByTopic = function (topicPartition, i) {
                    var assignee = sortedMemberIds[i % membersCount];
                    assignment[assignee][topicPartition.topic].push(topicPartition.partitionId);
                };
                // build the assignments
                topicsPartitions.forEach(insertAssignmentsByTopic);
                // encode the end result
                return [2 /*return*/, Object.keys(assignment).map(function (memberId) { return ({
                        memberId: memberId,
                        memberAssignment: kafkaPackage.AssignerProtocol.MemberAssignment.encode({
                            version: _this.version,
                            assignment: assignment[memberId]
                        })
                    }); })];
            });
        });
    };
    KafkaReplyPartitionAssigner.prototype.protocol = function (subscription) {
        var stringifiedUserData = JSON.stringify({
            previousAssignment: this.getPreviousAssignment()
        });
        subscription.userData = Buffer.from(stringifiedUserData);
        return {
            name: this.name,
            metadata: kafkaPackage.AssignerProtocol.MemberMetadata.encode({
                version: this.version,
                topics: subscription.topics,
                userData: subscription.userData
            })
        };
    };
    KafkaReplyPartitionAssigner.prototype.getPreviousAssignment = function () {
        return this.clientKafka.getConsumerAssignments();
    };
    KafkaReplyPartitionAssigner.prototype.decodeMember = function (member) {
        var memberMetadata = kafkaPackage.AssignerProtocol.MemberMetadata.decode(member.memberMetadata);
        var memberUserData = JSON.parse(memberMetadata.userData.toString());
        return {
            memberId: member.memberId,
            previousAssignment: memberUserData.previousAssignment
        };
    };
    return KafkaReplyPartitionAssigner;
}());
exports.KafkaReplyPartitionAssigner = KafkaReplyPartitionAssigner;
