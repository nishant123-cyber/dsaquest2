import { BattleQuestion } from './battle.types';

export const BATTLE_QUESTIONS: BattleQuestion[] = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    description:
      'Given an array of integers `nums` and an integer `target`, return **indices** of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have **exactly one solution**, and you may not use the same element twice.\n\nYou can return the answer in any order.',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] = 2 + 7 = 9' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
    ],
    constraints: ['2 ≤ nums.length ≤ 10⁴', '-10⁹ ≤ nums[i] ≤ 10⁹', 'Only one valid answer exists'],
    functionName: 'twoSum',
    starterCode: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  // Write your solution here
};`,
    testCases: [
      { input: [[2, 7, 11, 15], 9], expected: [0, 1], description: 'Basic case' },
      { input: [[3, 2, 4], 6], expected: [1, 2], description: 'Middle elements' },
      { input: [[3, 3], 6], expected: [0, 1], description: 'Duplicate values' },
      { input: [[1, 2, 3, 4, 5], 9], expected: [3, 4], description: 'Last two elements' },
      { input: [[-1, -2, -3, -4, -5], -8], expected: [2, 4], description: 'Negative numbers' },
    ],
  },
  {
    id: 'max-subarray',
    title: 'Maximum Subarray',
    difficulty: 'Medium',
    description:
      'Given an integer array `nums`, find the **subarray** with the largest sum, and return its sum.\n\nA **subarray** is a contiguous part of an array.',
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'Subarray [4,-1,2,1] has the largest sum 6' },
      { input: 'nums = [1]', output: '1' },
      { input: 'nums = [5,4,-1,7,8]', output: '23' },
    ],
    constraints: ['1 ≤ nums.length ≤ 10⁵', '-10⁴ ≤ nums[i] ≤ 10⁴'],
    functionName: 'maxSubArray',
    starterCode: `/**
 * @param {number[]} nums
 * @return {number}
 */
function maxSubArray(nums) {
  // Write your solution here
};`,
    testCases: [
      { input: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6, description: 'Classic case' },
      { input: [[1]], expected: 1, description: 'Single element' },
      { input: [[5, 4, -1, 7, 8]], expected: 23, description: 'All positive' },
      { input: [[-1, -2, -3]], expected: -1, description: 'All negative' },
      { input: [[1, -1, 1, -1, 1]], expected: 1, description: 'Alternating' },
    ],
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    description:
      'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is **valid**.\n\nAn input string is valid if:\n- Open brackets must be closed by the same type of brackets.\n- Open brackets must be closed in the correct order.\n- Every close bracket has a corresponding open bracket of the same type.',
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' },
    ],
    constraints: ['1 ≤ s.length ≤ 10⁴', 's consists of parentheses only'],
    functionName: 'isValid',
    starterCode: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
  // Write your solution here
};`,
    testCases: [
      { input: ['()'], expected: true, description: 'Simple pair' },
      { input: ['()[]{}'], expected: true, description: 'Multiple pairs' },
      { input: ['(]'], expected: false, description: 'Wrong type' },
      { input: ['([)]'], expected: false, description: 'Wrong order' },
      { input: ['{[]}'], expected: true, description: 'Nested correctly' },
    ],
  },
  {
    id: 'climbing-stairs',
    title: 'Climbing Stairs',
    difficulty: 'Easy',
    description:
      'You are climbing a staircase. It takes `n` steps to reach the top.\n\nEach time you can either climb `1` or `2` steps. In how many **distinct ways** can you climb to the top?',
    examples: [
      { input: 'n = 2', output: '2', explanation: '1 step + 1 step, or 2 steps' },
      { input: 'n = 3', output: '3', explanation: '1+1+1, 1+2, 2+1' },
    ],
    constraints: ['1 ≤ n ≤ 45'],
    functionName: 'climbStairs',
    starterCode: `/**
 * @param {number} n
 * @return {number}
 */
function climbStairs(n) {
  // Write your solution here
};`,
    testCases: [
      { input: [1], expected: 1, description: 'One step' },
      { input: [2], expected: 2, description: 'Two steps' },
      { input: [3], expected: 3, description: 'Three steps' },
      { input: [5], expected: 8, description: 'Five steps' },
      { input: [10], expected: 89, description: 'Ten steps' },
    ],
  },
  {
    id: 'contains-duplicate',
    title: 'Contains Duplicate',
    difficulty: 'Easy',
    description:
      'Given an integer array `nums`, return `true` if any value appears **at least twice** in the array, and return `false` if every element is distinct.',
    examples: [
      { input: 'nums = [1,2,3,1]', output: 'true' },
      { input: 'nums = [1,2,3,4]', output: 'false' },
      { input: 'nums = [1,1,1,3,3,4,3,2,4,2]', output: 'true' },
    ],
    constraints: ['1 ≤ nums.length ≤ 10⁵', '-10⁹ ≤ nums[i] ≤ 10⁹'],
    functionName: 'containsDuplicate',
    starterCode: `/**
 * @param {number[]} nums
 * @return {boolean}
 */
function containsDuplicate(nums) {
  // Write your solution here
};`,
    testCases: [
      { input: [[1, 2, 3, 1]], expected: true, description: 'Has duplicate' },
      { input: [[1, 2, 3, 4]], expected: false, description: 'All distinct' },
      { input: [[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]], expected: true, description: 'Many duplicates' },
      { input: [[1]], expected: false, description: 'Single element' },
      { input: [[-1, -1]], expected: true, description: 'Negative duplicates' },
    ],
  },
  {
    id: 'reverse-string',
    title: 'Reverse String',
    difficulty: 'Easy',
    description:
      'Write a function that reverses a string. The input is given as an array of characters `s`.\n\nYou must do this by modifying the input array **in-place** with O(1) extra memory.',
    examples: [
      { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' },
      { input: 's = ["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]' },
    ],
    constraints: ['1 ≤ s.length ≤ 10⁵', 's[i] is a printable ASCII character'],
    functionName: 'reverseString',
    starterCode: `/**
 * @param {character[]} s
 * @return {void} Modify s in-place
 */
function reverseString(s) {
  // Write your solution here
  // Return s after modification
  return s;
};`,
    testCases: [
      { input: [['h', 'e', 'l', 'l', 'o']], expected: ['o', 'l', 'l', 'e', 'h'], description: 'hello reversed' },
      { input: [['H', 'a', 'n', 'n', 'a', 'h']], expected: ['h', 'a', 'n', 'n', 'a', 'H'], description: 'Hannah reversed' },
      { input: [['a']], expected: ['a'], description: 'Single char' },
      { input: [['a', 'b']], expected: ['b', 'a'], description: 'Two chars' },
      { input: [['A', 'B', 'C', 'D']], expected: ['D', 'C', 'B', 'A'], description: 'Four chars' },
    ],
  },
];

export function pickRandomQuestion(): BattleQuestion {
  return BATTLE_QUESTIONS[Math.floor(Math.random() * BATTLE_QUESTIONS.length)];
}
