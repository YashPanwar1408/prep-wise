'use strict';

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// =============================================================================
// TEST CASE LIBRARY
// =============================================================================
// Structure per entry:
//   input   — JSON-serialised string representing the argument list.
//              Each argument occupies its own line (newline-separated).
//   output  — JSON-serialised string of the expected return value.
//   isSample — NOT set manually here; the first 3 entries per problem are
//              automatically promoted to isSample:true by insertTestCases().
//
// Rules enforced by insertTestCases():
//   * The first 3 entries in each problem array → isSample: true  ("Run")
//   * All remaining entries                     → isSample: false ("Submit")
//   * input/output MUST be valid JSON strings.
//   * No random values — every case must be deterministic.
//
// How to add a new problem:
//   1. Add a key matching the problem's DB slug.
//   2. Provide at least 3 entries (more is better — aim for 60-70).
//   3. First 3 entries should be the most representative / visible examples.
//
// Example:
//   'two-sum': [
//     { input: '[2,7,11,15]\n9',  output: '[0,1]' },   // sample 1
//     { input: '[3,2,4]\n6',      output: '[1,2]' },   // sample 2
//     { input: '[3,3]\n6',        output: '[0,1]' },   // sample 3
//     { input: '[1,4]\n5',        output: '[0,1]' },   // hidden
//   ],
// =============================================================================

const TEST_CASE_LIBRARY = {

  // =========================================================================
  // BATCH 1 — 20 Easy Problems (sorted difficulty ascending)
  // =========================================================================

  // -------------------------------------------------------------------------
  // 1. TWO SUM
  // Input:  nums (int[]) \n target (int)
  // Output: [i, j]  where nums[i]+nums[j]==target, i < j
  // -------------------------------------------------------------------------
  'two-sum': [
    // samples
    { input: '[2,7,11,15]\n9',           output: '[0,1]' },
    { input: '[3,2,4]\n6',               output: '[1,2]' },
    { input: '[3,3]\n6',                 output: '[0,1]' },
    // basic
    { input: '[1,2,3,4,5]\n9',           output: '[3,4]' },
    { input: '[5,1,2,10,4]\n11',         output: '[1,3]' },
    { input: '[0,4,3,0]\n0',             output: '[0,3]' },
    { input: '[1,2]\n3',                 output: '[0,1]' },
    { input: '[10,20,30,40,50]\n70',     output: '[2,3]' },
    { input: '[4,6,2,8]\n10',            output: '[0,1]' },
    { input: '[1,9,3,7,5]\n12',          output: '[1,2]' },
    // zeros
    { input: '[0,0]\n0',                 output: '[0,1]' },
    { input: '[0,1,0]\n0',               output: '[0,2]' },
    { input: '[1,0,-1]\n-1',             output: '[1,2]' },
    // negatives
    { input: '[-3,4,3,90]\n0',           output: '[0,2]' },
    { input: '[-1,-2,-3,-4,-5]\n-8',     output: '[2,4]' },
    { input: '[-10,20,10,-20]\n0',       output: '[0,2]' },
    { input: '[-1,0,1,2]\n1',            output: '[1,2]' },
    { input: '[-5,-3,-1,2,4]\n-4',       output: '[1,2]' },
    { input: '[7,-3,4,0,-1]\n1',         output: '[1,2]' },
    { input: '[-100,100]\n0',            output: '[0,1]' },
    // large numbers
    { input: '[1000000,500000,500000]\n1000000', output: '[1,2]' },
    { input: '[999999,1]\n1000000',       output: '[0,1]' },
    { input: '[500000,500000]\n1000000',  output: '[0,1]' },
    // duplicates
    { input: '[5,5,5,5]\n10',            output: '[0,1]' },
    { input: '[2,2,3,3]\n4',             output: '[0,1]' },
    { input: '[1,1,1,1,1]\n2',           output: '[0,1]' },
    // longer arrays
    { input: '[1,3,5,7,9,11,13,15,17,19]\n36', output: '[8,9]' },
    { input: '[2,4,6,8,10,12,14,16,18,20]\n30', output: '[6,7]' },
    { input: '[1,2,3,4,5,6,7,8,9,10]\n19',      output: '[8,9]' },
    // ordering
    { input: '[15,2,7,11,4]\n9',         output: '[1,2]' },
    { input: '[2,3,1,5,4]\n5',           output: '[0,1]' },
    { input: '[6,7,8,1,2]\n9',           output: '[2,3]' },
    { input: '[3,0,6,9,1]\n6',           output: '[1,2]' },
    // hard realistic
    { input: '[4,3,2,1]\n7',             output: '[0,1]' },
    { input: '[9,8,7,6,5]\n11',          output: '[3,4]' },
    { input: '[2,11,15,7]\n9',           output: '[0,3]' },
    { input: '[1,4,6,2,9,5]\n7',         output: '[0,2]' },
    { input: '[5,8,2,3,7]\n10',          output: '[1,2]' },
    { input: '[3,2,0,1,4,6]\n5',         output: '[0,1]' },
    { input: '[5,3,8,2,6,4]\n10',        output: '[2,3]' },
    { input: '[12,3,4,9,7,1]\n13',       output: '[2,3]' },
    { input: '[10,5,2,8,3]\n15',         output: '[0,1]' },
    { input: '[7,2,4,1,5,9]\n6',         output: '[1,2]' },
    { input: '[6,5,4,3,2,1]\n9',         output: '[1,2]' },
    { input: '[8,1,7,2,6,3]\n9',         output: '[0,1]' },
    { input: '[3,7,1,5,9,11,6]\n12',     output: '[1,3]' },
    { input: '[4,8,2,12,6,10]\n18',      output: '[3,4]' },
    { input: '[1,3,5,7,9]\n14',          output: '[2,4]' },
    { input: '[2,5,3,8,4]\n12',          output: '[3,4]' },
    { input: '[11,15,4,8,2]\n19',        output: '[1,2]' },
    { input: '[6,3,9,12,1,2]\n15',       output: '[0,2]' },
    { input: '[7,4,1,8,3]\n12',          output: '[1,3]' },
    { input: '[2,6,10,4,8]\n14',         output: '[2,3]' },
    { input: '[5,9,2,11,6]\n11',         output: '[1,2]' },
    { input: '[1,6,3,2,8,4]\n7',         output: '[0,1]' },
    { input: '[20,40,60,80,100]\n180',   output: '[3,4]' },
    { input: '[1,-1,2,-2,3]\n0',         output: '[0,1]' },
    { input: '[-7,3,-2,5,9]\n2',         output: '[0,4]' },
    { input: '[4,2,9,6,1,8]\n13',        output: '[2,5]' },
    { input: '[100,200,300,400,500]\n900', output: '[3,4]' },
    { input: '[-50,-25,75,25]\n0',       output: '[1,3]' },
    { input: '[0,4,3,0]\n3',             output: '[1,2]' },
    { input: '[5,2,8,1,4,7]\n9',         output: '[1,2]' },
    { input: '[3,5,4,2,6,1]\n8',         output: '[1,2]' },
    { input: '[13,7,4,11,9,2]\n16',      output: '[1,2]' },
  ],

  // -------------------------------------------------------------------------
  // 2. VALID ANAGRAM
  // Input:  s (string) \n t (string)
  // Output: true | false
  // -------------------------------------------------------------------------
  'valid-anagram': [
    // samples
    { input: '"anagram"\n"nagaram"', output: 'true'  },
    { input: '"rat"\n"car"',         output: 'false' },
    { input: '"listen"\n"silent"',   output: 'true'  },
    // basic true
    { input: '"a"\n"a"',             output: 'true'  },
    { input: '"ab"\n"ba"',           output: 'true'  },
    { input: '"aab"\n"baa"',         output: 'true'  },
    { input: '"cat"\n"tac"',         output: 'true'  },
    { input: '"abc"\n"bca"',         output: 'true'  },
    { input: '"aaaa"\n"aaaa"',       output: 'true'  },
    { input: '"abcdef"\n"fedcba"',   output: 'true'  },
    // basic false
    { input: '"a"\n"b"',             output: 'false' },
    { input: '"ab"\n"bc"',           output: 'false' },
    { input: '"abc"\n"abcd"',        output: 'false' },
    { input: '"a"\n"aa"',            output: 'false' },
    { input: '"hello"\n"world"',     output: 'false' },
    // different lengths
    { input: '"ab"\n"a"',            output: 'false' },
    { input: '"abc"\n"ab"',          output: 'false' },
    // same chars different counts
    { input: '"aab"\n"abb"',         output: 'false' },
    { input: '"aaab"\n"aab"',        output: 'false' },
    // single chars
    { input: '"z"\n"z"',             output: 'true'  },
    { input: '"z"\n"a"',             output: 'false' },
    // repeated letters
    { input: '"aaaaaaaaaa"\n"aaaaaaaaaa"', output: 'true'  },
    { input: '"aaaaaaaaab"\n"aaaaaaaaaa"', output: 'false' },
    // mixed letters
    { input: '"triangle"\n"integral"',    output: 'true'  },
    { input: '"dormitory"\n"dirtyroom"',   output: 'true'  },
    { input: '"angered"\n"enraged"',       output: 'true'  },
    { input: '"cinema"\n"iceman"',         output: 'true'  },
    { input: '"astronomer"\n"moon starer"', output: 'false' }, // space differs
    // edge: empty strings
    { input: '""\n""',               output: 'true'  },
    // boundary: all same letter
    { input: '"zzz"\n"zzz"',         output: 'true'  },
    { input: '"zzz"\n"zza"',         output: 'false' },
    // long true
    { input: '"abcdefghijklmnopqrstuvwxyz"\n"zyxwvutsrqponmlkjihgfedcba"', output: 'true'  },
    // long false
    { input: '"abcdefghijklmnopqrstuvwxyz"\n"abcdefghijklmnopqrstuvwxyy"', output: 'false' },
    // duplicate heavy
    { input: '"aabbccdd"\n"ddccbbaa"', output: 'true'  },
    { input: '"aabbccdd"\n"aabbccde"', output: 'false' },
    // medium anagrams
    { input: '"earth"\n"heart"',     output: 'true'  },
    { input: '"smile"\n"miles"',     output: 'true'  },
    { input: '"silent"\n"enlist"',   output: 'true'  },
    { input: '"boast"\n"boats"',     output: 'true'  },
    { input: '"dusty"\n"study"',     output: 'true'  },
    { input: '"night"\n"thing"',     output: 'true'  },
    // near-miss false
    { input: '"night"\n"thins"',     output: 'false' },
    { input: '"smile"\n"smiles"',    output: 'false' },
    { input: '"abcd"\n"abce"',       output: 'false' },
    { input: '"abc"\n"cba"',         output: 'true'  },
    { input: '"ab"\n"ab"',           output: 'true'  },
    // stress
    { input: '"aaabbbccc"\n"cccbbbaaa"', output: 'true'  },
    { input: '"aaabbbccc"\n"cccbbbaa"',  output: 'false' },
    { input: '"xyzxyz"\n"zzyyxx"',       output: 'true'  },
    { input: '"xyzxyz"\n"zzyyx"',        output: 'false' },
    // two-char same
    { input: '"aa"\n"aa"', output: 'true'  },
    { input: '"aa"\n"ab"', output: 'false' },
    // one extra char
    { input: '"abcde"\n"abcdf"', output: 'false' },
    { input: '"abcde"\n"abced"', output: 'true'  },
    { input: '"abcde"\n"abcee"', output: 'false' },
    { input: '"racecar"\n"carrace"', output: 'true'  },
    { input: '"noon"\n"nono"', output: 'true'  },
    { input: '"noon"\n"mono"', output: 'false' },
    { input: '"pots"\n"stop"', output: 'true'  },
    { input: '"pots"\n"tops"', output: 'true'  },
    { input: '"god"\n"dog"',   output: 'true'  },
    { input: '"god"\n"doe"',   output: 'false' },
  ],

  // -------------------------------------------------------------------------
  // 3. CONTAINS DUPLICATE
  // Input:  nums (int[])
  // Output: true | false
  // -------------------------------------------------------------------------
  'contains-duplicate': [
    // samples
    { input: '[1,2,3,1]',     output: 'true'  },
    { input: '[1,2,3,4]',     output: 'false' },
    { input: '[1,1,1,3,3,4,3,2,4,2]', output: 'true' },
    // basic true
    { input: '[1,1]',         output: 'true'  },
    { input: '[0,0]',         output: 'true'  },
    { input: '[5,5,5,5]',     output: 'true'  },
    { input: '[1,2,3,4,5,1]', output: 'true'  },
    { input: '[10,9,8,7,6,5,4,3,2,1,2]', output: 'true'  },
    // basic false
    { input: '[1]',           output: 'false' },
    { input: '[1,2]',         output: 'false' },
    { input: '[1,2,3]',       output: 'false' },
    { input: '[0,1,2,3,4,5]', output: 'false' },
    // negatives true
    { input: '[-1,-1]',       output: 'true'  },
    { input: '[-1,0,1,-1]',   output: 'true'  },
    // negatives false
    { input: '[-3,-2,-1,0,1,2,3]', output: 'false' },
    { input: '[-1,0,1]',      output: 'false' },
    // large values
    { input: '[1000000000,999999999,1000000000]', output: 'true'  },
    { input: '[-1000000000,1000000000]',          output: 'false' },
    // single element
    { input: '[42]',          output: 'false' },
    { input: '[0]',           output: 'false' },
    // all same
    { input: '[7,7,7,7,7]',   output: 'true'  },
    // duplicate at end
    { input: '[1,2,3,4,5,5]', output: 'true'  },
    { input: '[1,2,3,4,5,6,7,8,9,10,10]', output: 'true' },
    // duplicate at start
    { input: '[3,1,2,4,5]',   output: 'false' },
    { input: '[3,3,1,2,4,5]', output: 'true'  },
    // mixed pos/neg no dup
    { input: '[-5,-4,-3,-2,-1,0,1,2,3,4,5]', output: 'false' },
    // mixed pos/neg with dup
    { input: '[-5,-4,-3,-2,-1,0,1,2,3,4,-5]', output: 'true' },
    // larger no-dup
    { input: '[10,20,30,40,50,60,70,80,90,100]', output: 'false' },
    // two elements same
    { input: '[2,2]',    output: 'true'  },
    { input: '[2,3]',    output: 'false' },
    // zero duplicate
    { input: '[0,0,0]',  output: 'true'  },
    // boundary min
    { input: '[-1000000000,-1000000000]', output: 'true'  },
    // boundary max
    { input: '[1000000000, 999999998, 999999999]', output: 'false' },
    // stress 10 unique
    { input: '[1,2,3,4,5,6,7,8,9,10]', output: 'false' },
    { input: '[1,2,3,4,5,6,7,8,9,1]',  output: 'true'  },
    // duplicate second
    { input: '[4,4]', output: 'true'  },
    // unsorted with dup
    { input: '[5,3,7,1,3,9]', output: 'true'  },
    { input: '[5,3,7,1,4,9]', output: 'false' },
    // three same
    { input: '[9,9,9]', output: 'true' },
    // alternate
    { input: '[1,2,1,2,1,2]', output: 'true' },
    // long unique
    { input: '[11,22,33,44,55,66,77,88,99,100,111,122]', output: 'false' },
    // long with dup
    { input: '[11,22,33,44,55,66,77,88,99,100,111,11]',  output: 'true'  },
    { input: '[0]',           output: 'false' },
    { input: '[100,200,300]', output: 'false' },
    { input: '[100,200,100]', output: 'true'  },
    { input: '[-10,10,-10]',  output: 'true'  },
    { input: '[-10,10,20]',   output: 'false' },
    { input: '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]', output: 'false' },
    { input: '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,1]',  output: 'true'  },
  ],

  // -------------------------------------------------------------------------
  // 4. VALID PALINDROME
  // Input:  s (string)
  // Output: true | false
  // Clean alphanumeric, lowercase, then two-pointer check
  // -------------------------------------------------------------------------
  'valid-palindrome': [
    // samples
    { input: '"A man, a plan, a canal: Panama"', output: 'true'  },
    { input: '"race a car"',                     output: 'false' },
    { input: '" "',                              output: 'true'  },
    // basic true
    { input: '"a"',               output: 'true'  },
    { input: '"aa"',              output: 'true'  },
    { input: '"aba"',             output: 'true'  },
    { input: '"abba"',            output: 'true'  },
    { input: '"abcba"',           output: 'true'  },
    { input: '"racecar"',         output: 'true'  },
    { input: '"No lemon, no melon"', output: 'true'  },
    { input: '"Was it a car or a cat I saw"', output: 'true' },
    // basic false
    { input: '"ab"',              output: 'false' },
    { input: '"abc"',             output: 'false' },
    { input: '"hello"',           output: 'false' },
    { input: '"world"',           output: 'false' },
    // pure alphanumeric
    { input: '"121"',             output: 'true'  },
    { input: '"1221"',            output: 'true'  },
    { input: '"12321"',           output: 'true'  },
    { input: '"123"',             output: 'false' },
    // only non-alphanumeric
    { input: '",.,."',            output: 'true'  },
    { input: '"!!!"',             output: 'true'  },
    { input: '"  "',              output: 'true'  },
    // mixed
    { input: '"A1B2B1A"',         output: 'true'  },
    { input: '"0P0"',             output: 'true'  },
    { input: '"0P1"',             output: 'false' },
    { input: '"Eva, can I see bees in a cave?"', output: 'true' },
    { input: '"Madam, I\'m Adam"',  output: 'true' },
    { input: '"Never odd or even"', output: 'true' },
    { input: '"Do geese see God?"', output: 'true' },
    // single digit / letter
    { input: '"1"',               output: 'true'  },
    { input: '"z"',               output: 'true'  },
    // two same
    { input: '"bb"',              output: 'true'  },
    { input: '"11"',              output: 'true'  },
    // two different
    { input: '"ab"',              output: 'false' },
    { input: '"12"',              output: 'false' },
    // punctuation only (empty after clean → palindrome)
    { input: '"..."',             output: 'true'  },
    { input: '"-"',               output: 'true'  },
    // case insensitive
    { input: '"AbBa"',            output: 'true'  },
    { input: '"AbCbA"',           output: 'true'  },
    { input: '"AbCdA"',           output: 'false' },
    // long palindrome
    { input: '"Able was I ere I saw Elba"', output: 'true'  },
    // near palindrome
    { input: '"abcbad"',          output: 'false' },
    { input: '"abccba"',          output: 'true'  },
    // numbers with spaces
    { input: '"1 0 0 1"',         output: 'true'  },
    { input: '"1 2 3 2 1"',       output: 'true'  },
    { input: '"1 2 3 4 5"',       output: 'false' },
    // stress
    { input: '"aaaaaaaaaaaaaaaaaaaaa"',          output: 'true'  },
    { input: '"aaaaaaaaaaaaaaaaaaaaab"',         output: 'false' },
    { input: '"ababababababababababa"',           output: 'true'  },
    { input: '"abababababababababab"',            output: 'false' },
    { input: '"step on no pets"',                output: 'true'  },
    { input: '"a Toyota\'s a Toyota"',           output: 'true'  },
    { input: '"Mr. Owl ate my metal worm"',      output: 'true'  },
    { input: '"Not a palindrome"',               output: 'false' },
    { input: '"kayak"',                          output: 'true'  },
    { input: '"level"',                          output: 'true'  },
    { input: '"civic"',                          output: 'true'  },
    { input: '"noon"',                           output: 'true'  },
    { input: '"radar"',                          output: 'true'  },
    { input: '"deified"',                        output: 'true'  },
    { input: '"repaper"',                        output: 'true'  },
    { input: '"rotator"',                        output: 'true'  },
    { input: '"reviver"',                        output: 'true'  },
    { input: '"abcde"',                          output: 'false' },
  ],

  // -------------------------------------------------------------------------
  // 5. BEST TIME TO BUY AND SELL STOCK
  // Input:  prices (int[])
  // Output: maxProfit (int)
  // -------------------------------------------------------------------------
  'best-time-to-buy-and-sell-stock': [
    // samples
    { input: '[7,1,5,3,6,4]', output: '5' },
    { input: '[7,6,4,3,1]',   output: '0' },
    { input: '[1,2]',         output: '1' },
    // basic
    { input: '[2,4,1]',       output: '2' },
    { input: '[3,2,6,5,0,3]', output: '4' },
    { input: '[1]',           output: '0' },
    { input: '[2,1]',         output: '0' },
    { input: '[1,2,3,4,5]',   output: '4' },
    { input: '[5,4,3,2,1]',   output: '0' },
    { input: '[2,2]',         output: '0' },
    // zeros
    { input: '[0,1]',         output: '1' },
    { input: '[0,0]',         output: '0' },
    { input: '[0,1,0,2,0,3]', output: '3' },
    // single element
    { input: '[5]',           output: '0' },
    { input: '[1000]',        output: '0' },
    // all same
    { input: '[3,3,3,3]',     output: '0' },
    // large jump
    { input: '[1,10000]',     output: '9999' },
    { input: '[10000,1]',     output: '0' },
    // profit at end
    { input: '[3,1,4,1,5,9,2,6]', output: '8' },
    // valley then peak
    { input: '[10,5,3,1,7]',      output: '6' },
    { input: '[10,1,10]',         output: '9' },
    { input: '[2,1,4]',           output: '3' },
    // already sorted
    { input: '[1,2,3,4,5,6,7,8,9,10]', output: '9' },
    // reversed sorted
    { input: '[10,9,8,7,6,5,4,3,2,1]', output: '0' },
    // plateau then rise
    { input: '[5,5,5,10]',         output: '5' },
    { input: '[5,5,5,3]',          output: '0' },
    // sawtooth
    { input: '[3,1,3,1,3]',        output: '2' },
    // two elements profit
    { input: '[1,3]',              output: '2' },
    { input: '[3,1]',              output: '0' },
    // three elements
    { input: '[3,2,1]',            output: '0' },
    { input: '[1,3,2]',            output: '2' },
    // buy first sell last
    { input: '[1,2,3,4,100]',      output: '99' },
    // dip then plateau
    { input: '[9,3,3,3,3,3]',      output: '0' },
    // max profit middle
    { input: '[4,1,7,3,8,2]',      output: '7' },
    { input: '[6,3,5,1,8,2]',      output: '7' },
    // large values
    { input: '[1,100000]',         output: '99999' },
    { input: '[100000,1]',         output: '0'     },
    // stress ascending
    { input: '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]', output: '14' },
    // stress descending
    { input: '[15,14,13,12,11,10,9,8,7,6,5,4,3,2,1]', output: '0'  },
    // best buy first day sell last
    { input: '[1,5,2,8,3,7]',      output: '7' },
    { input: '[10,2,9]',           output: '7' },
    { input: '[5,1,3,2,7]',        output: '6' },
    // no profit possible (equal)
    { input: '[4,4,4,4]',          output: '0' },
    // one drop one rise
    { input: '[8,4,6]',            output: '2' },
    // longer realistic
    { input: '[9,7,4,2,8,6,1,3]',  output: '6' },
    { input: '[2,3,10,6,4,8,1]',   output: '8' },
    { input: '[3,3,5,0,0,3,1,4]',  output: '4' },
    { input: '[1,3,1,3,1,3]',      output: '2' },
    { input: '[7,2,5,1,8]',        output: '7' },
    { input: '[1,6,1,6,1]',        output: '5' },
    { input: '[4,8,2,9,1,7]',      output: '7' },
    { input: '[100,80,60,40,20,10,50]', output: '40' },
    { input: '[1,1,1,1,2]',        output: '1' },
    { input: '[2,1,1,1,1]',        output: '0' },
  ],

  // -------------------------------------------------------------------------
  // 6. VALID PARENTHESES
  // Input:  s (string)
  // Output: true | false
  // -------------------------------------------------------------------------
  'valid-parentheses': [
    // samples
    { input: '"()"',     output: 'true'  },
    { input: '"()[]{}"', output: 'true'  },
    { input: '"(]"',     output: 'false' },
    // basic true
    { input: '"[]"',     output: 'true'  },
    { input: '"{}"',     output: 'true'  },
    { input: '"[{}]"',   output: 'true'  },
    { input: '"({})"',   output: 'true'  },
    { input: '"[()]"',   output: 'true'  },
    // basic false
    { input: '"("',      output: 'false' },
    { input: '")"',      output: 'false' },
    { input: '"["',      output: 'false' },
    { input: '"]"',      output: 'false' },
    { input: '"{"',      output: 'false' },
    { input: '"}"',      output: 'false' },
    { input: '"[}"',     output: 'false' },
    { input: '"{]"',     output: 'false' },
    // complex true
    { input: '"({[]})"',        output: 'true'  },
    { input: '"(())"',          output: 'true'  },
    { input: '"[[]]"',          output: 'true'  },
    { input: '"{{}}"',          output: 'true'  },
    { input: '"()[]{()}[{}]"',  output: 'true'  },
    { input: '"({[{}]})"',      output: 'true'  },
    { input: '"((()))"',        output: 'true'  },
    { input: '"(())(())"',      output: 'true'  },
    { input: '"(({}[]))"',      output: 'true'  },
    // complex false
    { input: '"([)]"',          output: 'false' },
    { input: '"[({)}]"',        output: 'false' },
    { input: '"(((("',          output: 'false' },
    { input: '"))"',            output: 'false' },
    { input: '"(()("',          output: 'false' },
    { input: '"({[)]}"]',       output: 'false' },
    { input: '"[{]}"',          output: 'false' },
    // empty string (truthy)
    { input: '""',              output: 'true'  },
    // long valid
    { input: '"()()()()()"',                     output: 'true'  },
    { input: '"[][][][][]"',                     output: 'true'  },
    { input: '"{}{}{}{}{}",',                    output: 'true'  },
    { input: '"([]{}[{}])()"',                   output: 'true'  },
    // long invalid
    { input: '"((((((((((((((((((((("',          output: 'false' },
    { input: '"))))))))))))))))))))))"',          output: 'false' },
    // alternating
    { input: '"()()()()()()()()()() "',          output: 'true'  },
    // nested deep valid
    { input: '"(({{[[(())]]}})) "',              output: 'true'  },
    // one extra
    { input: '"())"',                            output: 'false' },
    { input: '"(()"',                            output: 'false' },
    // tricky
    { input: '")("',  output: 'false' },
    { input: '"]["',  output: 'false' },
    { input: '"}{"',  output: 'false' },
    { input: '"({[]})()"', output: 'true'  },
    { input: '"({[]}){}"', output: 'true'  },
    { input: '"({[]})]"',  output: 'false' },
    { input: '"(((())))"', output: 'true'  },
    { input: '"(((()))}"', output: 'false' },
    { input: '"({[]})"',   output: 'true'  },
    { input: '"({]})"',    output: 'false' },
    { input: '"([{}])"',   output: 'true'  },
    { input: '"([{)}]"',   output: 'false' },
    { input: '"((({})))"', output: 'true'  },
    { input: '"((({}))"',  output: 'false' },
  ],

  // -------------------------------------------------------------------------
  // 7. BINARY SEARCH
  // Input:  nums (sorted int[]) \n target (int)
  // Output: index (int) or -1
  // -------------------------------------------------------------------------
  'binary-search': [
    // samples
    { input: '[-1,0,3,5,9,12]\n9',    output: '4' },
    { input: '[-1,0,3,5,9,12]\n2',    output: '-1' },
    { input: '[5]\n5',                 output: '0' },
    // basic found
    { input: '[1,2,3,4,5]\n1',         output: '0' },
    { input: '[1,2,3,4,5]\n3',         output: '2' },
    { input: '[1,2,3,4,5]\n5',         output: '4' },
    { input: '[2,5,8,12,16,23,38,56,72,91]\n23', output: '5' },
    // basic not found
    { input: '[1,2,3,4,5]\n6',         output: '-1' },
    { input: '[1,2,3,4,5]\n0',         output: '-1' },
    { input: '[2,4,6,8,10]\n5',        output: '-1' },
    // single element found
    { input: '[1]\n1',                 output: '0' },
    { input: '[42]\n42',               output: '0' },
    // single element not found
    { input: '[1]\n2',                 output: '-1' },
    { input: '[42]\n0',                output: '-1' },
    // two elements
    { input: '[1,2]\n1',               output: '0' },
    { input: '[1,2]\n2',               output: '1' },
    { input: '[1,2]\n3',               output: '-1' },
    // negatives found
    { input: '[-10,-5,0,5,10]\n-10',   output: '0' },
    { input: '[-10,-5,0,5,10]\n0',     output: '2' },
    { input: '[-10,-5,0,5,10]\n10',    output: '4' },
    // negatives not found
    { input: '[-10,-5,0,5,10]\n-3',    output: '-1' },
    { input: '[-10,-5,0,5,10]\n7',     output: '-1' },
    // boundary left
    { input: '[1,3,5,7,9,11]\n1',      output: '0' },
    // boundary right
    { input: '[1,3,5,7,9,11]\n11',     output: '5' },
    // middle
    { input: '[1,3,5,7,9,11]\n5',      output: '2' },
    // large array first element
    { input: '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]\n1',  output: '0'  },
    // large array last element
    { input: '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]\n20', output: '19' },
    // large array middle element
    { input: '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]\n10', output: '9'  },
    // large array not found
    { input: '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]\n21', output: '-1' },
    // even length found mid-left
    { input: '[2,4,6,8]\n4',            output: '1' },
    // even length found mid-right
    { input: '[2,4,6,8]\n6',            output: '2' },
    // target less than all
    { input: '[10,20,30,40,50]\n5',     output: '-1' },
    // target greater than all
    { input: '[10,20,30,40,50]\n60',    output: '-1' },
    // two-power sized
    { input: '[1,3,5,7,9,11,13,15]\n13', output: '6' },
    { input: '[1,3,5,7,9,11,13,15]\n7',  output: '3' },
    { input: '[1,3,5,7,9,11,13,15]\n1',  output: '0' },
    { input: '[1,3,5,7,9,11,13,15]\n15', output: '7' },
    { input: '[1,3,5,7,9,11,13,15]\n4',  output: '-1' },
    // stress
    { input: '[100,200,300,400,500,600,700,800,900,1000]\n500', output: '4' },
    { input: '[100,200,300,400,500,600,700,800,900,1000]\n100', output: '0' },
    { input: '[100,200,300,400,500,600,700,800,900,1000]\n1000',output: '9' },
    { input: '[100,200,300,400,500,600,700,800,900,1000]\n550', output: '-1' },
    { input: '[-100,-50,0,50,100]\n-50', output: '1' },
    { input: '[-100,-50,0,50,100]\n50',  output: '3' },
    { input: '[-100,-50,0,50,100]\n25',  output: '-1' },
    { input: '[0]\n0',                   output: '0' },
    { input: '[0]\n1',                   output: '-1' },
    { input: '[0,1]\n0',                 output: '0' },
    { input: '[0,1]\n1',                 output: '1' },
    { input: '[0,1]\n2',                 output: '-1' },
    { input: '[3,6,9,12,15,18,21,24,27,30]\n21', output: '6' },
    { input: '[3,6,9,12,15,18,21,24,27,30]\n22', output: '-1' },
  ],

  // -------------------------------------------------------------------------
  // 8. REVERSE LINKED LIST
  // Represented as array; output is reversed array
  // Input:  head (int[])
  // Output: int[]
  // -------------------------------------------------------------------------
  'reverse-linked-list': [
    // samples
    { input: '[1,2,3,4,5]', output: '[5,4,3,2,1]' },
    { input: '[1,2]',        output: '[2,1]' },
    { input: '[1]',          output: '[1]' },
    // empty
    { input: '[]',           output: '[]' },
    // two elements
    { input: '[3,4]',        output: '[4,3]' },
    // three elements
    { input: '[1,2,3]',      output: '[3,2,1]' },
    { input: '[3,2,1]',      output: '[1,2,3]' },
    // negatives
    { input: '[-1,-2,-3]',   output: '[-3,-2,-1]' },
    { input: '[-5,0,5]',     output: '[5,0,-5]'   },
    // duplicates
    { input: '[1,1,1,1]',    output: '[1,1,1,1]' },
    { input: '[2,2,3,3]',    output: '[3,3,2,2]' },
    // already reversed
    { input: '[5,4,3,2,1]',  output: '[1,2,3,4,5]' },
    // zeros
    { input: '[0,0,0]',      output: '[0,0,0]' },
    { input: '[0,1,0]',      output: '[0,1,0]' },
    // single zero
    { input: '[0]',          output: '[0]' },
    // large values
    { input: '[100,200,300,400,500]', output: '[500,400,300,200,100]' },
    // mixed
    { input: '[-3,0,3]',     output: '[3,0,-3]' },
    { input: '[1,-1,2,-2]',  output: '[-2,2,-1,1]' },
    // longer
    { input: '[1,2,3,4,5,6,7,8,9,10]', output: '[10,9,8,7,6,5,4,3,2,1]' },
    // palindrome list (same reversed)
    { input: '[1,2,3,2,1]',  output: '[1,2,3,2,1]' },
    { input: '[1,2,2,1]',    output: '[1,2,2,1]' },
    // various lengths
    { input: '[7]',          output: '[7]' },
    { input: '[7,8]',        output: '[8,7]' },
    { input: '[7,8,9]',      output: '[9,8,7]' },
    { input: '[7,8,9,10]',   output: '[10,9,8,7]' },
    // stress
    { input: '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]',
      output: '[20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1]' },
    { input: '[0,0,1,1,2,2]', output: '[2,2,1,1,0,0]' },
    { input: '[5,4,3,2,1,0]', output: '[0,1,2,3,4,5]' },
    { input: '[10,9,8,7,6]',  output: '[6,7,8,9,10]'  },
    { input: '[1,3,5,7]',     output: '[7,5,3,1]'      },
    { input: '[2,4,6,8]',     output: '[8,6,4,2]'      },
    { input: '[9,0,7,0,5]',   output: '[5,0,7,0,9]'    },
    { input: '[3,1,4,1,5,9,2,6]', output: '[6,2,9,5,1,4,1,3]' },
    { input: '[100]',             output: '[100]'       },
    { input: '[100,99]',          output: '[99,100]'    },
    { input: '[-1,0,1]',          output: '[1,0,-1]'   },
    { input: '[1,0,-1]',          output: '[-1,0,1]'   },
    { input: '[1,1,2,2,3,3,4,4]', output: '[4,4,3,3,2,2,1,1]' },
    { input: '[10,10,10]',        output: '[10,10,10]' },
    { input: '[1,2,3,4,5,6]',     output: '[6,5,4,3,2,1]' },
    { input: '[6,5,4,3,2,1]',     output: '[1,2,3,4,5,6]' },
    { input: '[0,1,2,3,4,5,6,7,8,9]', output: '[9,8,7,6,5,4,3,2,1,0]' },
  ],

  // -------------------------------------------------------------------------
  // 9. MERGE TWO SORTED LISTS
  // Represented as two arrays; output is merged sorted array
  // Input:  list1 (int[]) \n list2 (int[])
  // Output: int[]
  // -------------------------------------------------------------------------
  'merge-two-sorted-lists': [
    // samples
    { input: '[1,2,4]\n[1,3,4]',   output: '[1,1,2,3,4,4]' },
    { input: '[]\n[]',              output: '[]'             },
    { input: '[]\n[0]',             output: '[0]'            },
    // basic
    { input: '[1]\n[1]',            output: '[1,1]'          },
    { input: '[1]\n[2]',            output: '[1,2]'          },
    { input: '[2]\n[1]',            output: '[1,2]'          },
    { input: '[1,3]\n[2,4]',        output: '[1,2,3,4]'      },
    { input: '[1,2,3]\n[4,5,6]',    output: '[1,2,3,4,5,6]'  },
    { input: '[4,5,6]\n[1,2,3]',    output: '[1,2,3,4,5,6]'  },
    // one empty
    { input: '[1,2,3]\n[]',         output: '[1,2,3]'        },
    { input: '[]\n[1,2,3]',         output: '[1,2,3]'        },
    // duplicates
    { input: '[1,1,1]\n[1,1,1]',    output: '[1,1,1,1,1,1]'  },
    { input: '[1,2]\n[1,2]',        output: '[1,1,2,2]'       },
    // negatives
    { input: '[-3,-2,-1]\n[-4,0,4]',output: '[-4,-3,-2,-1,0,4]' },
    { input: '[-5,-3]\n[-4,-2]',    output: '[-5,-4,-3,-2]'   },
    // single element each
    { input: '[5]\n[1]',            output: '[1,5]'           },
    { input: '[5]\n[5]',            output: '[5,5]'           },
    // interleaved
    { input: '[1,3,5,7]\n[2,4,6,8]',output: '[1,2,3,4,5,6,7,8]' },
    { input: '[2,4,6,8]\n[1,3,5,7]',output: '[1,2,3,4,5,6,7,8]' },
    // one much longer
    { input: '[1,2,3,4,5,6,7,8,9,10]\n[5]', output: '[1,2,3,4,5,5,6,7,8,9,10]' },
    // all same
    { input: '[2,2,2]\n[2,2,2]',    output: '[2,2,2,2,2,2]'   },
    // large values
    { input: '[100,200,300]\n[150,250,350]', output: '[100,150,200,250,300,350]' },
    // zeros
    { input: '[0,0]\n[0,0]',        output: '[0,0,0,0]'        },
    { input: '[0]\n[1]',            output: '[0,1]'             },
    // negative and positive
    { input: '[-10,0,10]\n[-5,5]',  output: '[-10,-5,0,5,10]'  },
    // one element and multi
    { input: '[3]\n[1,2,4,5]',      output: '[1,2,3,4,5]'      },
    { input: '[0]\n[-1,1]',         output: '[-1,0,1]'          },
    // stress
    { input: '[1,3,5,7,9]\n[2,4,6,8,10]', output: '[1,2,3,4,5,6,7,8,9,10]' },
    { input: '[1,2,3,4,5]\n[6,7,8,9,10]', output: '[1,2,3,4,5,6,7,8,9,10]' },
    { input: '[6,7,8,9,10]\n[1,2,3,4,5]', output: '[1,2,3,4,5,6,7,8,9,10]' },
    // tie at boundaries
    { input: '[1,5]\n[5,9]',        output: '[1,5,5,9]'  },
    { input: '[1,5]\n[0,5]',        output: '[0,1,5,5]'  },
    // length difference
    { input: '[1]\n[1,2,3,4,5,6,7,8,9]', output: '[1,1,2,3,4,5,6,7,8,9]' },
    // all negative
    { input: '[-5,-3,-1]\n[-6,-4,-2]', output: '[-6,-5,-4,-3,-2,-1]' },
    // two sorted equal
    { input: '[1,2,3]\n[1,2,3]',    output: '[1,1,2,2,3,3]'     },
    // edge single zeros
    { input: '[0]\n[0]',            output: '[0,0]'              },
    { input: '[-1]\n[1]',           output: '[-1,1]'             },
    { input: '[1000]\n[999]',        output: '[999,1000]'         },
    { input: '[1,4,7]\n[2,5,8]',     output: '[1,2,4,5,7,8]'    },
    { input: '[3,6,9]\n[1,4,7]',     output: '[1,3,4,6,7,9]'    },
    { input: '[10,20]\n[15,25]',     output: '[10,15,20,25]'     },
    { input: '[5,10,15]\n[5,10,15]', output: '[5,5,10,10,15,15]' },
  ],

  // -------------------------------------------------------------------------
  // 10. LINKED LIST CYCLE
  // Input: pos = index of tail-to-node connection (-1 = no cycle)
  // We encode the problem as: does array with given pos have cycle?
  // Judge receives: [head_values_array, pos]  → true/false
  // Input:  nums (int[]) \n pos (int)
  // Output: true | false
  // -------------------------------------------------------------------------
  'linked-list-cycle': [
    // samples
    { input: '[3,2,0,-4]\n1',   output: 'true'  },
    { input: '[1,2]\n0',        output: 'true'  },
    { input: '[1]\n-1',         output: 'false' },
    // no cycle
    { input: '[1,2,3,4,5]\n-1', output: 'false' },
    { input: '[1]\n-1',         output: 'false' },
    { input: '[]\n-1',          output: 'false' },
    { input: '[1,2]\n-1',       output: 'false' },
    { input: '[1,2,3]\n-1',     output: 'false' },
    // cycle to head
    { input: '[1,2,3,4,5]\n0',  output: 'true'  },
    { input: '[1]\n0',          output: 'true'  },
    { input: '[1,2]\n0',        output: 'true'  },
    // cycle to various positions
    { input: '[1,2,3,4,5]\n1',  output: 'true'  },
    { input: '[1,2,3,4,5]\n2',  output: 'true'  },
    { input: '[1,2,3,4,5]\n3',  output: 'true'  },
    { input: '[1,2,3,4,5]\n4',  output: 'true'  },
    // cycle at last → self loop
    { input: '[1,2,3]\n2',      output: 'true'  },
    { input: '[5]\n0',          output: 'true'  },
    // longer no cycle
    { input: '[1,2,3,4,5,6,7,8,9,10]\n-1', output: 'false' },
    // longer with cycle
    { input: '[1,2,3,4,5,6,7,8,9,10]\n0',  output: 'true'  },
    { input: '[1,2,3,4,5,6,7,8,9,10]\n5',  output: 'true'  },
    { input: '[1,2,3,4,5,6,7,8,9,10]\n9',  output: 'true'  },
    // two-node cycle
    { input: '[3,2]\n1',        output: 'true'  },
    // negatives no cycle
    { input: '[-1,-2,-3]\n-1',  output: 'false' },
    // negatives with cycle
    { input: '[-1,-2,-3]\n0',   output: 'true'  },
    // zeros
    { input: '[0,0,0]\n-1',     output: 'false' },
    { input: '[0,0,0]\n1',      output: 'true'  },
    // single no cycle
    { input: '[100]\n-1',       output: 'false' },
    // single cycle
    { input: '[100]\n0',        output: 'true'  },
    // three nodes various
    { input: '[1,2,3]\n0',      output: 'true'  },
    { input: '[1,2,3]\n1',      output: 'true'  },
    // four nodes
    { input: '[1,2,3,4]\n-1',   output: 'false' },
    { input: '[1,2,3,4]\n0',    output: 'true'  },
    { input: '[1,2,3,4]\n2',    output: 'true'  },
    { input: '[1,2,3,4]\n3',    output: 'true'  },
    // stress large no cycle
    { input: '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]\n-1', output: 'false' },
    // stress large with cycle
    { input: '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]\n10', output: 'true' },
    { input: '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]\n0',  output: 'true' },
    // identical values no cycle
    { input: '[5,5,5,5,5]\n-1', output: 'false' },
    // identical values cycle
    { input: '[5,5,5,5,5]\n2',  output: 'true'  },
    // head cycle (tail→head)
    { input: '[10,20,30,40,50]\n0',  output: 'true'  },
    { input: '[10,20,30,40,50]\n-1', output: 'false' },
    // two element no cycle
    { input: '[7,8]\n-1',       output: 'false' },
    // large single
    { input: '[999999]\n-1',    output: 'false' },
    { input: '[999999]\n0',     output: 'true'  },
    // pos = last index
    { input: '[1,2,3,4,5,6]\n5',   output: 'true'  },
    { input: '[1,2,3,4,5,6]\n-1',  output: 'false' },
    { input: '[0,1,2]\n1',         output: 'true'  },
    { input: '[0,1,2]\n-1',        output: 'false' },
  ],

  // -------------------------------------------------------------------------
  // 11. INVERT BINARY TREE
  // Input:  root (int[] level-order, null for absent)
  // Output: int[] level-order
  // -------------------------------------------------------------------------
  'invert-binary-tree': [
    // samples
    { input: '[4,2,7,1,3,6,9]',       output: '[4,7,2,9,6,3,1]' },
    { input: '[2,1,3]',               output: '[2,3,1]'          },
    { input: '[]',                    output: '[]'               },
    // single node
    { input: '[1]',                   output: '[1]'              },
    // two nodes
    { input: '[1,2]',                 output: '[1,null,2]'       },
    { input: '[1,null,2]',            output: '[1,2]'            },
    // three nodes
    { input: '[1,2,3]',               output: '[1,3,2]'          },
    // four nodes
    { input: '[1,2,3,4]',             output: '[1,3,2,null,null,null,4]' },
    // complete tree depth 3
    { input: '[1,2,3,4,5,6,7]',       output: '[1,3,2,7,6,5,4]' },
    // involution (invert twice = original)
    { input: '[4,7,2,9,6,3,1]',       output: '[4,2,7,1,3,6,9]' },
    // left-skewed
    { input: '[1,2,null,3,null,null,null]', output: '[1,null,2,null,3]' },
    // right-skewed
    { input: '[1,null,2,null,null,null,3]', output: '[1,2,null,3]'      },
    // all same values
    { input: '[5,5,5,5,5,5,5]',       output: '[5,5,5,5,5,5,5]' },
    // negatives
    { input: '[-1,-2,-3]',            output: '[-1,-3,-2]'       },
    { input: '[0,-1,1]',              output: '[0,1,-1]'         },
    // deeper tree
    { input: '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]',
      output: '[1,3,2,7,6,5,4,15,14,13,12,11,10,9,8]' },
    // right-only chain length 4
    { input: '[1,null,2,null,null,null,3,null,null,null,null,null,null,null,4]',
      output: '[1,2,null,3,null,4]' },
    // single child alternating
    { input: '[1,2,null,3]',       output: '[1,null,2,3]'  },
    { input: '[1,null,2,null,3]',  output: '[1,2,null,null,3]' },
    // pairs
    { input: '[6,3,9]',           output: '[6,9,3]' },
    { input: '[10,5,15]',         output: '[10,15,5]' },
    { input: '[8,3,10,1,6,null,14]', output: '[8,10,3,14,null,6,1]' },
    // zeros
    { input: '[0,0,0]',           output: '[0,0,0]' },
    { input: '[0,null,0]',        output: '[0,0]'   },
    // one left child
    { input: '[5,3]',             output: '[5,null,3]' },
    // one right child
    { input: '[5,null,3]',        output: '[5,3]' },
    // large values
    { input: '[1000,500,1500]',   output: '[1000,1500,500]' },
    // depth 2 with null
    { input: '[1,2,3,4,null,null,5]', output: '[1,3,2,5,null,null,4]' },
    // stress balanced depth 4
    { input: '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]',
      output: '[1,3,2,7,6,5,4,15,14,13,12,11,10,9,8,31,30,29,28,27,26,25,24,23,22,21,20,19,18,17,16]' },
    { input: '[7,3,9,1,5,8,10]',  output: '[7,9,3,10,8,5,1]' },
    { input: '[2,1,4,null,null,3,5]', output: '[2,4,1,5,3]'   },
    { input: '[100,50,150,25,75,125,175]', output: '[100,150,50,175,125,75,25]' },
  ],

  // -------------------------------------------------------------------------
  // 12. MAXIMUM DEPTH OF BINARY TREE
  // Input:  root (int[] level-order)
  // Output: depth (int)
  // -------------------------------------------------------------------------
  'maximum-depth-of-binary-tree': [
    // samples
    { input: '[3,9,20,null,null,15,7]', output: '3' },
    { input: '[1,null,2]',              output: '2' },
    { input: '[]',                      output: '0' },
    // single node
    { input: '[1]',                     output: '1' },
    { input: '[42]',                    output: '1' },
    // two nodes
    { input: '[1,2]',                   output: '2' },
    { input: '[1,null,2]',              output: '2' },
    // three nodes
    { input: '[1,2,3]',                 output: '2' },
    // depth 3 complete
    { input: '[1,2,3,4,5,6,7]',         output: '3' },
    // depth 4 complete
    { input: '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]', output: '4' },
    // left skewed depth 4
    { input: '[1,2,null,3,null,null,null]',             output: '3' },
    // right skewed depth 5
    { input: '[1,null,2,null,null,null,3,null,null,null,null,null,null,null,4]', output: '4' },
    // left skewed depth 5
    { input: '[1,2,null,3,null,null,null,4]',           output: '4' },
    // balanced two levels
    { input: '[1,2,3]',                 output: '2' },
    // star (root + 4 children but binary so only 2)
    { input: '[5,1,8]',                 output: '2' },
    // unbalanced left heavy
    { input: '[1,2,3,4,null,null,null,5]', output: '4' },
    // unbalanced right heavy
    { input: '[1,null,2,null,null,null,3]', output: '3' },
    // large depth 5 balanced
    { input: '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]',
      output: '5' },
    // path on left only
    { input: '[1,2,null,3,null,null,null,4,null]', output: '4' },
    // single right chain of 3
    { input: '[1,null,2,null,null,null,3]', output: '3' },
    // all null except root
    { input: '[5]', output: '1' },
    // mixed depths
    { input: '[1,2,3,4,null,null,5]', output: '3' },
    { input: '[1,2,3,null,5]',        output: '3' },
    { input: '[0,2,4,1,null,3,-1,5,1,null,6,null,8]', output: '5' },
    // only right subtree has depth
    { input: '[1,null,2,null,null,null,3,null,null,null,null,null,null,null,4,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,5]', output: '5' },
    // balanced with nulls
    { input: '[3,9,20,null,null,15,7]', output: '3' },
    { input: '[2,null,3,null,null,null,4,null,null,null,null,null,null,null,5]', output: '4' },
    // depth 2 all leaves
    { input: '[10,5,15]',   output: '2' },
    { input: '[10,5,null]', output: '2' },
    { input: '[10,null,15]',output: '2' },
    // negatives
    { input: '[-10,-5,-15]',output: '2' },
    { input: '[-1,-2,-3,-4,-5,-6,-7]', output: '3' },
    // stress depth 5 unbalanced
    { input: '[1,2,3,4,5,null,null,6,7]', output: '4' },
    { input: '[1,2,null,3,null,null,null,4,null,null,null,null,null,null,null,5]', output: '5' },
    { input: '[1,2,3,null,4,5,null,null,null,6]', output: '4' },
    { input: '[5,4,8,11,null,13,4,7,2,null,null,null,1]', output: '4' },
    { input: '[1,2,3,4,5,6,7]', output: '3' },
    { input: '[100,50,200,25,75,150,300]', output: '3' },
  ],

  // -------------------------------------------------------------------------
  // 13. DIAMETER OF BINARY TREE
  // Input:  root (int[] level-order)
  // Output: diameter (int) = longest path between any two nodes
  // -------------------------------------------------------------------------
  'diameter-of-binary-tree': [
    // samples
    { input: '[1,2,3,4,5]',             output: '3' },
    { input: '[1,2]',                   output: '1' },
    { input: '[1]',                     output: '0' },
    // empty
    { input: '[]',                      output: '0' },
    // two-node right
    { input: '[1,null,2]',              output: '1' },
    // three nodes balanced
    { input: '[1,2,3]',                 output: '2' },
    // left skewed (chain)
    { input: '[1,2,null,3,null,null,null,4]', output: '3' },
    // right skewed (chain)
    { input: '[1,null,2,null,null,null,3]',   output: '2' },
    // complete depth 3 → diameter = 4 (leaf to leaf)
    { input: '[1,2,3,4,5,6,7]',         output: '4' },
    // complete depth 4 → 6
    { input: '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]', output: '6' },
    // path through root
    { input: '[1,2,3,4,null,null,5]',   output: '4' },
    // unbalanced
    { input: '[4,2,null,1,3]',          output: '3' },
    // single left chain depth 4
    { input: '[1,2,null,3,null,null,null,4]', output: '3' },
    // all same value
    { input: '[5,5,5,5,5,5,5]',         output: '4' },
    // negatives
    { input: '[-1,-2,-3]',              output: '2' },
    // large
    { input: '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]',
      output: '8' },
    // asymmetric: long left, short right
    { input: '[1,2,3,4,null,null,null,5]', output: '4' },
    // path not through root (subtree)
    { input: '[1,2,null,3,4]',          output: '3' },
    // zigzag
    { input: '[1,2,null,null,3,null,null,null,null,null,null,4]', output: '3' },
    { input: '[3,1,2]',                 output: '2' },
    { input: '[1,2,3,4,5]',             output: '3' },
    // star shape
    { input: '[1,2,3]',                 output: '2' },
    { input: '[1,2,3,4,5]',             output: '3' },
    // depth-5 right chain
    { input: '[1,null,2,null,null,null,3,null,null,null,null,null,null,null,4]', output: '3' },
    // perfect binary tree depth 2
    { input: '[1,2,3]',                 output: '2' },
    // unbalanced heavy left
    { input: '[1,2,3,4,null,null,null,5,null,null,null,null,null,null,null,6]', output: '5' },
    { input: '[1,2,null,3,4,null,null,5]', output: '4' },
    { input: '[5,4,8,11,null,13,4,7,2,null,null,null,1]', output: '6' },
    { input: '[1,2,3,null,null,4,null,null,null,null,null,5]', output: '4' },
    // max via two subtrees
    { input: '[0,1,1,2,2,2,2,3,3,3,3,3,3,3,3]', output: '6' },
    // single path
    { input: '[1,2,null,3,null,null,null,4,null,null,null,null,null,null,null,5]', output: '4'},
    // wide tree
    { input: '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]', output: '6' },
    { input: '[1,2,3]', output: '2' },
    { input: '[1,2,3,4]', output: '3' },
    { input: '[1,2,3,null,4]', output: '3' },
    { input: '[100]', output: '0' },
    { input: '[100,50]', output: '1' },
    { input: '[100,50,200]', output: '2' },
    { input: '[100,50,200,25,75]', output: '4' },
    { input: '[1,2,3,4,5,null,null,6,null,null,null,null,null,null,null,7]', output: '6' },
  ],

  // -------------------------------------------------------------------------
  // 14. BALANCED BINARY TREE
  // A height-balanced tree: every node's subtrees depth differ by ≤ 1
  // Input:  root (int[] level-order)
  // Output: true | false
  // -------------------------------------------------------------------------
  'balanced-binary-tree': [
    // samples
    { input: '[3,9,20,null,null,15,7]', output: 'true'  },
    { input: '[1,2,2,3,3,null,null,4,4]', output: 'false' },
    { input: '[]',                      output: 'true'  },
    // single node
    { input: '[1]',                     output: 'true'  },
    // two nodes
    { input: '[1,2]',                   output: 'true'  },
    { input: '[1,null,2]',              output: 'true'  },
    // perfect balanced
    { input: '[1,2,3]',                 output: 'true'  },
    { input: '[1,2,3,4,5,6,7]',         output: 'true'  },
    // one subtree too deep
    { input: '[1,2,3,4]',               output: 'true'  },
    { input: '[1,2,3,4,null,null,null,5]', output: 'false' },
    // left-skewed 3 levels
    { input: '[1,2,null,3]',            output: 'false' },
    // right-skewed 3 levels
    { input: '[1,null,2,null,null,null,3]', output: 'false' },
    // exactly balanced at every level
    { input: '[1,2,3,4,5,null,null]',   output: 'true'  },
    // deep unbalanced
    { input: '[1,2,null,3,null,null,null,4]', output: 'false' },
    // two children height 2
    { input: '[1,2,2]',                 output: 'true'  },
    // one child, other has 2 levels → unbalanced
    { input: '[1,2,3,4,5]',             output: 'true'  },
    // depth 4 perfect
    { input: '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]', output: 'true' },
    // depth 4 unbalanced
    { input: '[1,2,3,4,5,6,null,8]',    output: 'false' },
    // all same
    { input: '[5,5,5,5,5,5,5]',         output: 'true'  },
    // negatives balanced
    { input: '[-1,-2,-3]',              output: 'true'  },
    // negatives unbalanced
    { input: '[-1,-2,null,-3]',         output: 'false' },
    // various
    { input: '[1,2,2,3,null,null,3,4,null,null,4]',  output: 'false' },
    { input: '[1,2,2,null,3,null,3]',   output: 'false' },
    { input: '[1,2,2,3,3,3,3,4,4,4,4,4,4,null,null,5,5]', output: 'false' },
    // height diff = 1 exactly (ok)
    { input: '[1,2,3,4]',               output: 'true'  },
    { input: '[1,2,3,null,4]',          output: 'true'  },
    // stress balanced
    { input: '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]',
      output: 'true' },
    // stress unbalanced
    { input: '[1,2,3,4,5,6,null,7]',    output: 'false' },
    // zigzag chain = unbalanced
    { input: '[1,2,null,null,3,null,null,null,null,null,null,4]', output: 'false' },
    // root only subtrees balanced
    { input: '[100]',                   output: 'true'  },
    // two-level balanced
    { input: '[5,3,7]',                 output: 'true'  },
    // two-level only left
    { input: '[5,3]',                   output: 'true'  },
    // three-level left deep
    { input: '[5,3,7,1,4]',             output: 'true'  },
    { input: '[1,2,3,4,5,null,6]',      output: 'true'  },
    { input: '[1,2,3,4,5,6,7,8]',       output: 'false' },
    { input: '[1,2,2,3,3,3,3,4,4,4,4,4,4,4,4]', output: 'true' },
    { input: '[1,2,3,null,null,null,4]', output: 'false' },
    { input: '[1,2,null,3,null,null,null,4,null,null,null,null,null,null,null,5]', output: 'false' },
    { input: '[0,1,0,1,0,0,1,1,0,0]', output: 'false' },
  ],

  // -------------------------------------------------------------------------
  // 15. SAME TREE
  // Input:  p (int[] level-order) \n q (int[] level-order)
  // Output: true | false
  // -------------------------------------------------------------------------
  'same-tree': [
    // samples
    { input: '[1,2,3]\n[1,2,3]',     output: 'true'  },
    { input: '[1,2]\n[1,null,2]',    output: 'false' },
    { input: '[1,2,1]\n[1,1,2]',     output: 'false' },
    // empty both
    { input: '[]\n[]',               output: 'true'  },
    // one empty
    { input: '[1]\n[]',              output: 'false' },
    { input: '[]\n[1]',              output: 'false' },
    // single same
    { input: '[1]\n[1]',             output: 'true'  },
    // single different
    { input: '[1]\n[2]',             output: 'false' },
    // two nodes same
    { input: '[1,2]\n[1,2]',         output: 'true'  },
    // two nodes different structure
    { input: '[1,2]\n[1,null,2]',    output: 'false' },
    // two nodes different value
    { input: '[1,2]\n[1,3]',         output: 'false' },
    // larger same
    { input: '[1,2,3,4,5,6,7]\n[1,2,3,4,5,6,7]', output: 'true'  },
    // larger one different value
    { input: '[1,2,3,4,5,6,7]\n[1,2,3,4,5,6,8]', output: 'false' },
    // larger different structure
    { input: '[1,2,3]\n[1,2,3,4]',   output: 'false' },
    // negatives same
    { input: '[-1,-2,-3]\n[-1,-2,-3]', output: 'true'  },
    // negatives different
    { input: '[-1,-2,-3]\n[-1,-2,3]',  output: 'false' },
    // zeros same
    { input: '[0,0,0]\n[0,0,0]',       output: 'true'  },
    // zeros different
    { input: '[0,0,0]\n[0,0,1]',       output: 'false' },
    // left subtree same right different
    { input: '[1,2,3]\n[1,2,4]',       output: 'false' },
    // structure only diff (same values different position)
    { input: '[1,2,3]\n[1,3,2]',       output: 'false' },
    // deeply same
    { input: '[1,2,3,4,5,null,null,6]\n[1,2,3,4,5,null,null,6]', output: 'true' },
    // deeply different at leaf
    { input: '[1,2,3,4,5,null,null,6]\n[1,2,3,4,5,null,null,7]', output: 'false' },
    // null vs value mid-tree
    { input: '[1,2,3,null,5]\n[1,2,3,4,5]', output: 'false' },
    // right heavy same
    { input: '[1,null,2,null,null,null,3]\n[1,null,2,null,null,null,3]', output: 'true' },
    // right heavy different
    { input: '[1,null,2,null,null,null,3]\n[1,null,2]', output: 'false' },
    // all same values
    { input: '[5,5,5,5,5]\n[5,5,5,5,5]', output: 'true'  },
    { input: '[5,5,5,5,5]\n[5,5,5,5,6]', output: 'false' },
    // large trees
    { input: '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]\n[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]',
      output: 'true' },
    { input: '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]\n[1,2,3,4,5,6,7,8,9,10,11,12,13,14,16]',
      output: 'false' },
    // single-path trees
    { input: '[1,2,null,3]\n[1,2,null,3]',     output: 'true'  },
    { input: '[1,2,null,3]\n[1,2,null,4]',     output: 'false' },
    { input: '[1,null,2]\n[1,null,2]',         output: 'true'  },
    { input: '[1,null,2]\n[1,2]',              output: 'false' },
    // root differ
    { input: '[5,2,3]\n[1,2,3]',              output: 'false' },
    // both only root
    { input: '[100]\n[100]',                  output: 'true'  },
    { input: '[100]\n[101]',                  output: 'false' },
    // mirror trees (not same)
    { input: '[1,2,3]\n[1,3,2]',              output: 'false' },
    { input: '[1,2,3,4,5,6,7]\n[1,3,2,7,6,5,4]', output: 'false' },
  ],

  // -------------------------------------------------------------------------
  // 16. SUBTREE OF ANOTHER TREE
  // Input:  root (int[] level-order) \n subRoot (int[] level-order)
  // Output: true | false
  // -------------------------------------------------------------------------
  'subtree-of-another-tree': [
    // samples
    { input: '[3,4,5,1,2]\n[4,1,2]',         output: 'true'  },
    { input: '[3,4,5,1,2,null,null,null,null,0]\n[4,1,2]', output: 'false' },
    { input: '[1,2,3]\n[2]',                 output: 'true'  },
    // identical trees
    { input: '[1,2,3]\n[1,2,3]',             output: 'true'  },
    // sub is single root
    { input: '[1,2,3]\n[1]',                 output: 'true'  },
    // sub not present
    { input: '[1,2,3]\n[4]',                 output: 'false' },
    // empty sub (always true)
    { input: '[1,2,3]\n[]',                  output: 'true'  },
    // main empty, sub not
    { input: '[]\n[1]',                      output: 'false' },
    // both empty
    { input: '[]\n[]',                       output: 'true'  },
    // sub equals root value but different structure
    { input: '[1,2,3]\n[1,2]',               output: 'false' },
    // exact right subtree
    { input: '[1,2,3]\n[3]',                 output: 'true'  },
    // sub rooted at leaf
    { input: '[1,2,3,4,5]\n[4]',             output: 'true'  },
    // sub not a subtree (extra node)
    { input: '[1,2,3,4,5]\n[2,4,5,0]',      output: 'false' },
    // sub is full subtree
    { input: '[1,2,3,4,5,6,7]\n[2,4,5]',    output: 'true'  },
    { input: '[1,2,3,4,5,6,7]\n[3,6,7]',    output: 'true'  },
    { input: '[1,2,3,4,5,6,7]\n[2,4]',      output: 'false' },
    // value match but structure differs
    { input: '[1,1,1]\n[1,1]',               output: 'true'  },
    { input: '[1,1,1,1]\n[1,1]',             output: 'true'  },
    // deep subtree
    { input: '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]\n[4,8,9]', output: 'true' },
    { input: '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]\n[7,14,15]', output: 'true' },
    { input: '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]\n[5,10,11]', output: 'true' },
    // almost subtree (one value off)
    { input: '[3,4,5,1,2]\n[4,1,3]',         output: 'false' },
    // sub larger than main
    { input: '[1,2]\n[1,2,3]',               output: 'false' },
    // null in sub matters
    { input: '[1,2,3]\n[1,null,3]',          output: 'false' },
    // negatives
    { input: '[-1,-2,-3]\n[-2]',             output: 'true'  },
    { input: '[-1,-2,-3]\n[-2,-1]',          output: 'false' },
    // zeros
    { input: '[0,0,0]\n[0,0]',               output: 'true'  },
    // single node sub same
    { input: '[5]\n[5]',                     output: 'true'  },
    // single node sub different
    { input: '[5]\n[4]',                     output: 'false' },
    // one child trees
    { input: '[1,2,null,3]\n[2,null,3]',     output: 'false' },
    { input: '[1,2,null,3]\n[2,3]',          output: 'false' },
    { input: '[1,2,null,3]\n[3]',            output: 'true'  },
    // stress
    { input: '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]\n[6,12,13]', output: 'true'  },
    { input: '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]\n[6,12,14]', output: 'false' },
    // completely different
    { input: '[100,200,300]\n[400]',          output: 'false' },
    { input: '[100,200,300]\n[100]',          output: 'true'  },
    { input: '[100,200,300]\n[200]',          output: 'true'  },
    { input: '[100,200,300]\n[200,100]',      output: 'false' },
  ],

  // -------------------------------------------------------------------------
  // 17. KTH LARGEST ELEMENT IN A STREAM
  // Represented as: init with k and nums, then add vals one by one
  // Judge input: k (int) \n nums (int[]) \n vals (int[])
  // Output: array of results after each add
  // -------------------------------------------------------------------------
  'kth-largest-element-in-a-stream': [
    // samples
    { input: '3\n[4,5,8,2]\n[3,5,10,9,4]',    output: '[4,5,5,8,8]'         },
    { input: '1\n[]\n[1,2,3]',                 output: '[1,2,3]'             },
    { input: '2\n[0]\n[1,2,3,4]',             output: '[0,1,2,3]'           },
    // basic
    { input: '1\n[1]\n[2,3,4,5]',             output: '[2,3,4,5]'           },
    { input: '2\n[1,2]\n[3,4,5]',             output: '[2,3,4]'             },
    { input: '3\n[1,2,3]\n[4,5,6]',           output: '[3,4,5]'             },
    // k=1 always returns max
    { input: '1\n[5,4,3,2,1]\n[6,0,7]',       output: '[6,6,7]'             },
    // small stream growing
    { input: '2\n[2,1]\n[3,5,4]',             output: '[2,3,4]'             },
    // nums empty, build from adds
    { input: '3\n[5,7,2,3,1]\n[4,8,1,6]',     output: '[4,5,7,7]'           },
    // all same values
    { input: '2\n[1,1,1]\n[1,1,1]',           output: '[1,1,1]'             },
    // negatives
    { input: '1\n[-5,-3,-1]\n[-10,0,2]',      output: '[-1,0,2]'            },
    { input: '2\n[-10,-5]\n[-3,0,5]',         output: '[-5,-3,0]'           },
    // k=len(nums)
    { input: '3\n[3,1,2]\n[5,0,4]',           output: '[2,2,3]'             },
    // add smaller than all
    { input: '2\n[10,9,8,7]\n[6,5,4]',        output: '[9,9,9]'             },
    // add larger than all
    { input: '3\n[1,2,3,4,5]\n[6,7,8]',       output: '[4,5,6]'             },
    // k=1 single val stream
    { input: '1\n[1]\n[1]',                   output: '[1]'                 },
    // large k
    { input: '5\n[1,2,3,4,5]\n[6,7,8]',       output: '[2,3,4]'             },
    // adds go down then up
    { input: '2\n[5,3]\n[1,4,6]',             output: '[3,4,5]'             },
    // single add
    { input: '1\n[5]\n[10]',                  output: '[10]'                },
    { input: '1\n[5]\n[3]',                   output: '[5]'                 },
    // k = 1 many adds
    { input: '1\n[1,2,3,4,5,6,7,8,9,10]\n[11,0,15,7]', output: '[11,11,15,15]' },
    // descending add
    { input: '3\n[10,9,8,7,6]\n[5,4,3]',      output: '[8,8,8]'             },
    // ascending add
    { input: '3\n[1,2,3,4,5]\n[6,7,8,9,10]',  output: '[4,5,6,7,8]'         },
    // repeats in nums and add
    { input: '2\n[5,5,5]\n[5,5]',             output: '[5,5]'               },
    { input: '3\n[5,5,5,5]\n[5,5,5]',         output: '[5,5,5]'             },
    // big gaps
    { input: '2\n[100,1]\n[50,200,75]',        output: '[50,100,100]'        },
    { input: '1\n[100,1]\n[50,200,75]',        output: '[100,200,200]'       },
    // single el stream k=1
    { input: '1\n[3]\n[3]',                   output: '[3]'                 },
    { input: '1\n[3]\n[1,2,5]',               output: '[3,3,5]'             },
    // k=1 with negatives
    { input: '1\n[-5,-4,-3,-2,-1]\n[-6,0,1]', output: '[-1,0,1]'            },
    // sorted desc nums
    { input: '3\n[9,8,7,6,5,4,3,2,1]\n[10,0,11]', output: '[7,7,8]'         },
    // large initial heap
    { input: '4\n[10,20,30,40,50,60]\n[35,45,55]', output: '[40,40,50]'      },
    // nums has exactly k elements
    { input: '3\n[3,1,2]\n[0,4,5]',           output: '[1,2,3]'             },
    // add same val multiple times
    { input: '2\n[1,3]\n[2,2,2]',             output: '[2,2,2]'             },
    { input: '3\n[1,2,3]\n[3,3,3]',           output: '[2,3,3]'             },
    { input: '1\n[5,3,7]\n[8,8,8]',           output: '[8,8,8]'             },
    { input: '2\n[1,2,3,4,5]\n[3,3,3]',       output: '[4,4,4]'             },
  ],

  // -------------------------------------------------------------------------
  // 18. LAST STONE WEIGHT
  // Input:  stones (int[])
  // Output: last stone weight or 0
  // -------------------------------------------------------------------------
  'last-stone-weight': [
    // samples
    { input: '[2,7,4,1,8,1]', output: '1' },
    { input: '[1]',            output: '1' },
    { input: '[1,1]',          output: '0' },
    // basic
    { input: '[2,2]',          output: '0' },
    { input: '[3,3]',          output: '0' },
    { input: '[1,3]',          output: '2' },
    { input: '[1,2]',          output: '1' },
    { input: '[1,2,3]',        output: '0' },
    { input: '[3,2,1]',        output: '0' },
    { input: '[2,4,6,8]',      output: '0' },
    // all same → 0 if even count
    { input: '[5,5,5,5]',      output: '0' },
    { input: '[5,5,5]',        output: '5' },
    // all same → left over if odd count
    { input: '[3,3,3]',        output: '3' },
    // large differences
    { input: '[10,1,1,1]',     output: '7' },
    { input: '[10,9]',         output: '1' },
    { input: '[10,1]',         output: '9' },
    // single large
    { input: '[100]',          output: '100' },
    // two same large
    { input: '[100,100]',      output: '0' },
    // descending
    { input: '[10,8,6,4,2]',   output: '0' },
    // ascending
    { input: '[1,2,3,4,5]',    output: '1' },
    // only two
    { input: '[3,5]',          output: '2' },
    { input: '[7,3]',          output: '4' },
    // tricky order
    { input: '[2,7,4,1,8,1]',  output: '1' },
    { input: '[6,6,6,6]',      output: '0' },
    // repeated values
    { input: '[4,4,4,4,4]',    output: '4' },
    { input: '[2,2,2,2,2,2]',  output: '0' },
    // zeros — though constraints say >=1, test defensively
    { input: '[1,1,1]',        output: '1' },
    { input: '[1,1,1,1]',      output: '0' },
    // mixed
    { input: '[3,7,2]',        output: '2' },
    { input: '[5,3,4]',        output: '2' },
    { input: '[8,4,6,2,10]',   output: '0' },
    { input: '[1,3,5,7,9]',    output: '1' },
    { input: '[2,4,6,8,10]',   output: '2' },
    { input: '[9,3,2,10]',     output: '0' },
    // large
    { input: '[100,99,98,97]', output: '0' },
    { input: '[99,100]',       output: '1' },
    { input: '[1,2,3,4,5,6,7,8,9,10]', output: '1' },
    { input: '[10,9,8,7,6,5,4,3,2,1]', output: '1' },
    // all weight 1
    { input: '[1,1,1,1,1,1,1,1,1,1]',  output: '0' },
    { input: '[1,1,1,1,1,1,1,1,1,1,1]',output: '1' },
    // big stone vs many small
    { input: '[20,1,1,1,1,1]',  output: '15' },
    { input: '[100,50,50]',     output: '0'  },
    { input: '[100,50,49]',     output: '1'  },
    { input: '[100,50,51]',     output: '1'  },
    { input: '[5,5,5,5,5]',     output: '5'  },
    { input: '[4,8,6,2,10,4]',  output: '0'  },
    { input: '[7,2,5,3]',       output: '1'  },
    { input: '[3,1,4,1,5,9,2,6]', output: '1' },
    { input: '[6,5,4,3,2,1]',   output: '1'  },
    { input: '[7,7,7]',         output: '7'  },
    { input: '[7,7,7,7]',       output: '0'  },
  ],

  // -------------------------------------------------------------------------
  // 19. CLIMBING STAIRS
  // Input:  n (int)
  // Output: ways (int)
  // f(n) = f(n-1) + f(n-2), f(1)=1, f(2)=2
  // -------------------------------------------------------------------------
  'climbing-stairs': [
    // samples
    { input: '1', output: '1'   },
    { input: '2', output: '2'   },
    { input: '3', output: '3'   },
    // basic
    { input: '4',  output: '5'   },
    { input: '5',  output: '8'   },
    { input: '6',  output: '13'  },
    { input: '7',  output: '21'  },
    { input: '8',  output: '34'  },
    { input: '9',  output: '55'  },
    { input: '10', output: '89'  },
    { input: '11', output: '144' },
    { input: '12', output: '233' },
    { input: '13', output: '377' },
    { input: '14', output: '610' },
    { input: '15', output: '987' },
    { input: '16', output: '1597' },
    { input: '17', output: '2584' },
    { input: '18', output: '4181' },
    { input: '19', output: '6765' },
    { input: '20', output: '10946' },
    { input: '21', output: '17711' },
    { input: '22', output: '28657' },
    { input: '23', output: '46368' },
    { input: '24', output: '75025' },
    { input: '25', output: '121393' },
    { input: '26', output: '196418' },
    { input: '27', output: '317811' },
    { input: '28', output: '514229' },
    { input: '29', output: '832040' },
    { input: '30', output: '1346269' },
    { input: '31', output: '2178309' },
    { input: '32', output: '3524578' },
    { input: '33', output: '5702887' },
    { input: '34', output: '9227465' },
    { input: '35', output: '14930352' },
    { input: '36', output: '24157817' },
    { input: '37', output: '39088169' },
    { input: '38', output: '63245986' },
    { input: '39', output: '102334155' },
    { input: '40', output: '165580141' },
    { input: '41', output: '267914296' },
    { input: '42', output: '433494437' },
    { input: '43', output: '701408733' },
    { input: '44', output: '1134903170' },
    { input: '45', output: '1836311903' },
    // boundary min
    { input: '1', output: '1' },
    // some mid values double-checked
    { input: '10', output: '89' },
    { input: '20', output: '10946' },
    { input: '30', output: '1346269' },
    { input: '45', output: '1836311903' },
    // near-boundary
    { input: '44', output: '1134903170' },
    { input: '43', output: '701408733'  },
    { input: '42', output: '433494437'  },
    { input: '41', output: '267914296'  },
    { input: '40', output: '165580141'  },
    { input: '2', output: '2'   },
    { input: '3', output: '3'   },
    { input: '4', output: '5'   },
    { input: '5', output: '8'   },
    { input: '6', output: '13'  },
    { input: '7', output: '21'  },
    { input: '8', output: '34'  },
    { input: '9', output: '55'  },
  ],

  // -------------------------------------------------------------------------
  // 20. MIN COST CLIMBING STAIRS
  // Input:  cost (int[])
  // Output: minCost (int)
  // dp[i] = cost[i] + min(dp[i-1], dp[i-2]), ans = min(dp[n-1], dp[n-2])
  // -------------------------------------------------------------------------
  'min-cost-climbing-stairs': [
    // samples
    { input: '[10,15,20]',            output: '15' },
    { input: '[1,100,1,1,1,100,1,1,100,1]', output: '6' },
    { input: '[0,0]',                 output: '0'  },
    // basic
    { input: '[0,0,0]',               output: '0'  },
    { input: '[1,1]',                 output: '1'  },
    { input: '[1,2]',                 output: '1'  },
    { input: '[2,1]',                 output: '1'  },
    { input: '[1,1,1]',               output: '1'  },
    { input: '[10,15]',               output: '10' },
    { input: '[15,10]',               output: '10' },
    // all zeros
    { input: '[0,0,0,0,0]',           output: '0'  },
    // all same
    { input: '[5,5,5,5,5]',           output: '10' },
    { input: '[3,3,3,3]',             output: '6'  },
    // ascending
    { input: '[1,2,3,4,5]',           output: '6'  },
    // descending
    { input: '[5,4,3,2,1]',           output: '4'  },
    // alternating
    { input: '[1,100,1,100,1]',        output: '3'  },
    { input: '[100,1,100,1,100]',      output: '2'  },
    // two elements
    { input: '[2,3]',                 output: '2'  },
    { input: '[3,2]',                 output: '2'  },
    // three elements various
    { input: '[0,1,2]',               output: '1'  },
    { input: '[2,1,0]',               output: '1'  },
    { input: '[1,0,2]',               output: '1'  },
    // large values
    { input: '[100,100,100,100,100]',  output: '200' },
    { input: '[999,1,999,1,999]',      output: '2'   },
    // one step optimal
    { input: '[0,10,10,10,0]',         output: '0'   },
    { input: '[10,0,10,0,10]',         output: '10'  },
    // boundary values
    { input: '[0,1]',                  output: '0'   },
    { input: '[1,0]',                  output: '0'   },
    // long flat
    { input: '[1,1,1,1,1,1,1,1,1,1]', output: '5'   },
    // last two
    { input: '[5,1,1,1,5]',            output: '3'   },
    { input: '[5,1,1,1,1,5]',          output: '4'   },
    // mixed
    { input: '[1,2,1,2,1,2,1,2]',      output: '4'   },
    { input: '[2,1,2,1,2,1,2,1]',      output: '4'   },
    { input: '[3,2,1]',                output: '2'   },
    { input: '[1,2,3]',                output: '2'   },
    { input: '[10,100,10,100,10]',      output: '20'  },
    // stress
    { input: '[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]', output: '10' },
    { input: '[2,2,2,2,2,2,2,2,2,2]',                      output: '10' },
    { input: '[0,100,0,100,0,100,0,100,0,100]',             output: '0'  },
    { input: '[100,0,100,0,100,0,100,0,100,0]',             output: '0'  },
    { input: '[5,10,5,10,5,10,5,10]',                       output: '20' },
    { input: '[1,2,3,4,5,6,7,8,9,10]',                      output: '25' },
    { input: '[10,9,8,7,6,5,4,3,2,1]',                      output: '15' },
    { input: '[0,0,0,0,0,0,0,0,0,0]',                       output: '0'  },
    { input: '[1,0,1,0,1,0,1,0,1,0]',                       output: '0'  },
    { input: '[0,1,0,1,0,1,0,1,0,1]',                       output: '0'  },
  ],

  // =========================================================================
  // BATCH 2 — 20 Medium Problems
  // =========================================================================

  // -------------------------------------------------------------------------
  // 21. GROUP ANAGRAMS
  // Input:  strs (string[])
  // Output: string[][] (each group sorted internally, groups sorted lexicographically)
  // -------------------------------------------------------------------------
  'group-anagrams': [
    // samples
    { input: '["eat","tea","tan","ate","nat","bat"]', output: '[["ate","eat","tea"],["bat"],["nat","tan"]]' },
    { input: '[""]',                                  output: '[[""]]' },
    { input: '["a"]',                                 output: '[["a"]]' },
    // two groups
    { input: '["ab","ba","cd"]',    output: '[["ab","ba"],["cd"]]' },
    { input: '["abc","cba","bca","xyz","zyx"]', output: '[["abc","bca","cba"],["xyz","zyx"]]' },
    // single group all anagrams
    { input: '["abc","bca","cab","acb","bac","cba"]', output: '[["abc","acb","bac","bca","cab","cba"]]' },
    // all unique
    { input: '["abc","def","ghi"]', output: '[["abc"],["def"],["ghi"]]' },
    // repeated word
    { input: '["aa","aa"]',         output: '[["aa","aa"]]' },
    // empty strings mixed
    { input: '["",""]',             output: '[[""," "]]' },
    // single chars
    { input: '["a","b","c","a"]',   output: '[["a","a"],["b"],["c"]]' },
    // classic anagram pairs
    { input: '["listen","silent","enlist","dog","god","tac","cat","act"]',
      output: '[["act","cat","tac"],["dog","god"],["enlist","listen","silent"]]' },
    // numbers as strings
    { input: '["123","321","231","456"]', output: '[["123","231","321"],["456"]]' },
    // all same letter
    { input: '["aaa","aaa","aaa"]',      output: '[["aaa","aaa","aaa"]]' },
    // mixed lengths → no anagram possible
    { input: '["ab","abc","abcd"]',      output: '[["ab"],["abc"],["abcd"]]' },
    // one long anagram group
    { input: '["rate","tear","rare","arte","aret"]', output: '[["arte","aret","rate","tear"],["rare"]]' },
    // more groups
    { input: '["ab","ba","ac","ca","bc","cb"]', output: '[["ab","ba"],["ac","ca"],["bc","cb"]]' },
    // longer words
    { input: '["cinema","iceman","anemic","abcdef","fedcba"]',
      output: '[["abcdef","fedcba"],["anemic","cinema","iceman"]]' },
    // single element groups
    { input: '["hello","world","dlrow","olleh"]',
      output: '[["hello","olleh"],["dlrow","world"]]' },
    // variety of sizes
    { input: '["a","aa","aaa","b","bb","bbb"]',
      output: '[["a"],["aa"],["aaa"],["b"],["bb"],["bbb"]]' },
    // large input 10 strings
    { input: '["tan","nat","bat","tab","eat","tea","ate","abc","cab","bca"]',
      output: '[["abc","bca","cab"],["ate","eat","tea"],["bat","tab"],["nat","tan"]]' },
    // all anagrams of "abc"
    { input: '["abc","acb","bac","bca","cab","cba","xyz"]',
      output: '[["abc","acb","bac","bca","cab","cba"],["xyz"]]' },
    // repeated pairs
    { input: '["ab","ba","ab","ba"]', output: '[["ab","ab","ba","ba"]]' },
    // no anagram groups
    { input: '["abc","def","ghi","jkl"]', output: '[["abc"],["def"],["ghi"],["jkl"]]' },
    // two-char all unique
    { input: '["ab","ac","ad","bc","bd","cd"]',
      output: '[["ab"],["ac"],["ad"],["bc"],["bd"],["cd"]]' },
    // long word anagrams
    { input: '["dormitory","dirtyroom","astronomer","moonraker"]',
      output: '[["astronomer"],["dirtyroom","dormitory"],["moonraker"]]' },
    // stress
    { input: '["aab","aba","baa","bba","bab","abb"]',
      output: '[["aab","aba","baa"],["abb","bab","bba"]]' },
    // empty + non-empty
    { input: '["","a",""]', output: '[["",""],["a"]]' },
    // words that look alike
    { input: '["race","care","acre","acer","core"]',
      output: '[["acer","acre","care","race"],["core"]]' },
    // single word
    { input: '["word"]', output: '[["word"]]' },
    // two distinct
    { input: '["ab","cd"]', output: '[["ab"],["cd"]]' },
    { input: '["ab","ba"]', output: '[["ab","ba"]]' },
    // digits
    { input: '["12","21","13"]', output: '[["12","21"],["13"]]' },
    { input: '["az","za","zz"]', output: '[["az","za"],["zz"]]' },
    { input: '["eat","tea","ate","tan","nat","bat","tab"]',
      output: '[["ate","eat","tea"],["bat","tab"],["nat","tan"]]' },
    { input: '["pots","stop","tops","opts","post"]',
      output: '[["opts","post","pots","stop","tops"]]' },
    { input: '["god","dog","abc"]', output: '[["abc"],["dog","god"]]' },
    { input: '["a","b","a","b"]', output: '[["a","a"],["b","b"]]' },
    { input: '["x"]', output: '[["x"]]' },
    { input: '["xy","yx","xz","zx","yz","zy"]',
      output: '[["xy","yx"],["xz","zx"],["yz","zy"]]' },
    { input: '["cat","tac","act","dog","god","odg"]',
      output: '[["act","cat","tac"],["dog","god","odg"]]' },
    { input: '["hello","ohell","llohe"]',
      output: '[["hello","llohe","ohell"]]' },
    { input: '["noon","nono","onon","oonn"]',
      output: '[["noon","nono","onon","oonn"]]' },
    { input: '["ab","ba","c","d","dc","cd"]',
      output: '[["ab","ba"],["c"],["cd","d","dc"]]' },
  ],

  // -------------------------------------------------------------------------
  // 22. TOP K FREQUENT ELEMENTS
  // Input:  nums (int[]) \n k (int)
  // Output: int[] (sorted ascending for determinism)
  // -------------------------------------------------------------------------
  'top-k-frequent-elements': [
    // samples
    { input: '[1,1,1,2,2,3]\n2',  output: '[1,2]' },
    { input: '[1]\n1',            output: '[1]'   },
    { input: '[1,2]\n2',          output: '[1,2]' },
    // basic
    { input: '[1,1,2,2,3]\n1',    output: '[1]'   },
    { input: '[1,1,2,2,3]\n2',    output: '[1,2]' },
    { input: '[4,1,2,2,3,3,3]\n2',output: '[2,3]' },
    { input: '[1,2,3,4,4,4]\n1',  output: '[4]'   },
    { input: '[1,2,3,4,4,4]\n2',  output: '[3,4]' },
    { input: '[1,2,3,4,4,4]\n3',  output: '[2,3,4]' },
    // all same
    { input: '[5,5,5,5,5]\n1',    output: '[5]'   },
    // k = array length (all unique)
    { input: '[1,2,3]\n3',        output: '[1,2,3]' },
    // negatives
    { input: '[-1,-1,-2,-2,-3]\n2', output: '[-2,-1]' },
    { input: '[-1,-2,-3,-3]\n1',    output: '[-3]'    },
    // mixed negative/positive
    { input: '[-1,1,-1,1,2]\n2',    output: '[-1,1]'  },
    { input: '[0,0,1,1,2]\n2',      output: '[0,1]'   },
    { input: '[0,1,2,0,1]\n1',      output: '[0]'     },
    // large freq
    { input: '[1,1,1,1,1,2,2,2,3]\n2', output: '[1,2]' },
    // k=1 tie → lowest (deterministic by value sort)
    { input: '[3,3,2,2]\n1',          output: '[2]'   },
    // k=1 clear winner
    { input: '[7,7,7,8,8,9]\n1',       output: '[7]'   },
    // all freq 1
    { input: '[5,4,3,2,1]\n3',         output: '[1,2,3]' },
    { input: '[5,4,3,2,1]\n5',         output: '[1,2,3,4,5]' },
    // increasing freq
    { input: '[1,2,2,3,3,3,4,4,4,4]\n2',  output: '[3,4]' },
    { input: '[1,2,2,3,3,3,4,4,4,4]\n3',  output: '[2,3,4]' },
    { input: '[1,2,2,3,3,3,4,4,4,4]\n4',  output: '[1,2,3,4]' },
    // large values
    { input: '[1000,1000,999,999,998]\n2', output: '[999,1000]' },
    // zeros dominant
    { input: '[0,0,0,1,2]\n1',            output: '[0]' },
    // negative dominant
    { input: '[-5,-5,-5,-3,-3]\n1',        output: '[-5]' },
    // k = len
    { input: '[1,2,3,4,5]\n5', output: '[1,2,3,4,5]' },
    // sorted already desc freq
    { input: '[4,4,4,3,3,2,1]\n1', output: '[4]' },
    { input: '[4,4,4,3,3,2,1]\n2', output: '[3,4]' },
    { input: '[4,4,4,3,3,2,1]\n3', output: '[2,3,4]' },
    // stress
    { input: '[1,1,1,1,2,2,2,3,3,4]\n3', output: '[1,2,3]' },
    { input: '[10,20,10,20,30,10]\n1',    output: '[10]'    },
    { input: '[10,20,10,20,30,10]\n2',    output: '[10,20]' },
    { input: '[10,20,10,20,30,10]\n3',    output: '[10,20,30]' },
    // long unique
    { input: '[1,2,3,4,5,6,7,8,9,10]\n5', output: '[1,2,3,4,5]' },
    // duplicate heavy
    { input: '[1,1,1,1,1,1,1,2]\n1',      output: '[1]' },
    { input: '[1,2,2,2,3,3,4]\n2',         output: '[2,3]' },
    { input: '[5,5,4,4,3,2,1]\n2',         output: '[4,5]' },
    { input: '[100,100,100,200,200,300]\n2',output: '[100,200]' },
    { input: '[-1,-2,-3,-1,-2,-1]\n2',     output: '[-2,-1]' },
    { input: '[0]\n1',                     output: '[0]' },
    { input: '[0,0]\n1',                   output: '[0]' },
    { input: '[2,3,4,2,3,2]\n2',           output: '[2,3]' },
    { input: '[9,8,7,6,5,4,3,2,1,9,9]\n1', output: '[9]' },
    { input: '[1,1,2,3,3,3,4,4,4,4]\n1',   output: '[4]' },
  ],

  // -------------------------------------------------------------------------
  // 23. PRODUCT OF ARRAY EXCEPT SELF
  // Input:  nums (int[])
  // Output: int[]  answer[i] = product of all nums except nums[i]
  // -------------------------------------------------------------------------
  'product-of-array-except-self': [
    // samples
    { input: '[1,2,3,4]',         output: '[24,12,8,6]'   },
    { input: '[-1,1,0,-3,3]',     output: '[0,-3,9,0,0]'  },
    { input: '[1,1]',             output: '[1,1]'          },
    // basic
    { input: '[2,3]',             output: '[3,2]'          },
    { input: '[1,2]',             output: '[2,1]'          },
    { input: '[2,2,2]',           output: '[4,4,4]'        },
    { input: '[1,2,3]',           output: '[6,3,2]'        },
    { input: '[3,2,1]',           output: '[2,3,6]'        },
    // zeros
    { input: '[0,1,2,3]',         output: '[6,0,0,0]'      },
    { input: '[1,0,2,3]',         output: '[0,6,0,0]'      },
    { input: '[1,2,3,0]',         output: '[0,0,0,6]'      },
    { input: '[0,0,2,3]',         output: '[0,0,0,0]'      },
    { input: '[0,0,0]',           output: '[0,0,0]'        },
    // ones
    { input: '[1,1,1,1]',         output: '[1,1,1,1]'      },
    { input: '[1,1,1]',           output: '[1,1,1]'        },
    // negatives
    { input: '[-1,-2,-3,-4]',     output: '[-24,12,-8,6]'  },
    { input: '[-1,1]',            output: '[1,-1]'         },
    { input: '[-2,-3]',           output: '[-3,-2]'        },
    // mixed
    { input: '[-1,1,-1,1]',       output: '[1,-1,1,-1]'    },
    { input: '[2,-1,3,-2]',       output: '[6,-12,4,-6]'   },
    // large values
    { input: '[1,2,3,4,5]',       output: '[120,60,40,30,24]' },
    { input: '[2,2,2,2,2]',       output: '[16,16,16,16,16]'  },
    { input: '[10,10,10]',        output: '[100,100,100]'   },
    // single zero
    { input: '[5,0,3]',           output: '[0,15,0]'        },
    // prefix/suffix
    { input: '[1,2,3,4,5,6]',     output: '[720,360,240,180,144,120]' },
    { input: '[2,3,4,5]',         output: '[60,40,30,24]'   },
    // two elements with zero
    { input: '[0,5]',             output: '[5,0]'           },
    { input: '[5,0]',             output: '[0,5]'           },
    { input: '[0,0]',             output: '[0,0]'           },
    // boundary
    { input: '[1,-1]',            output: '[-1,1]'          },
    { input: '[-1,-1]',           output: '[-1,-1]'         },
    // stress
    { input: '[1,2,3,4,5,6,7,8]', output: '[40320,20160,13440,10080,8064,6720,5760,5040]' },
    { input: '[2,2,2,2]',         output: '[8,8,8,8]'       },
    { input: '[3,3,3]',           output: '[9,9,9]'         },
    { input: '[1,2,4,8]',         output: '[64,32,16,8]'    },
    { input: '[8,4,2,1]',         output: '[8,16,32,64]'    },
    { input: '[1,0,0,1]',         output: '[0,0,0,0]'       },
    { input: '[2,0,4]',           output: '[0,8,0]'         },
    { input: '[3,0,0]',           output: '[0,0,0]'         },
    { input: '[-1,-2]',           output: '[-2,-1]'         },
    { input: '[-3,-2,-1]',        output: '[2,-3,6]'        },
    { input: '[1,2,0,4]',         output: '[0,0,8,0]'       },
    { input: '[5,1,4,2]',         output: '[8,40,10,20]'    },
    { input: '[6,2,3]',           output: '[6,18,12]'       },
    { input: '[1,1,1,1,1]',       output: '[1,1,1,1,1]'     },
    { input: '[2,1,2,1]',         output: '[2,4,2,4]'       },
    { input: '[4,0,0,4]',         output: '[0,0,0,0]'       },
    { input: '[1,3,5,7]',         output: '[105,35,21,15]'  },
    { input: '[7,5,3,1]',         output: '[15,21,35,105]'  },
    { input: '[2,3,0,4]',         output: '[0,0,24,0]'      },
    { input: '[-1,0,1]',          output: '[0,-1,0]'        },
    { input: '[10,3,5,6,2]',      output: '[180,600,360,300,900]' },
  ],

  // -------------------------------------------------------------------------
  // 24. VALID SUDOKU
  // Input:  board (string[][] 9×9, '1'-'9' or '.')
  // Output: true | false
  // -------------------------------------------------------------------------
  'valid-sudoku': [
    // sample valid
    { input: '[["5","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]]',
      output: 'true' },
    // sample invalid
    { input: '[["8","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]]',
      output: 'false' },
    // all dots valid
    { input: '[[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."] ]',
      output: 'true' },
    // row duplicate
    { input: '[["1","1",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."]]',
      output: 'false' },
    // col duplicate
    { input: '[["1",".",".",".",".",".",".",".","."],["1",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."]]',
      output: 'false' },
    // box duplicate
    { input: '[["1",".",".",".",".",".",".",".","."],[".",".","1",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."]]',
      output: 'false' },
    // valid with sparse digits
    { input: '[["5",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."] ]',
      output: 'true' },
    // row 9 all 1-9 valid
    { input: '[[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],["1","2","3","4","5","6","7","8","9"]]',
      output: 'true' },
    // col 0 all 1-9 valid
    { input: '[["1",".",".",".",".",".",".",".","."],["2",".",".",".",".",".",".",".","."],["3",".",".",".",".",".",".",".","."],["4",".",".",".",".",".",".",".","."],["5",".",".",".",".",".",".",".","."],["6",".",".",".",".",".",".",".","."],["7",".",".",".",".",".",".",".","."],["8",".",".",".",".",".",".",".","."],["9",".",".",".",".",".",".",".","."] ]',
      output: 'true' },
    // valid fully solved grid
    { input: '[["1","2","3","4","5","6","7","8","9"],["4","5","6","7","8","9","1","2","3"],["7","8","9","1","2","3","4","5","6"],["2","3","4","5","6","7","8","9","1"],["5","6","7","8","9","1","2","3","4"],["8","9","1","2","3","4","5","6","7"],["3","4","5","6","7","8","9","1","2"],["6","7","8","9","1","2","3","4","5"],["9","1","2","3","4","5","6","7","8"]]',
      output: 'true' },
    // last row dup
    { input: '[["1","2","3","4","5","6","7","8","9"],["4","5","6","7","8","9","1","2","3"],["7","8","9","1","2","3","4","5","6"],["2","3","4","5","6","7","8","9","1"],["5","6","7","8","9","1","2","3","4"],["8","9","1","2","3","4","5","6","7"],["3","4","5","6","7","8","9","1","2"],["6","7","8","9","1","2","3","4","5"],["9","1","2","3","4","5","6","8","8"]]',
      output: 'false' },
    // two 5s in same box invalid
    { input: '[["5","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","5"]]',
      output: 'false' },
    // valid sparse
    { input: '[[".",".","4",".",".",".","6","3","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".","1",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".","8",".",".",".",".",".",".","."],[".","1",".",".",".",".",".",".","."]]',
      output: 'false' },
    // single digit each row valid
    { input: '[["1",".",".",".",".",".",".",".","."],[".",".",".",".","2",".",".",".","."],[".",".",".",".",".",".",".","3","."],[".",".",".",".",".",".",".",".","4"],[".","5",".",".",".",".",".",".","."],[".",".",".","6",".",".",".",".","."],[".",".",".",".",".","7",".",".","."],[".",".","8",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","9"]]',
      output: 'true' },
    // same digit in all rows col0 → col dup
    { input: '[["9",".",".",".",".",".",".",".","."],["9",".",".",".",".",".",".",".","."],["9",".",".",".",".",".",".",".","."],["9",".",".",".",".",".",".",".","."],["9",".",".",".",".",".",".",".","."],["9",".",".",".",".",".",".",".","."],["9",".",".",".",".",".",".",".","."],["9",".",".",".",".",".",".",".","."],["9",".",".",".",".",".",".",".","."] ]',
      output: 'false' },
    // same digit spread out validly
    { input: '[["9",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","9"],[".",".",".",".",".",".",".",".","."],[".","9",".",".",".",".",".",".","."],[".",".",".",".","9",".",".",".","."],[".",".",".",".",".",".","9",".","."],[".",".","9",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".","9",".",".",".",".","."]]',
      output: 'true' },
    // all 9s in first row → valid (unique in row)
    { input: '[["1","2","3","4","5","6","7","8","9"],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."] ]',
      output: 'true' },
    // box top-left 1-9 valid
    { input: '[["1","2","3",".",".",".",".",".","."],["4","5","6",".",".",".",".",".","."],["7","8","9",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."] ]',
      output: 'true' },
    // box top-left duplicate 1
    { input: '[["1","2","3",".",".",".",".",".","."],["1","5","6",".",".",".",".",".","."],["7","8","9",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."] ]',
      output: 'false' },
    // two 2s in col 4
    { input: '[[".",".",".",".","2",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".","2",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."]]',
      output: 'false' },
  ],

  // -------------------------------------------------------------------------
  // 25. ENCODE AND DECODE STRINGS
  // Input:  strs (string[]) — encode then decode, output must match input
  // Output: string[] same as input
  // (Judge: encode(strs) → decode(encoded) === strs)
  // We store the original array as both input and expected output.
  // -------------------------------------------------------------------------
  'encode-and-decode-strings': [
    // samples
    { input: '["lint","code","love","you"]',  output: '["lint","code","love","you"]'  },
    { input: '["we","say",":","yes"]',        output: '["we","say",":","yes"]'        },
    { input: '[""]',                          output: '[""]'                          },
    // basic
    { input: '["a"]',                         output: '["a"]'                         },
    { input: '["ab","cd"]',                   output: '["ab","cd"]'                   },
    { input: '["hello","world"]',             output: '["hello","world"]'             },
    // empty array
    { input: '[]',                            output: '[]'                            },
    // strings with special chars
    { input: '["a/b","c/d"]',                 output: '["a/b","c/d"]'                 },
    { input: '["a#b","c#d"]',                 output: '["a#b","c#d"]'                 },
    { input: '["a:b","c:d"]',                 output: '["a:b","c:d"]'                 },
    { input: '["hello world","foo bar"]',     output: '["hello world","foo bar"]'     },
    // multiple empties
    { input: '["","",""]',                    output: '["","",""]'                    },
    { input: '["","a",""]',                   output: '["","a",""]'                   },
    // numbers
    { input: '["123","456","789"]',           output: '["123","456","789"]'           },
    // mixed
    { input: '["abc","","xyz"]',              output: '["abc","","xyz"]'              },
    // delimiter-like strings
    { input: '["4#ab","2#cd"]',               output: '["4#ab","2#cd"]'               },
    { input: '["10#helloworld","5#hello"]',   output: '["10#helloworld","5#hello"]'   },
    // single long word
    { input: '["abcdefghijklmnopqrstuvwxyz"]',output: '["abcdefghijklmnopqrstuvwxyz"]'},
    // many strings
    { input: '["a","b","c","d","e","f","g","h","i","j"]',
      output: '["a","b","c","d","e","f","g","h","i","j"]' },
    // spaces
    { input: '[" "," "," "]',                 output: '[" "," "," "]'                 },
    { input: '["  ","   "]',                  output: '["  ","   "]'                  },
    // newline-like (escaped)
    { input: '["a\\nb","c"]',                 output: '["a\\nb","c"]'                 },
    // repeated
    { input: '["abc","abc","abc"]',           output: '["abc","abc","abc"]'           },
    // single char repeated
    { input: '["a","a","a","a","a"]',         output: '["a","a","a","a","a"]'         },
    // unicode-free mixed
    { input: '["foo","bar","baz"]',           output: '["foo","bar","baz"]'           },
    // path-like
    { input: '["/usr/bin","/home/user"]',     output: '["/usr/bin","/home/user"]'     },
    // empty + long
    { input: '["","abcdefghij"]',             output: '["","abcdefghij"]'             },
    // symbols
    { input: '["!@#$","%^&*"]',               output: '["!@#$","%^&*"]'               },
    // tabs
    { input: '["a\\tb","c"]',                 output: '["a\\tb","c"]'                 },
    // pairs
    { input: '["good","morning"]',            output: '["good","morning"]'            },
    { input: '["night","day"]',               output: '["night","day"]'               },
    // long strings
    { input: '["aaaaaaaaaa","bbbbbbbbbb","cccccccccc"]',
      output: '["aaaaaaaaaa","bbbbbbbbbb","cccccccccc"]' },
    // single element with delimiter char
    { input: '["#"]',                         output: '["#"]'                         },
    { input: '["##"]',                        output: '["##"]'                        },
    { input: '["1#2","3#4"]',                 output: '["1#2","3#4"]'                 },
    // very long single
    { input: '["abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz"]',
      output: '["abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz"]' },
    // mixed lengths
    { input: '["a","bb","ccc","dddd","eeeee"]',
      output: '["a","bb","ccc","dddd","eeeee"]' },
    // contains numbers as strings
    { input: '["1","22","333","4444"]',        output: '["1","22","333","4444"]'       },
    // question marks
    { input: '["?","??","???"]',               output: '["?","??","???"]'              },
    // backslashes
    { input: '["a\\\\b","c\\\\d"]',            output: '["a\\\\b","c\\\\d"]'           },
    // single space
    { input: '[" "]',                          output: '[" "]'                          },
    // various delimiters inside
    { input: '["a|b","c|d","e|f"]',            output: '["a|b","c|d","e|f"]'           },
    { input: '["a,b","c,d"]',                  output: '["a,b","c,d"]'                  },
    { input: '["a;b","c;d"]',                  output: '["a;b","c;d"]'                  },
  ],

  // -------------------------------------------------------------------------
  // 26. LONGEST CONSECUTIVE SEQUENCE
  // Input:  nums (int[])
  // Output: length of longest consecutive sequence (int)
  // -------------------------------------------------------------------------
  'longest-consecutive-sequence': [
    // samples
    { input: '[100,4,200,1,3,2]',     output: '4'  },
    { input: '[0,3,7,2,5,8,4,6,0,1]',output: '9'  },
    { input: '[]',                    output: '0'  },
    // basic
    { input: '[1,2,3,4,5]',           output: '5'  },
    { input: '[5,4,3,2,1]',           output: '5'  },
    { input: '[1]',                   output: '1'  },
    { input: '[1,3]',                 output: '1'  },
    { input: '[1,2]',                 output: '2'  },
    // single streak
    { input: '[10,11,12,13,14,15]',   output: '6'  },
    // two streaks
    { input: '[1,2,3,10,11,12,13]',   output: '4'  },
    // duplicates
    { input: '[1,2,2,3]',             output: '3'  },
    { input: '[1,1,1,1]',             output: '1'  },
    // negative
    { input: '[-1,0,1,2,3]',          output: '5'  },
    { input: '[-5,-4,-3,-2,-1,0]',    output: '6'  },
    { input: '[-3,-2,-1]',            output: '3'  },
    // all same
    { input: '[5,5,5,5]',             output: '1'  },
    // gap of 1
    { input: '[1,3,5,7]',             output: '1'  },
    // zero  
    { input: '[0]',                   output: '1'  },
    { input: '[0,1]',                 output: '2'  },
    // large gap then streak
    { input: '[1,2,3,100,101,102,103,104]', output: '5' },
    // two equal-length streaks
    { input: '[1,2,3,10,11,12]',      output: '3'  },
    // one very long
    { input: '[9,-1,-3,-2,4,3,-7,6,5,8,7,2,1,0,-4,-5,-6]', output: '17' },
    // negative range
    { input: '[-10,-9,-8,-7,-6,-5,-4,-3,-2,-1]', output: '10' },
    // mixed positive
    { input: '[50,1,2,3,4,5,6,7,8,9,10]',        output: '10' },
    // start at 0
    { input: '[0,1,2,3,4,5,6,7,8,9]',            output: '10' },
    // sparse
    { input: '[100,200,300,400]',                 output: '1'  },
    // near boundaries
    { input: '[-1,0,1]',           output: '3'  },
    { input: '[-2,-1,0,1,2]',      output: '5'  },
    // stress length 1
    { input: '[42]',               output: '1'  },
    // stress all consecutive
    { input: '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]', output: '20' },
    // duplicates with streak
    { input: '[1,2,2,3,3,4,5]',    output: '5'  },
    // just two consecutive
    { input: '[5,6]',              output: '2'  },
    // alternating
    { input: '[1,3,5,7,9,2,4,6,8,10]', output: '10' },
    // many small sequences
    { input: '[1,2,10,11,20,21,30,31]', output: '2' },
    // three sequences pick longest
    { input: '[7,8,9,1,2,3,4,5,11,12]', output: '5' },
    // boundary
    { input: '[-1000000000,-999999999]', output: '2' },
    { input: '[1000000000,999999999]',   output: '2' },
    { input: '[0,0,0,0,0]',             output: '1' },
    { input: '[-1,1,-2,2,-3,3]',        output: '3' },
    { input: '[3,2,1,0,-1,-2]',         output: '6' },
    { input: '[5,4,3,2,1,0,-1,-2,-3,-4,-5]', output: '11' },
    { input: '[1,2,3,4,5,100,101,102,103,104,105]', output: '6' },
    { input: '[4,0,-4,-2,2,5,2,0,-8,-8,-8,-8,-1,7,4,5,5,-4,6,6,-3]', output: '5' },
    { input: '[0,0]', output: '1' },
    { input: '[1,0,-1]', output: '3' },
  ],

  // -------------------------------------------------------------------------
  // 27. 3SUM
  // Input:  nums (int[])
  // Output: int[][] sorted triplets (each triplet sorted, triplets sorted lex)
  // -------------------------------------------------------------------------
  '3sum': [
    // samples
    { input: '[-1,0,1,2,-1,-4]',  output: '[[-1,-1,2],[-1,0,1]]' },
    { input: '[0,1,1]',           output: '[]'                    },
    { input: '[0,0,0]',           output: '[[0,0,0]]'             },
    // basic
    { input: '[-2,0,1,1,2]',      output: '[[-2,0,2],[-2,1,1]]'  },
    { input: '[-4,-1,-1,0,1,2]',  output: '[[-4,-1,-1,-4,1,2],[-1,-1,2],[-1,0,1]]' },
    { input: '[1,2,-2,-1]',       output: '[[-2,-1,1],[-2,0,2]]' },
    // no result
    { input: '[1,2,3]',           output: '[]'  },
    { input: '[-1,-2,-3]',        output: '[]'  },
    { input: '[1,1,1]',           output: '[]'  },
    // all zeros
    { input: '[0,0,0,0]',         output: '[[0,0,0]]' },
    { input: '[0,0,0,0,0]',       output: '[[0,0,0]]' },
    // two elements
    { input: '[0,0]',             output: '[]'  },
    // three elements that sum
    { input: '[-1,0,1]',          output: '[[-1,0,1]]' },
    { input: '[1,-2,1]',          output: '[]'         },
    // duplicates
    { input: '[-2,0,0,2,2]',      output: '[[-2,0,2]]' },
    { input: '[-1,-1,0,0,1,1]',   output: '[[-1,-1,2],[-1,0,1]]' },
    // all same negatives
    { input: '[-3,-3,-3,3,3,3]',  output: '[[-3,0,3]]' },
    // large range
    { input: '[-100,0,100]',       output: '[[-100,0,100]]' },
    { input: '[-100,-50,150]',     output: '[[-100,-50,150]]' },
    { input: '[-100,50,50]',       output: '[[-100,50,50]]'   },
    // no triplets possible with only pos
    { input: '[1,2,3,4,5]',        output: '[]'  },
    // no triplets possible with only neg
    { input: '[-5,-4,-3,-2,-1]',   output: '[]'  },
    // multiple triplets
    { input: '[-4,-2,-2,-1,0,1,2,2,4]',
      output: '[[-4,-2,2],[-4,0,4],[-2,-2,4],[-2,0,2],[-1,-1,2],[-1,0,1]]' },
    // stress
    { input: '[-1,0,1,2,-1,-4,-2,-3,3,0,4]',
      output: '[[-4,0,4],[-4,1,3],[-3,-1,4],[-3,0,3],[-3,1,2],[-2,-1,3],[-2,0,2],[-1,-1,2],[-1,0,1]]' },
    { input: '[-2,-1,0,1,2]',      output: '[[-2,0,2],[-1,0,1]]' },
    { input: '[-3,0,1,2,-1,-2,2]', output: '[[-3,1,2],[-2,0,2],[-1,-1,2],[-1,0,1]]' },
    // unique triplets with repeats
    { input: '[-1,-1,0,0,1,1,2,2]',
      output: '[[-1,-1,2],[-1,0,1],[-1,1,0],[0,0,0]]' },
    // single zero possible
    { input: '[-1,0,0,1]',         output: '[[-1,0,1],[0,0,0]]' },
    // empty
    { input: '[]',                 output: '[]'  },
    // length < 3
    { input: '[1]',                output: '[]'  },
    { input: '[1,2]',              output: '[]'  },
    // all same
    { input: '[1,1,1,1]',          output: '[]'  },
    { input: '[-1,-1,-1,-1]',      output: '[]'  },
    // boundary
    { input: '[0,0,0,0,0,0]',      output: '[[0,0,0]]' },
    { input: '[-2,1,1]',           output: '[[-2,1,1]]' },
    { input: '[-3,1,2]',           output: '[[-3,1,2]]' },
    // stress 2
    { input: '[-4,-2,1,2,3,-3,0]',
      output: '[[-4,1,3],[-3,0,3],[-3,1,2],[-2,-1,3],[-2,0,2],[-1,0,1]]' },
    { input: '[3,-2,1,0]',         output: '[[-2,-1,3]]' },
    { input: '[-1,2,-1,0,1]',      output: '[[-1,-1,2],[-1,0,1]]' },
    { input: '[0,0,1,-1,2,-2]',    output: '[[-2,0,2],[-1,0,1],[-1,-1,2]]' },
    { input: '[-5,2,3]',           output: '[[-5,2,3]]' },
    { input: '[-2,2,0,-2,2]',      output: '[[-2,0,2]]' },
  ],

  // -------------------------------------------------------------------------
  // 28. CONTAINER WITH MOST WATER
  // Input:  height (int[])
  // Output: maxArea (int)
  // -------------------------------------------------------------------------
  'container-with-most-water': [
    // samples
    { input: '[1,8,6,2,5,4,8,3,7]', output: '49' },
    { input: '[1,1]',               output: '1'  },
    { input: '[4,3,2,1,4]',         output: '16' },
    // basic
    { input: '[1,2]',               output: '1'  },
    { input: '[2,1]',               output: '1'  },
    { input: '[2,2]',               output: '2'  },
    { input: '[1,2,3]',             output: '2'  },
    { input: '[3,2,1]',             output: '2'  },
    { input: '[2,2,2]',             output: '4'  },
    // all same
    { input: '[5,5,5,5,5]',         output: '20' },
    // increasing
    { input: '[1,2,3,4,5]',         output: '6'  },
    // decreasing
    { input: '[5,4,3,2,1]',         output: '6'  },
    // max at ends
    { input: '[10,1,1,1,10]',       output: '40' },
    { input: '[10,1,10]',           output: '20' },
    // tall walls
    { input: '[1,100,1]',           output: '2'  },
    { input: '[100,1,100]',         output: '200'},
    // valley
    { input: '[5,1,5]',             output: '10' },
    { input: '[3,1,3]',             output: '6'  },
    // plateau
    { input: '[5,5,1,5,5]',         output: '20' },
    // single large ending
    { input: '[1,2,4,3]',           output: '4'  },
    // zeros → no water
    { input: '[0,0]',               output: '0'  },
    { input: '[0,5]',               output: '0'  },
    // large
    { input: '[10000,10000]',        output: '10000' },
    { input: '[1,10000]',            output: '1'     },
    // tall middle irrelevant
    { input: '[2,3,10,5,7,8,9]',    output: '36' },
    // classic examples
    { input: '[1,3,2,5,25,24,5]',   output: '24' },
    { input: '[2,3,4,5,18,17,6]',   output: '17' },
    // longer
    { input: '[1,2,3,4,5,6,7,8,9,10]',output: '25'  },
    { input: '[10,9,8,7,6,5,4,3,2,1]',output: '25'  },
    { input: '[1,2,4,3,1,2,1,5,3,2]', output: '20'  },
    // stairs
    { input: '[1,1,1,1,1,1,1,1,1,1]', output: '9'   },
    // two tall
    { input: '[50,1,1,1,1,50]',        output: '250' },
    { input: '[50,1,1,50]',            output: '150' },
    { input: '[50,50]',                output: '50'  },
    // three elements analysis
    { input: '[3,1,2]',                output: '4'   },
    { input: '[2,1,3]',                output: '4'   },
    { input: '[1,3,2]',                output: '2'   },
    // stress
    { input: '[1,3,2,5,4,6,3,8,2,9]', output: '36'  },
    { input: '[100,1,2,3,4,5,6,7,8,100]',output: '900'},
    { input: '[1,1,1,1,1,1,1,100]',   output: '7'   },
    { input: '[100,1,1,1,1,1,1,1]',   output: '7'   },
    { input: '[3,9,3,4,7,2,12,6]',    output: '45'  },
    { input: '[2,1]',                  output: '1'   },
    { input: '[1,2,1]',                output: '2'   },
    { input: '[4,9,7,2,11,6]',         output: '28'  },
    { input: '[6,2,9,5,1,8,5]',        output: '48'  },
    { input: '[2,8,7,5,3,1,4,6]',      output: '35'  },
    { input: '[7,1,2,3,9]',            output: '28'  },
    { input: '[1,5,4,3]',              output: '9'   },
    { input: '[1,8,100,2,100,4,8,3,7]',output: '800' },
  ],

  // -------------------------------------------------------------------------
  // 29. LONGEST SUBSTRING WITHOUT REPEATING CHARACTERS
  // Input:  s (string)
  // Output: length (int)
  // -------------------------------------------------------------------------
  'longest-substring-without-repeating-characters': [
    // samples
    { input: '"abcabcbb"', output: '3' },
    { input: '"bbbbb"',    output: '1' },
    { input: '"pwwkew"',   output: '3' },
    // basic
    { input: '""',         output: '0' },
    { input: '"a"',        output: '1' },
    { input: '"ab"',       output: '2' },
    { input: '"aa"',       output: '1' },
    { input: '"abcd"',     output: '4' },
    { input: '"abba"',     output: '2' },
    { input: '"abcabc"',   output: '3' },
    // all unique
    { input: '"abcdefghijklmnopqrstuvwxyz"', output: '26' },
    // all same
    { input: '"aaaaaaa"',  output: '1' },
    { input: '"zzzz"',     output: '1' },
    // two chars
    { input: '"abababab"', output: '2' },
    { input: '"aababab"',  output: '2' },
    // numbers
    { input: '"1234567890"', output: '10' },
    { input: '"1231234"',    output: '4'  },
    // spaces
    { input: '" "',          output: '1'  },
    { input: '"a a"',        output: '2'  },
    { input: '"   "',        output: '1'  },
    // mixed
    { input: '"dvdf"',       output: '3'  },
    { input: '"tmmzuxt"',    output: '5'  },
    { input: '"anviaj"',     output: '5'  },
    // classic
    { input: '"au"',         output: '2'  },
    { input: '"aab"',        output: '2'  },
    { input: '"abcb"',       output: '3'  },
    { input: '"ohvhjdml"',   output: '6'  },
    // window slides
    { input: '"geeksforgeeks"', output: '7' },
    { input: '"nfpdmpi"',       output: '6' },
    { input: '"abcdeafbdgcbb"', output: '7' },
    { input: '"asjrgapa"',      output: '6' },
    // palindrome-like
    { input: '"abacabadabacaba"', output: '3' },
    // stress
    { input: '"abcdefabcdef"',   output: '6' },
    { input: '"aabaab!bb"',      output: '3' },
    { input: '"abcbda"',         output: '4' },
    { input: '"wobgrovw"',       output: '6' },
    { input: '"qrsvbspk"',       output: '5' },
    // long unique prefix
    { input: '"abcdefghijaa"',   output: '10' },
    // repeating pair
    { input: '"ababababab"',     output: '2'  },
    // three char cycle
    { input: '"abcabcabcabc"',  output: '3'  },
    // special chars
    { input: '"!@#$%^&*()"',    output: '10' },
    { input: '"!@#!@#"',        output: '3'  },
    { input: '"abcdef!@#"',     output: '9'  },
    // digits mixed chars
    { input: '"a1b2c3"',        output: '6'  },
    { input: '"a1b2a1"',        output: '4'  },
    // single dupe
    { input: '"abba"',          output: '2'  },
    { input: '"abcca"',         output: '3'  },
    // boundary
    { input: '"z"',             output: '1'  },
    { input: '"zy"',            output: '2'  },
    { input: '"zyx"',           output: '3'  },
    { input: '"zyxw"',          output: '4'  },
    { input: '"zyxwv"',         output: '5'  },
    { input: '"abcdefg"',       output: '7'  },
    { input: '"abcdefga"',      output: '7'  },
    { input: '"abc"',           output: '3'  },
  ],

  // -------------------------------------------------------------------------
  // 30. LONGEST REPEATING CHARACTER REPLACEMENT
  // Input:  s (string) \n k (int)
  // Output: length (int)
  // -------------------------------------------------------------------------
  'longest-repeating-character-replacement': [
    // samples
    { input: '"ABAB"\n2', output: '4' },
    { input: '"AABABBA"\n1', output: '4' },
    { input: '"AAAA"\n0', output: '4' },
    // basic
    { input: '"A"\n0',    output: '1' },
    { input: '"A"\n1',    output: '1' },
    { input: '"AB"\n0',   output: '1' },
    { input: '"AB"\n1',   output: '2' },
    { input: '"AB"\n2',   output: '2' },
    { input: '"AA"\n0',   output: '2' },
    { input: '"AA"\n1',   output: '2' },
    { input: '"ABB"\n1',  output: '3' },
    { input: '"AAB"\n1',  output: '3' },
    // all same char
    { input: '"AAAAAAA"\n0',   output: '7' },
    { input: '"AAAAAAA"\n3',   output: '7' },
    // all different → window = k+1
    { input: '"ABCDE"\n0',     output: '1' },
    { input: '"ABCDE"\n1',     output: '2' },
    { input: '"ABCDE"\n2',     output: '3' },
    { input: '"ABCDE"\n4',     output: '5' },
    // repeating pairs
    { input: '"AABB"\n1',      output: '3' },
    { input: '"AABB"\n2',      output: '4' },
    { input: '"ABABAB"\n1',    output: '4' },
    { input: '"ABABAB"\n2',    output: '6' },
    { input: '"ABABAB"\n3',    output: '6' },
    // k=0
    { input: '"AABBCC"\n0',    output: '2' },
    { input: '"ABCABC"\n0',    output: '1' },
    // long same
    { input: '"AAAAABBBBB"\n5',output: '10' },
    { input: '"AAAAABBBBB"\n0',output: '5'  },
    { input: '"AAAAABBBBB"\n2',output: '7'  },
    // mixed
    { input: '"ABCDABCD"\n2',  output: '6'  },
    { input: '"ABCDABCD"\n4',  output: '8'  },
    // two char
    { input: '"BAAAB"\n2',     output: '5'  },
    { input: '"BAAAB"\n0',     output: '3'  },
    // large k
    { input: '"ABCDEF"\n10',   output: '6'  },
    // stress
    { input: '"KRSCDCSONAJNHLBMDKIJ"\n4', output: '7' },
    { input: '"EOEMQLLQOQNQKIIQLLQQL"\n5',output: '12' },
    { input: '"AABABBA"\n0',    output: '2' },
    { input: '"AABABBA"\n2',    output: '5' },
    { input: '"AABABBA"\n3',    output: '7' },
    { input: '"AAABBA"\n1',     output: '5' },
    { input: '"AAABBA"\n2',     output: '6' },
    { input: '"EACBFFGB"\n2',   output: '5' },
    { input: '"AABABBA"\n4',    output: '7' },
    { input: '"ZZZABZ"\n2',     output: '6' },
    { input: '"ZZZABZ"\n1',     output: '4' },
    { input: '"ZZZABZ"\n0',     output: '3' },
    // boundary large
    { input: '"QWERTY"\n0', output: '1' },
    { input: '"QWERTY"\n5', output: '6' },
    { input: '"QWERTY"\n3', output: '4' },
    { input: '"AAABBB"\n0', output: '3' },
    { input: '"AAABBB"\n1', output: '4' },
    { input: '"AAABBB"\n3', output: '6' },
    { input: '"ABBBAB"\n2', output: '6' },
    { input: '"ABBBAB"\n1', output: '5' },
    { input: '"ABBBAB"\n0', output: '3' },
  ],

  // -------------------------------------------------------------------------
  // 31. PERMUTATION IN STRING
  // Input:  s1 (string) \n s2 (string)
  // Output: true | false  — does s2 contain a permutation of s1?
  // -------------------------------------------------------------------------
  'permutation-in-string': [
    // samples
    { input: '"ab"\n"eidbaooo"',   output: 'true'  },
    { input: '"ab"\n"eidboaoo"',   output: 'false' },
    { input: '"adc"\n"dcda"',      output: 'true'  },
    // basic true
    { input: '"a"\n"a"',           output: 'true'  },
    { input: '"a"\n"abc"',         output: 'true'  },
    { input: '"ab"\n"ab"',         output: 'true'  },
    { input: '"ab"\n"ba"',         output: 'true'  },
    { input: '"abc"\n"bca"',       output: 'true'  },
    { input: '"abc"\n"cbaxyz"',    output: 'true'  },
    { input: '"ab"\n"oab"',        output: 'true'  },
    // basic false
    { input: '"ab"\n"a"',          output: 'false' },
    { input: '"abc"\n"ab"',        output: 'false' },
    { input: '"ab"\n"cd"',         output: 'false' },
    { input: '"z"\n"abc"',         output: 'false' },
    // window-based
    { input: '"abc"\n"xyzabcabc"', output: 'true'  },
    { input: '"abc"\n"xyzxyzxyz"', output: 'false' },
    { input: '"aa"\n"aa"',         output: 'true'  },
    { input: '"aa"\n"ab"',         output: 'false' },
    { input: '"aa"\n"aab"',        output: 'true'  },
    // duplicates in s1
    { input: '"aab"\n"aab"',       output: 'true'  },
    { input: '"aab"\n"aba"',       output: 'true'  },
    { input: '"aab"\n"baa"',       output: 'true'  },
    { input: '"aab"\n"xyz"',       output: 'false' },
    // same anagram
    { input: '"hello"\n"ooolleohe"',output: 'true'  },
    // s1 longer than s2
    { input: '"abcde"\n"abcd"',    output: 'false' },
    // equal length
    { input: '"abcde"\n"edcba"',   output: 'true'  },
    { input: '"abcde"\n"abcdf"',   output: 'false' },
    // single char
    { input: '"a"\n"b"',           output: 'false' },
    { input: '"a"\n"aa"',          output: 'true'  },
    { input: '"b"\n"eidbaooo"',    output: 'true'  },
    // all same chars
    { input: '"aaaa"\n"aaaa"',     output: 'true'  },
    { input: '"aaaa"\n"aaaaaa"',   output: 'true'  },
    { input: '"aaaa"\n"aaab"',     output: 'false' },
    // stride through
    { input: '"ba"\n"eidbaooo"',   output: 'true'  },
    { input: '"ba"\n"ooobadei"',   output: 'true'  },
    { input: '"ba"\n"ooooooo"',    output: 'false' },
    // stress longer
    { input: '"abc"\n"abcdefghijklmnopqrstuvwxyz"', output: 'true'  },
    { input: '"xyz"\n"abcdefghijklmnopqrstuvw"',    output: 'false' },
    { input: '"xyz"\n"abcdefghijklmnopqrstuvwxyz"', output: 'true'  },
    // s1 = s2
    { input: '"abcde"\n"abcde"',   output: 'true'  },
    { input: '"abcde"\n"abcdef"',  output: 'true'  },
    // at end of s2
    { input: '"ba"\n"ooooba"',     output: 'true'  },
    { input: '"ba"\n"oooob"',      output: 'false' },
    // boundary window
    { input: '"ab"\n"ooooab"',     output: 'true'  },
    { input: '"ab"\n"ooooac"',     output: 'false' },
    // complex
    { input: '"triclops"\n"pistolrc"', output: 'false' },
    { input: '"listen"\n"enlist"',    output: 'true'   },
    { input: '"listen"\n"tinsel"',    output: 'true'   },
    { input: '"listen"\n"disenl"',    output: 'false'  },
    // repeated window check
    { input: '"ab"\n"abab"',          output: 'true'  },
    { input: '"ab"\n"baba"',          output: 'true'  },
    { input: '"ab"\n"cccc"',          output: 'false' },
    { input: '"ab"\n"ccccab"',        output: 'true'  },
  ],

  // -------------------------------------------------------------------------
  // 32. MIN STACK
  // Operations encoded as action strings
  // Input:  ops (string[]) — "push:val" | "pop" | "top" | "getMin"
  // Output: int[] — results of "top" and "getMin" calls only
  // -------------------------------------------------------------------------
  'min-stack': [
    // samples
    { input: '["push:-2","push:0","push:-3","getMin","pop","top","getMin"]',
      output: '[-3,0,-2]' },
    { input: '["push:1","push:2","getMin","pop","getMin"]',
      output: '[1,1]' },
    { input: '["push:5","getMin","push:3","getMin","pop","getMin"]',
      output: '[5,3,5]' },
    // basic push/pop/top/getMin
    { input: '["push:1","top","getMin"]',                     output: '[1,1]'    },
    { input: '["push:10","push:5","push:8","getMin","top"]',   output: '[5,8]'   },
    { input: '["push:3","push:3","push:3","getMin","pop","getMin"]', output: '[3,3]' },
    { input: '["push:0","push:1","push:0","getMin","pop","getMin"]', output: '[0,0]' },
    // min tracks correctly after pop
    { input: '["push:2","push:0","push:3","push:0","getMin","pop","getMin","pop","getMin"]',
      output: '[0,0,0]' },
    // single element
    { input: '["push:42","getMin","top"]', output: '[42,42]' },
    // all same
    { input: '["push:5","push:5","push:5","getMin","pop","getMin","pop","getMin"]',
      output: '[5,5,5]' },
    // descending
    { input: '["push:5","push:4","push:3","push:2","push:1","getMin"]',
      output: '[1]' },
    // ascending
    { input: '["push:1","push:2","push:3","push:4","push:5","getMin"]',
      output: '[1]' },
    // push negatives
    { input: '["push:-1","push:-2","push:-3","getMin"]', output: '[-3]' },
    { input: '["push:-3","push:-2","push:-1","getMin"]', output: '[-3]' },
    // interleaved getMin
    { input: '["push:5","getMin","push:3","getMin","push:7","getMin","pop","getMin","pop","getMin"]',
      output: '[5,3,3,3,5]' },
    // pop to minimum changes
    { input: '["push:1","push:2","pop","getMin"]', output: '[1]' },
    { input: '["push:2","push:1","pop","getMin"]', output: '[2]' },
    // large values
    { input: '["push:1000000","push:-1000000","getMin","pop","getMin"]',
      output: '[-1000000,1000000]' },
    // zeros
    { input: '["push:0","push:0","push:0","getMin","pop","getMin"]',
      output: '[0,0]' },
    // top after multiple pushes
    { input: '["push:1","push:2","push:3","top"]', output: '[3]' },
    // top reflects last pushed
    { input: '["push:10","push:5","push:20","top","getMin"]', output: '[20,5]' },
    // getMin repeatedly same
    { input: '["push:4","push:2","getMin","getMin","getMin"]', output: '[2,2,2]' },
    // stress 10 ops
    { input: '["push:3","push:1","push:4","push:1","push:5","getMin","pop","getMin","pop","getMin"]',
      output: '[1,1,1]' },
    { input: '["push:9","push:8","push:7","push:6","push:5","getMin","pop","pop","getMin"]',
      output: '[5,6]' },
    // min does not change on non-min pop
    { input: '["push:5","push:10","push:15","pop","getMin"]', output: '[5]' },
    { input: '["push:5","push:10","pop","pop","push:3","getMin"]', output: '[3]' },
    // alternating push/pop
    { input: '["push:1","push:2","pop","push:0","getMin"]', output: '[0]' },
    // single value repeated ops
    { input: '["push:7","top","getMin","top","getMin"]', output: '[7,7,7,7]' },
    // mix
    { input: '["push:6","push:3","push:9","getMin","top","pop","getMin","top"]',
      output: '[3,9,3,3]' },
    { input: '["push:2","push:3","push:1","top","getMin"]', output: '[1,1]' },
    { input: '["push:-1","push:-2","getMin","top","pop","getMin","top"]',
      output: '[-2,-2,-1,-1]' },
    { input: '["push:100","push:200","push:50","getMin","pop","getMin","pop","getMin"]',
      output: '[50,100,100]' },
    { input: '["push:1","push:1","push:1","pop","pop","getMin"]', output: '[1]' },
    { input: '["push:10","push:20","push:30","pop","pop","top","getMin"]',
      output: '[10,10]' },
    { input: '["push:5","push:5","push:5","pop","pop","pop","push:3","getMin"]',
      output: '[3]' },
    { input: '["push:3","push:2","push:1","getMin","pop","getMin","pop","getMin","pop","push:100","getMin"]',
      output: '[1,2,3,100]' },
  ],

  // =========================================================================
  // BATCH 3 — Problems 33–52 (Medium / Hard)
  // =========================================================================

  // -------------------------------------------------------------------------
  // 33. EVALUATE REVERSE POLISH NOTATION
  // Input:  tokens (string[])
  // Output: result (int)
  // -------------------------------------------------------------------------
  'evaluate-reverse-polish-notation': [
    // samples
    { input: '["2","1","+","3","*"]',           output: '9'   },
    { input: '["4","13","5","/","+"]',           output: '6'   },
    { input: '["10","6","9","3","+","-11","*","/","*","17","+","5","+"]', output: '22' },
    // basic
    { input: '["3","4","+"]',                   output: '7'   },
    { input: '["3","4","-"]',                   output: '-1'  },
    { input: '["3","4","*"]',                   output: '12'  },
    { input: '["8","4","/"]',                   output: '2'   },
    { input: '["1"]',                           output: '1'   },
    { input: '["0"]',                           output: '0'   },
    { input: '["-1"]',                          output: '-1'  },
    // two operands
    { input: '["5","1","+"]',                   output: '6'   },
    { input: '["5","1","-"]',                   output: '4'   },
    { input: '["5","1","*"]',                   output: '5'   },
    { input: '["6","2","/"]',                   output: '3'   },
    // negatives
    { input: '["-3","4","+"]',                  output: '1'   },
    { input: '["-3","-4","+"]',                 output: '-7'  },
    { input: '["-3","-4","*"]',                 output: '12'  },
    { input: '["10","-3","+"]',                 output: '7'   },
    { input: '["10","-3","-"]',                 output: '13'  },
    { input: '["10","-3","*"]',                 output: '-30' },
    { input: '["-10","2","/"]',                 output: '-5'  },
    // deeper expressions
    { input: '["2","3","4","*","+"]',           output: '14'  },
    { input: '["5","3","2","*","+"]',           output: '11'  },
    { input: '["1","2","3","*","4","*","+"]',   output: '25'  },
    { input: '["2","2","2","*","*"]',           output: '8'   },
    { input: '["2","3","+","4","*"]',           output: '20'  },
    { input: '["5","2","-","3","*"]',           output: '9'   },
    { input: '["4","3","/","2","*"]',           output: '2'   },
    { input: '["15","7","1","1","+","-","/","3","*","2","1","1","+","+","-"]', output: '5' },
    // truncated division
    { input: '["7","2","/"]',                   output: '3'   },
    { input: '["-7","2","/"]',                  output: '-3'  },
    { input: '["7","-2","/"]',                  output: '-3'  },
    { input: '["-7","-2","/"]',                 output: '3'   },
    { input: '["1","2","/"]',                   output: '0'   },
    { input: '["-1","2","/"]',                  output: '0'   },
    // zero operations
    { input: '["0","5","+"]',                   output: '5'   },
    { input: '["5","0","+"]',                   output: '5'   },
    { input: '["0","5","*"]',                   output: '0'   },
    { input: '["10","0","*"]',                  output: '0'   },
    { input: '["0","0","+"]',                   output: '0'   },
    // large values
    { input: '["100","200","+"]',               output: '300' },
    { input: '["1000","500","-"]',              output: '500' },
    { input: '["100","10","*"]',                output: '1000'},
    { input: '["1000","10","/"]',               output: '100' },
    // chained
    { input: '["1","2","+","3","+","4","+"]',    output: '10' },
    { input: '["10","2","*","3","*"]',           output: '60' },
    { input: '["20","4","/","3","-"]',           output: '2'  },
    { input: '["6","3","2","*","*"]',            output: '36' },
    { input: '["9","3","/","4","2","/","*"]',    output: '6'  },
    { input: '["3","11","+","5","-"]',           output: '9'  },
    { input: '["3","11","5","+","*"]',           output: '48' },
    { input: '["4","8","2","*","*"]',            output: '64' },
    { input: '["5","5","5","5","+","+","+"]',   output: '20' },
    { input: '["2","2","^"]',                   output: '4'  },
    { input: '["1","1","1","1","1","+","+","+","+"]', output: '5' },
    { input: '["100","100","*","100","/"]',      output: '100'},
    { input: '["7","3","2","*","-"]',            output: '1'  },
    { input: '["8","5","1","1","+","-","*"]',    output: '40' },
    { input: '["9","8","7","*","+"]',            output: '65' },
    { input: '["2","3","^","4","+"]',            output: '12' },
    { input: '["6","1","3","/","*"]',            output: '6'  },
    { input: '["2","1","3","*","+","4","-"]',    output: '1'  },
    { input: '["5","2","3","*","4","*","+"]',    output: '29' },
  ],

  // -------------------------------------------------------------------------
  // 34. GENERATE PARENTHESES
  // Input:  n (int)
  // Output: string[] sorted lexicographically
  // -------------------------------------------------------------------------
  'generate-parentheses': [
    // samples
    { input: '1', output: '["()"]' },
    { input: '2', output: '["(())","()()"]' },
    { input: '3', output: '["((()))","(()())","(())()","()(())","()()()"]' },
    // n=4
    { input: '4', output: '["(((())))","((()()))","((())())","((()))()","(()(()))","(()()())","(()())()","(())(())","(())()()","()((())) ","()((()))","()(()())","()(())()","()()(())","()()()()"]' },
    // edge
    { input: '1', output: '["()"]' },
    // count verification: n=1→1, n=2→2, n=3→5, n=4→14
    { input: '2', output: '["(())","()()"]' },
    { input: '3', output: '["((()))","(()())","(())()","()(())","()()()"]' },
    // repeated checks
    { input: '1', output: '["()"]' },
    { input: '2', output: '["(())","()()"]' },
    { input: '3', output: '["((()))","(()())","(())()","()(())","()()()"]' },
    // same inputs different angles
    { input: '1', output: '["()"]' },
    { input: '1', output: '["()"]' },
    { input: '2', output: '["(())","()()"]' },
    { input: '2', output: '["(())","()()"]' },
    { input: '3', output: '["((()))","(()())","(())()","()(())","()()()"]' },
    { input: '3', output: '["((()))","(()())","(())()","()(())","()()()"]' },
  ],

  // -------------------------------------------------------------------------
  // 35. DAILY TEMPERATURES
  // Input:  temperatures (int[])
  // Output: int[] — days until warmer temp, 0 if none
  // -------------------------------------------------------------------------
  'daily-temperatures': [
    // samples
    { input: '[73,74,75,71,69,72,76,73]', output: '[1,1,4,2,1,1,0,0]' },
    { input: '[30,40,50,60]',             output: '[1,1,1,0]'          },
    { input: '[30,60,90]',                output: '[1,1,0]'            },
    // basic
    { input: '[70]',                      output: '[0]'   },
    { input: '[70,71]',                   output: '[1,0]' },
    { input: '[71,70]',                   output: '[0,0]' },
    { input: '[70,70]',                   output: '[0,0]' },
    { input: '[70,71,72]',               output: '[1,1,0]' },
    { input: '[72,71,70]',               output: '[0,0,0]' },
    { input: '[50,60,50,60,50]',          output: '[1,0,1,0,0]' },
    // all same
    { input: '[55,55,55,55,55]',          output: '[0,0,0,0,0]' },
    // ascending
    { input: '[60,61,62,63,64,65,66,67,68,69]', output: '[1,1,1,1,1,1,1,1,1,0]' },
    // descending
    { input: '[69,68,67,66,65,64,63,62,61,60]', output: '[0,0,0,0,0,0,0,0,0,0]' },
    // plateau then rise
    { input: '[70,70,70,80]',              output: '[3,2,1,0]' },
    // single rise
    { input: '[100,101]',                  output: '[1,0]'     },
    // far wait
    { input: '[70,69,68,67,66,65,64,63,62,71]', output: '[9,8,7,6,5,4,3,2,1,0]' },
    // alternating
    { input: '[72,71,73,70,75]',           output: '[2,1,2,1,0]' },
    // large then small
    { input: '[100,50,60,70,80,90,100]',   output: '[0,1,1,1,1,1,0]' },
    // same then warm
    { input: '[70,70,70,70,80]',           output: '[4,3,2,1,0]' },
    // near-boundary single warm
    { input: '[71,70,80]',                 output: '[2,1,0]' },
    // zigzag
    { input: '[70,72,68,74,66,76]',        output: '[1,2,1,2,1,0]' },
    // stable then dip then spike
    { input: '[80,80,80,70,90]',           output: '[0,0,0,1,0]' },
    // realistic daily
    { input: '[55,60,58,62,57,65]',        output: '[1,2,1,2,1,0]' },
    { input: '[89,62,70,58,47,47,46,76,100,70]', output: '[8,1,5,4,3,2,1,1,0,0]' },
    { input: '[34,80,80,34,34,80,80,80,80,34]',  output: '[1,0,0,2,1,0,0,0,0,0]' },
    // boundary
    { input: '[30]',                       output: '[0]' },
    { input: '[100]',                      output: '[0]' },
    { input: '[30,100]',                   output: '[1,0]' },
    { input: '[100,30]',                   output: '[0,0]' },
    // longer stress
    { input: '[73,74,75,71,69,72,76,73,75,78]', output: '[1,1,4,2,1,1,3,1,1,0]' },
    { input: '[50,50,50,50,51]',           output: '[4,3,2,1,0]' },
    { input: '[51,50,50,50,50]',           output: '[0,0,0,0,0]' },
    // two peaks
    { input: '[60,70,65,65,65,80]',        output: '[1,4,3,2,1,0]' },
    { input: '[65,65,65,70,65,75]',        output: '[3,2,1,2,1,0]' },
    // flat line
    { input: '[65,65,65,65,65,65,65]',     output: '[0,0,0,0,0,0,0]' },
    // spike in middle
    { input: '[60,60,90,60,60]',           output: '[2,1,0,0,0]' },
    { input: '[60,80,60,80,60]',           output: '[1,0,1,0,0]' },
    // small array
    { input: '[1,2,3,4,5]',               output: '[1,1,1,1,0]' },
    { input: '[5,4,3,2,1]',               output: '[0,0,0,0,0]' },
    // mixed values
    { input: '[77,56,66,58,82,74,88,88]', output: '[4,1,2,1,2,1,0,0]' },
    { input: '[83,92,71,77,83,84,72,64]', output: '[1,0,1,1,1,0,0,0]' },
    { input: '[68,72,57,78,71,63,85]',    output: '[1,2,1,3,2,1,0]'   },
    { input: '[65,75,75,75,76]',           output: '[1,4,3,2,0]'       },
    { input: '[70,70,71,70,70]',           output: '[2,1,0,0,0]'       },
    { input: '[100,99,98,100]',            output: '[0,2,1,0]'         },
    { input: '[60,65,70,65,60]',           output: '[1,1,0,0,0]'       },
    { input: '[71,69,72,68,73]',           output: '[2,1,2,1,0]'       },
    { input: '[81,80,79,82,80,85]',        output: '[3,2,1,2,1,0]'     },
  ],

  // -------------------------------------------------------------------------
  // 36. CAR FLEET
  // Input:  target (int) \n position (int[]) \n speed (int[])
  // Output: number of fleets (int)
  // -------------------------------------------------------------------------
  'car-fleet': [
    // samples
    { input: '12\n[10,8,0,5,3]\n[2,4,1,1,3]', output: '3' },
    { input: '10\n[3]\n[3]',                   output: '1' },
    { input: '100\n[0,2,4]\n[4,2,1]',          output: '1' },
    // basic
    { input: '10\n[6,8]\n[3,2]',               output: '2' },
    { input: '10\n[8,6]\n[2,3]',               output: '1' },
    { input: '10\n[5]\n[2]',                   output: '1' },
    // two cars same arrival
    { input: '12\n[10,9]\n[2,3]',              output: '1' },
    { input: '10\n[0,4]\n[2,1]',               output: '1' },
    // two cars, front slower
    { input: '10\n[4,0]\n[1,4]',              output: '2' },
    // all merge into one
    { input: '10\n[0,1,2,3,4]\n[5,4,3,2,1]',  output: '1' },
    // none merge
    { input: '10\n[0,2,4,6,8]\n[1,1,1,1,1]',  output: '5' },
    // three fleets
    { input: '15\n[1,4,7,10,13]\n[6,3,1,3,1]',output: '3' },
    // large target
    { input: '100\n[0,50,99]\n[10,1,1]',       output: '3' },
    { input: '100\n[0,50,99]\n[100,1,1]',      output: '2' },
    // car at target - 1
    { input: '10\n[9]\n[1]',                   output: '1' },
    // cars with varying speeds all merge
    { input: '20\n[0,5,10,15]\n[5,4,3,2]',    output: '1' },
    // reverse order positions
    { input: '10\n[9,8,7,6,5]\n[1,1,1,1,1]',  output: '5' },
    // same speed different position
    { input: '10\n[1,4,7]\n[3,3,3]',          output: '3' },
    // same position (edge)
    { input: '10\n[5,5]\n[2,3]',              output: '1' },
    // front faster than behind → separate
    { input: '10\n[3,7]\n[2,1]',              output: '2' },
    // behind faster than front → merge
    { input: '10\n[3,7]\n[3,1]',              output: '1' },
    // chain merge
    { input: '20\n[2,8,14]\n[9,4,1]',         output: '1' },
    // partial merge
    { input: '20\n[2,8,14]\n[1,4,9]',         output: '3' },
    // single car
    { input: '1\n[0]\n[1]',                   output: '1' },
    // car at target boundary
    { input: '5\n[4]\n[10]',                  output: '1' },
    // large fleet
    { input: '100\n[0,10,20,30,40,50,60,70,80,90]\n[1,1,1,1,1,1,1,1,1,1]', output: '10' },
    { input: '100\n[0,10,20,30,40,50,60,70,80,90]\n[10,9,8,7,6,5,4,3,2,1]',output: '1'  },
    // two at end merge
    { input: '10\n[7,8,9]\n[1,1,1]',          output: '3' },
    { input: '10\n[7,8,9]\n[3,2,1]',          output: '1' },
    // zero speed (starts at 0, never reaches — edge, but assume valid)
    { input: '10\n[0]\n[1]',                  output: '1' },
    // equal time to target
    { input: '6\n[3,4,5]\n[2,2,2]',           output: '3' },
    // merge in groups
    { input: '100\n[10,30,50,70,90]\n[5,3,2,1,1]',output: '3' },
    // realistic NeetCode example
    { input: '12\n[10,8,0,5,3]\n[2,4,1,1,3]', output: '3' },
    // one car way behind, very fast
    { input: '50\n[45,20]\n[1,5]',            output: '2' },
    { input: '50\n[45,20]\n[1,6]',            output: '1' },
    // all at same pos
    { input: '10\n[5,5,5]\n[1,2,3]',          output: '1' },
    // many cars one fleet
    { input: '30\n[0,5,10,15,20,25]\n[6,5,4,3,2,1]', output: '1' },
    // many cars all separate
    { input: '30\n[0,5,10,15,20,25]\n[1,1,1,1,1,1]', output: '6' },
    // boundary speed 1
    { input: '5\n[1,2,3,4]\n[1,1,1,1]',       output: '4' },
    { input: '5\n[1,2,3,4]\n[4,3,2,1]',       output: '1' },
    { input: '10\n[6,4,2,0]\n[1,2,3,4]',      output: '4' },
    { input: '10\n[0,2,4,6]\n[4,3,2,1]',      output: '1' },
    { input: '15\n[0,3,6,9,12]\n[3,3,3,3,3]', output: '5' },
    { input: '15\n[0,3,6,9,12]\n[15,5,3,2,1]',output: '1' },
    { input: '20\n[18,14,10,6,2]\n[1,2,3,4,5]',output: '5'},
    { input: '20\n[2,6,10,14,18]\n[5,4,3,2,1]',output: '1'},
    { input: '100\n[90]\n[10]',                output: '1' },
    { input: '100\n[0,90]\n[9,1]',             output: '2' },
  ],

  // -------------------------------------------------------------------------
  // 37. FIND MINIMUM IN ROTATED SORTED ARRAY
  // Input:  nums (int[]) — rotated sorted, distinct
  // Output: minimum (int)
  // -------------------------------------------------------------------------
  'find-minimum-in-rotated-sorted-array': [
    // samples
    { input: '[3,4,5,1,2]',             output: '1' },
    { input: '[4,5,6,7,0,1,2]',         output: '0' },
    { input: '[11,13,15,17]',           output: '11' },
    // basic
    { input: '[1]',                     output: '1'  },
    { input: '[2,1]',                   output: '1'  },
    { input: '[1,2]',                   output: '1'  },
    { input: '[3,1,2]',                 output: '1'  },
    { input: '[2,3,1]',                 output: '1'  },
    { input: '[1,2,3]',                 output: '1'  },
    // no rotation
    { input: '[1,2,3,4,5]',             output: '1'  },
    { input: '[10,20,30,40,50]',        output: '10' },
    // full rotation (same as no rotation)
    { input: '[1,2,3,4,5]',             output: '1'  },
    // rotated by 1
    { input: '[2,3,4,5,1]',             output: '1'  },
    // rotated by 2
    { input: '[3,4,5,1,2]',             output: '1'  },
    // rotated by 3
    { input: '[4,5,1,2,3]',             output: '1'  },
    // rotated by 4
    { input: '[5,1,2,3,4]',             output: '1'  },
    // min at start (no rotation)
    { input: '[1,3,5,7,9]',             output: '1'  },
    // min at end
    { input: '[3,5,7,9,1]',             output: '1'  },
    // min in middle
    { input: '[5,7,9,1,3]',             output: '1'  },
    // two elements
    { input: '[1,2]',                   output: '1'  },
    { input: '[2,1]',                   output: '1'  },
    // negatives
    { input: '[0,-3,-2,-1]',            output: '-3' },
    { input: '[-3,-2,-1,0]',            output: '-3' },
    { input: '[0,1,-2,-1]',             output: '-2' },
    // large values
    { input: '[1000,2000,3000,4000,1]', output: '1'    },
    { input: '[1,1000,2000,3000,4000]', output: '1'    },
    // length 5 all rotations
    { input: '[1,2,3,4,5]',  output: '1' },
    { input: '[2,3,4,5,1]',  output: '1' },
    { input: '[3,4,5,1,2]',  output: '1' },
    { input: '[4,5,1,2,3]',  output: '1' },
    { input: '[5,1,2,3,4]',  output: '1' },
    // larger arrays
    { input: '[7,8,9,10,11,12,1,2,3,4,5,6]',     output: '1'  },
    { input: '[10,20,30,5,6,7,8,9]',              output: '5'  },
    { input: '[5,6,7,8,9,10,20,30]',              output: '5'  },
    { input: '[100,200,300,400,500,1,10,50]',      output: '1'  },
    // pivot at position 1
    { input: '[10,1,2,3,4,5,6,7,8,9]',            output: '1'  },
    // pivot at last
    { input: '[2,3,4,5,6,7,8,9,10,1]',            output: '1'  },
    // three elements all rotations
    { input: '[1,2,3]', output: '1' },
    { input: '[2,3,1]', output: '1' },
    { input: '[3,1,2]', output: '1' },
    // six elements
    { input: '[4,5,6,1,2,3]', output: '1' },
    { input: '[3,4,5,6,1,2]', output: '1' },
    { input: '[2,3,4,5,6,1]', output: '1' },
    { input: '[1,2,3,4,5,6]', output: '1' },
    // stress
    { input: '[7,8,9,1,2,3,4,5,6]',   output: '1'  },
    { input: '[6,7,8,9,1,2,3,4,5]',   output: '1'  },
    { input: '[100,101,102,103,1,50]', output: '1'  },
    { input: '[50,100,101,102,103,1]', output: '1'  },
    { input: '[1,50,100,101,102,103]', output: '1'  },
    { input: '[200,300,400,500,100]',  output: '100'},
    { input: '[300,400,500,100,200]',  output: '100'},
    { input: '[400,500,100,200,300]',  output: '100'},
    { input: '[500,100,200,300,400]',  output: '100'},
    { input: '[15,1,3,5,7,9,11,13]',  output: '1'  },
    { input: '[3,5,7,9,11,13,15,1]',  output: '1'  },
  ],

  // -------------------------------------------------------------------------
  // 38. SEARCH IN ROTATED SORTED ARRAY
  // Input:  nums (int[]) \n target (int)
  // Output: index (int) or -1
  // -------------------------------------------------------------------------
  'search-in-rotated-sorted-array': [
    // samples
    { input: '[4,5,6,7,0,1,2]\n0',   output: '4'  },
    { input: '[4,5,6,7,0,1,2]\n3',   output: '-1' },
    { input: '[1]\n0',               output: '-1' },
    // basic found
    { input: '[1]\n1',               output: '0'  },
    { input: '[3,1]\n1',             output: '1'  },
    { input: '[3,1]\n3',             output: '0'  },
    { input: '[1,3]\n1',             output: '0'  },
    { input: '[1,3]\n3',             output: '1'  },
    // basic not found
    { input: '[1]\n2',               output: '-1' },
    { input: '[3,1]\n2',             output: '-1' },
    // no rotation found/not found
    { input: '[1,2,3,4,5]\n3',       output: '2'  },
    { input: '[1,2,3,4,5]\n6',       output: '-1' },
    // rotation various
    { input: '[5,1,2,3,4]\n1',       output: '1'  },
    { input: '[5,1,2,3,4]\n4',       output: '4'  },
    { input: '[5,1,2,3,4]\n5',       output: '0'  },
    { input: '[5,1,2,3,4]\n6',       output: '-1' },
    { input: '[2,3,4,5,1]\n1',       output: '4'  },
    { input: '[2,3,4,5,1]\n5',       output: '3'  },
    { input: '[2,3,4,5,1]\n3',       output: '1'  },
    // target at boundary
    { input: '[4,5,6,7,0,1,2]\n4',   output: '0'  },
    { input: '[4,5,6,7,0,1,2]\n2',   output: '6'  },
    // negatives
    { input: '[-1,0,1,2,3]\n0',      output: '1'  },
    { input: '[0,1,2,3,-1]\n-1',     output: '4'  },
    { input: '[1,3,-3,-1,0]\n3',     output: '1'  },
    // various rotations 6-element
    { input: '[4,5,6,1,2,3]\n1',     output: '3'  },
    { input: '[4,5,6,1,2,3]\n6',     output: '2'  },
    { input: '[4,5,6,1,2,3]\n7',     output: '-1' },
    { input: '[3,4,5,6,1,2]\n6',     output: '3'  },
    { input: '[3,4,5,6,1,2]\n3',     output: '0'  },
    { input: '[3,4,5,6,1,2]\n0',     output: '-1' },
    // pivot at position 1
    { input: '[6,1,2,3,4,5]\n1',     output: '1'  },
    { input: '[6,1,2,3,4,5]\n6',     output: '0'  },
    { input: '[6,1,2,3,4,5]\n5',     output: '5'  },
    { input: '[6,1,2,3,4,5]\n7',     output: '-1' },
    // pivot at last
    { input: '[1,2,3,4,5,6]\n6',     output: '5'  },
    { input: '[2,3,4,5,6,1]\n1',     output: '5'  },
    // large rotated
    { input: '[7,8,9,1,2,3,4,5,6]\n9',   output: '2'  },
    { input: '[7,8,9,1,2,3,4,5,6]\n6',   output: '8'  },
    { input: '[7,8,9,1,2,3,4,5,6]\n7',   output: '0'  },
    { input: '[7,8,9,1,2,3,4,5,6]\n10',  output: '-1' },
    { input: '[7,8,9,1,2,3,4,5,6]\n0',   output: '-1' },
    // stress
    { input: '[100,200,300,1,10,50]\n1',    output: '3'  },
    { input: '[100,200,300,1,10,50]\n100',  output: '0'  },
    { input: '[100,200,300,1,10,50]\n50',   output: '5'  },
    { input: '[100,200,300,1,10,50]\n99',   output: '-1' },
    { input: '[100,200,300,1,10,50]\n301',  output: '-1' },
    { input: '[1,3,5,7,9,11,0]\n0',         output: '6'  },
    { input: '[1,3,5,7,9,11,0]\n5',         output: '2'  },
    { input: '[1,3,5,7,9,11,0]\n11',        output: '5'  },
    { input: '[11,0,1,3,5,7,9]\n0',         output: '1'  },
    { input: '[11,0,1,3,5,7,9]\n9',         output: '6'  },
    { input: '[11,0,1,3,5,7,9]\n11',        output: '0'  },
    { input: '[11,0,1,3,5,7,9]\n4',         output: '-1' },
    { input: '[0,1,2,3,4,5]\n3',            output: '3'  },
    { input: '[3,4,5,0,1,2]\n0',            output: '3'  },
    { input: '[3,4,5,0,1,2]\n3',            output: '0'  },
    { input: '[3,4,5,0,1,2]\n2',            output: '5'  },
    { input: '[3,4,5,0,1,2]\n6',            output: '-1' },
  ],

  // -------------------------------------------------------------------------
  // 39. KOKO EATING BANANAS
  // Input:  piles (int[]) \n h (int)
  // Output: minimum speed k (int)
  // -------------------------------------------------------------------------
  'koko-eating-bananas': [
    // samples
    { input: '[3,6,7,11]\n8',   output: '4'  },
    { input: '[30,11,23,4,20]\n5',  output: '30' },
    { input: '[30,11,23,4,20]\n6',  output: '23' },
    // basic
    { input: '[1]\n1',          output: '1'  },
    { input: '[2]\n1',          output: '2'  },
    { input: '[2]\n2',          output: '1'  },
    { input: '[3]\n1',          output: '3'  },
    { input: '[3]\n2',          output: '2'  },
    { input: '[3]\n3',          output: '1'  },
    { input: '[4]\n4',          output: '1'  },
    // all same
    { input: '[5,5,5]\n3',      output: '5'  },
    { input: '[5,5,5]\n6',      output: '3'  },
    { input: '[5,5,5]\n15',     output: '1'  },
    // h = piles.length (eat each pile in exactly 1 hour)
    { input: '[1,2,3,4,5]\n5',  output: '5'  },
    // h >> piles.length
    { input: '[1,2,3,4,5]\n100',output: '1'  },
    // large pile
    { input: '[1000000000]\n1', output: '1000000000' },
    { input: '[1000000000]\n2', output: '500000000'  },
    // sorted piles
    { input: '[1,1,1,1000000000]\n4',   output: '1000000000' },
    { input: '[1,1,1,1000000000]\n1000000003', output: '1' },
    // classic
    { input: '[312884470]\n312884469',  output: '2'  },
    { input: '[3,6,7,11]\n4',           output: '11' },
    // more cases
    { input: '[2,2]\n2',               output: '2'  },
    { input: '[4,4,4,4]\n4',           output: '4'  },
    { input: '[4,4,4,4]\n8',           output: '2'  },
    { input: '[4,4,4,4]\n16',          output: '1'  },
    { input: '[10,5,3,1]\n4',          output: '10' },
    { input: '[10,5,3,1]\n5',          output: '5'  },
    { input: '[10,5,3,1]\n8',          output: '3'  },
    { input: '[10,5,3,1]\n10',         output: '2'  },
    { input: '[10,5,3,1]\n19',         output: '1'  },
    { input: '[805306368,805306368,805306368]\n1000000000', output: '3' },
    { input: '[1,2,3,4,5,6,7,8,9,10]\n10', output: '10' },
    { input: '[1,2,3,4,5,6,7,8,9,10]\n20', output: '5'  },
    { input: '[1,2,3,4,5,6,7,8,9,10]\n55', output: '1'  },
    // h = sum of piles (k=1)
    { input: '[3,6,7,11]\n27',         output: '1'  },
    // stress
    { input: '[100,200,300,400,500]\n5',  output: '500' },
    { input: '[100,200,300,400,500]\n10', output: '250' },
    { input: '[100,200,300,400,500]\n15', output: '167' },
    { input: '[100,200,300,400,500]\n50', output: '50'  },
    { input: '[7,15,6,3]\n8',            output: '8'   },
    { input: '[7,15,6,3]\n5',            output: '15'  },
    { input: '[7,15,6,3]\n10',           output: '8'   },
    { input: '[2,9,4,5,8]\n6',           output: '8'   },
    { input: '[2,9,4,5,8]\n9',           output: '5'   },
    { input: '[332484035,524908576,855865814,632922376,222257295,690155293,112677673,679580077,1490375,306127588,703995,1132695,1890293,100]\n823855818', output: '14' },
    { input: '[1,1,1,1,1,1,1,1,1,1]\n10', output: '1' },
    { input: '[1,1,1,1,1,1,1,1,1,1]\n1',  output: '1' },
    { input: '[8,3,4]\n8',                output: '3'  },
    { input: '[8,3,4]\n6',                output: '4'  },
    { input: '[8,3,4]\n5',                output: '5'  },
    { input: '[8,3,4]\n3',                output: '8'  },
    { input: '[1000,1000]\n2',            output: '1000' },
    { input: '[1000,1000]\n4',            output: '500'  },
    { input: '[25,10,23,4]\n4',           output: '25'   },
    { input: '[25,10,23,4]\n5',           output: '23'   },
  ],

  // -------------------------------------------------------------------------
  // 40. MEDIAN OF TWO SORTED ARRAYS
  // Input:  nums1 (int[]) \n nums2 (int[])
  // Output: median (float, 1 decimal if .5 else .0 — stored as string)
  // -------------------------------------------------------------------------
  'median-of-two-sorted-arrays': [
    // samples
    { input: '[1,3]\n[2]',         output: '2.0'  },
    { input: '[1,2]\n[3,4]',       output: '2.5'  },
    { input: '[0,0]\n[0,0]',       output: '0.0'  },
    // basic
    { input: '[]\n[1]',            output: '1.0'  },
    { input: '[2]\n[]',            output: '2.0'  },
    { input: '[1,3]\n[2,4]',       output: '2.5'  },
    { input: '[1,2]\n[3,4,5]',     output: '3.0'  },
    { input: '[1,2,3]\n[4,5]',     output: '3.0'  },
    { input: '[1,3,5]\n[2,4,6]',   output: '3.5'  },
    { input: '[1,2,3,4]\n[5,6,7,8]',output:'4.5'  },
    // even total
    { input: '[1,2,3,4,5,6]\n[]',  output: '3.5'  },
    { input: '[]\n[1,2,3,4,5,6]',  output: '3.5'  },
    // odd total
    { input: '[1,2,3,4,5]\n[]',    output: '3.0'  },
    { input: '[]\n[1,2,3,4,5]',    output: '3.0'  },
    // one empty
    { input: '[]\n[2,3]',          output: '2.5'  },
    { input: '[1]\n[]',            output: '1.0'  },
    // all same
    { input: '[2,2]\n[2,2]',       output: '2.0'  },
    { input: '[1,1,1]\n[1,1]',     output: '1.0'  },
    // negatives
    { input: '[-1,-1]\n[-1,-1]',   output: '-1.0' },
    { input: '[-2,-1]\n[0,1]',     output: '-0.5' },
    { input: '[-3,-1]\n[-2,0]',    output: '-1.5' },
    // non-overlapping
    { input: '[1,2,3]\n[100,101,102]', output: '51.5' },
    { input: '[100,101,102]\n[1,2,3]', output: '51.5' },
    // large arrays
    { input: '[1,3,5,7,9]\n[2,4,6,8,10]', output: '5.5' },
    { input: '[1,2,3,4,5,6,7,8,9,10]\n[]', output: '5.5' },
    // lengths differ
    { input: '[1]\n[2,3,4,5,6]',   output: '3.5'  },
    { input: '[1,2,3,4,5]\n[6]',   output: '3.5'  },
    // boundary
    { input: '[1,2]\n[1,2,3]',     output: '2.0'  },
    { input: '[2,2,2]\n[1,1]',     output: '2.0'  },
    { input: '[1,2]\n[3]',         output: '2.0'  },
    { input: '[3]\n[1,2]',         output: '2.0'  },
    // classic edge cases
    { input: '[2]\n[1,3]',         output: '2.0'  },
    { input: '[1,3]\n[2,4]',       output: '2.5'  },
    { input: '[4,9,15,35,89]\n[1,2,16,53]', output: '15.0' },
    // stress
    { input: '[1,3,5,7]\n[2,4,6,8]',      output: '4.5' },
    { input: '[1,2,3,4,5]\n[6,7,8,9,10]', output: '5.5' },
    { input: '[1,2,3]\n[4]',               output: '2.5' },
    { input: '[4]\n[1,2,3]',               output: '2.5' },
    { input: '[1]\n[1]',                   output: '1.0' },
    { input: '[1,2]\n[2]',                 output: '2.0' },
    { input: '[2]\n[1,2]',                 output: '2.0' },
    { input: '[1,2,3,4]\n[]',              output: '2.5' },
    { input: '[]\n[1,2,3,4]',              output: '2.5' },
    { input: '[1,2,3]\n[]',                output: '2.0' },
    { input: '[]\n[1,2,3]',                output: '2.0' },
    { input: '[100000]\n[100001]',          output: '100000.5' },
    { input: '[1,7]\n[2,4,6]',             output: '4.0' },
    { input: '[2,4,6]\n[1,7]',             output: '4.0' },
    { input: '[1,3,5]\n[2,4,6,8]',         output: '4.0' },
    { input: '[0,1,2,3,4,5,6,7,8,9]\n[10,11,12,13,14,15,16,17,18,19]', output: '9.5' },
  ],

  // -------------------------------------------------------------------------
  // 41. TWO SUM II — INPUT ARRAY IS SORTED
  // Input:  numbers (int[], 1-indexed sorted) \n target (int)
  // Output: [index1, index2] 1-indexed
  // -------------------------------------------------------------------------
  'two-sum-ii-input-array-is-sorted': [
    // samples
    { input: '[2,7,11,15]\n9',       output: '[1,2]' },
    { input: '[2,3,4]\n6',           output: '[1,3]' },
    { input: '[-1,0]\n-1',           output: '[1,2]' },
    // basic
    { input: '[1,2]\n3',             output: '[1,2]' },
    { input: '[1,3]\n4',             output: '[1,2]' },
    { input: '[2,3]\n5',             output: '[1,2]' },
    { input: '[1,2,3]\n4',           output: '[1,3]' },
    { input: '[1,2,3]\n5',           output: '[2,3]' },
    { input: '[1,2,4,8]\n5',         output: '[1,3]' },
    { input: '[1,2,4,8]\n9',         output: '[1,4]' },
    { input: '[1,2,4,8]\n6',         output: '[2,3]' },
    // same values
    { input: '[3,3]\n6',             output: '[1,2]' },
    { input: '[1,1,1,1]\n2',         output: '[1,2]' },
    // negatives
    { input: '[-3,-2,-1,0]\n-3',     output: '[1,2]' },
    { input: '[-3,-2,-1,0]\n-1',     output: '[1,3]' },
    { input: '[-3,-2,-1,0]\n0',      output: '[2,3]' },
    { input: '[-4,-1,0,1,2]\n-3',    output: '[1,2]' },
    { input: '[-4,-1,0,1,2]\n1',     output: '[2,4]' },
    // large values
    { input: '[100,200,300,400,500]\n900', output: '[4,5]' },
    { input: '[100,200,300,400,500]\n800', output: '[3,5]' },
    { input: '[100,200,300,400,500]\n700', output: '[2,5]' },
    { input: '[100,200,300,400,500]\n600', output: '[1,5]' },
    { input: '[100,200,300,400,500]\n500', output: '[1,4]' },
    // answer in middle
    { input: '[1,3,4,5,6,7,8,9,10]\n7',   output: '[3,4]' },
    { input: '[1,3,4,5,6,7,8,9,10]\n11',  output: '[2,5]' },
    { input: '[2,3,4,5,6]\n9',            output: '[3,4]' },
    { input: '[2,3,4,5,6]\n8',            output: '[2,4]' },
    { input: '[2,3,4,5,6]\n7',            output: '[1,4]' },
    // target low
    { input: '[1,2,3,4,5]\n3',            output: '[1,2]' },
    { input: '[1,2,3,4,5]\n5',            output: '[1,4]' },
    { input: '[1,2,3,4,5]\n9',            output: '[4,5]' },
    { input: '[1,2,3,4,5]\n7',            output: '[2,5]' },
    { input: '[1,2,3,4,5]\n6',            output: '[1,5]' },
    // boundary: first + last
    { input: '[1,2,3,4,5,6,7,8,9,10]\n11', output: '[1,10]' },
    { input: '[1,2,3,4,5,6,7,8,9,10]\n3',  output: '[1,2]'  },
    { input: '[1,2,3,4,5,6,7,8,9,10]\n19', output: '[9,10]' },
    // longer arrays
    { input: '[2,4,6,8,10,12,14,16,18,20]\n22', output: '[1,10]' },
    { input: '[2,4,6,8,10,12,14,16,18,20]\n34', output: '[7,9]'  },
    { input: '[2,4,6,8,10,12,14,16,18,20]\n30', output: '[7,8]'  },
    // stress
    { input: '[1,3,5,7,9,11,13,15,17,19]\n20', output: '[1,10]' },
    { input: '[1,3,5,7,9,11,13,15,17,19]\n12', output: '[1,6]'  },
    { input: '[1,3,5,7,9,11,13,15,17,19]\n36', output: '[9,10]' },
    { input: '[1,5,10,15,20]\n25',             output: '[3,4]'  },
    { input: '[1,5,10,15,20]\n30',             output: '[2,5]'  },
    { input: '[1,5,10,15,20]\n21',             output: '[1,5]'  },
    { input: '[1,5,10,15,20]\n35',             output: '[4,5]'  },
    { input: '[0,0]\n0',                        output: '[1,2]' },
    { input: '[0,1]\n1',                        output: '[1,2]' },
    { input: '[1,2,3,4,5,6,7,8,9,10,11,12]\n23',output: '[11,12]'},
    { input: '[1,2,3,4,5,6,7,8,9,10,11,12]\n3', output: '[1,2]' },
    { input: '[1,2,3,4,5,6,7,8,9,10,11,12]\n13',output: '[1,12]'},
  ],

  // -------------------------------------------------------------------------
  // 42. LETTER COMBINATIONS OF A PHONE NUMBER
  // Input:  digits (string)
  // Output: string[] sorted lexicographically
  // -------------------------------------------------------------------------
  'letter-combinations-of-a-phone-number': [
    // samples
    { input: '"23"',  output: '["ad","ae","af","bd","be","bf","cd","ce","cf"]' },
    { input: '""',    output: '[]' },
    { input: '"2"',   output: '["a","b","c"]' },
    // single digits
    { input: '"3"',   output: '["d","e","f"]'             },
    { input: '"4"',   output: '["g","h","i"]'             },
    { input: '"5"',   output: '["j","k","l"]'             },
    { input: '"6"',   output: '["m","n","o"]'             },
    { input: '"7"',   output: '["p","q","r","s"]'         },
    { input: '"8"',   output: '["t","u","v"]'             },
    { input: '"9"',   output: '["w","x","y","z"]'         },
    // two digits
    { input: '"24"',  output: '["ag","ah","ai","bg","bh","bi","cg","ch","ci"]' },
    { input: '"27"',  output: '["ap","aq","ar","as","bp","bq","br","bs","cp","cq","cr","cs"]' },
    { input: '"79"',  output: '["pw","px","py","pz","qw","qx","qy","qz","rw","rx","ry","rz","sw","sx","sy","sz"]' },
    // three digits
    { input: '"234"', output: '["adg","adh","adi","aeg","aeh","aei","afg","afh","afi","bdg","bdh","bdi","beg","beh","bei","bfg","bfh","bfi","cdg","cdh","cdi","ceg","ceh","cei","cfg","cfh","cfi"]' },
    // same digit repeated
    { input: '"22"',  output: '["aa","ab","ac","ba","bb","bc","ca","cb","cc"]' },
    { input: '"33"',  output: '["dd","de","df","ed","ee","ef","fd","fe","ff"]' },
    // digit 7 (4 letters)
    { input: '"77"',  output: '["pp","pq","pr","ps","qp","qq","qr","qs","rp","rq","rr","rs","sp","sq","sr","ss"]' },
    // mixed with 7
    { input: '"72"',  output: '["pa","pb","pc","qa","qb","qc","ra","rb","rc","sa","sb","sc"]' },
    // three with 9 (w x y z)
    { input: '"99"',  output: '["ww","wx","wy","wz","xw","xx","xy","xz","yw","yx","yy","yz","zw","zx","zy","zz"]' },
    // confirm length: "23" → 9, "234" → 27
    { input: '"234"', output: '["adg","adh","adi","aeg","aeh","aei","afg","afh","afi","bdg","bdh","bdi","beg","beh","bei","bfg","bfh","bfi","cdg","cdh","cdi","ceg","ceh","cei","cfg","cfh","cfi"]' },
    // four digits (2x2x2x2 = 16 combos)
    { input: '"2222"',output: '["aaaa","aaab","aaac","aaba","aabb","aabc","aaca","aacb","aacc","abaa","abab","abac","abba","abbb","abbc","abca","abcb","abcc","acaa","acab","acac","acba","acbb","acbc","acca","accb","accc","baaa","baab","baac","baba","babb","babc","baca","bacb","bacc","bbaa","bbab","bbac","bbba","bbbb","bbbc","bbca","bbcb","bbcc","bcaa","bcab","bcac","bcba","bcbb","bcbc","bcca","bccb","bccc","caaa","caab","caac","caba","cabb","cabc","caca","cacb","cacc","cbaa","cbab","cbac","cbba","cbbb","cbbc","cbca","cbcb","cbcc","ccaa","ccab","ccac","ccba","ccbb","ccbc","ccca","cccb","cccc"]' },
    // repeated checks
    { input: '"2"',   output: '["a","b","c"]' },
    { input: '"9"',   output: '["w","x","y","z"]' },
    { input: '"23"',  output: '["ad","ae","af","bd","be","bf","cd","ce","cf"]' },
    { input: '"32"',  output: '["da","db","dc","ea","eb","ec","fa","fb","fc"]' },
    { input: '"83"',  output: '["td","te","tf","ud","ue","uf","vd","ve","vf"]' },
    { input: '"38"',  output: '["dt","du","dv","et","eu","ev","ft","fu","fv"]' },
    { input: '"29"',  output: '["aw","ax","ay","az","bw","bx","by","bz","cw","cx","cy","cz"]' },
    { input: '"92"',  output: '["wa","wb","wc","xa","xb","xc","ya","yb","yc","za","zb","zc"]' },
    { input: '"44"',  output: '["gg","gh","gi","hg","hh","hi","ig","ih","ii"]' },
    { input: '"55"',  output: '["jj","jk","jl","kj","kk","kl","lj","lk","ll"]' },
    { input: '"66"',  output: '["mm","mn","mo","nm","nn","no","om","on","oo"]' },
    { input: '"88"',  output: '["tt","tu","tv","ut","uu","uv","vt","vu","vv"]' },
    { input: '"26"',  output: '["am","an","ao","bm","bn","bo","cm","cn","co"]' },
    { input: '"62"',  output: '["ma","mb","mc","na","nb","nc","oa","ob","oc"]' },
    { input: '"36"',  output: '["dm","dn","do","em","en","eo","fm","fn","fo"]' },
    { input: '"46"',  output: '["gm","gn","go","hm","hn","ho","im","in","io"]' },
  ],

  // -------------------------------------------------------------------------
  // 43. COMBINATION SUM
  // Input:  candidates (int[], distinct, sorted) \n target (int)
  // Output: int[][] sorted (each combo sorted, combos sorted lex)
  // -------------------------------------------------------------------------
  'combination-sum': [
    // samples
    { input: '[2,3,6,7]\n7',   output: '[[2,2,3],[7]]'               },
    { input: '[2,3,5]\n8',     output: '[[2,2,2,2],[2,3,3],[3,5]]'   },
    { input: '[2]\n1',         output: '[]'                           },
    // basic
    { input: '[1]\n1',         output: '[[1]]'                       },
    { input: '[1]\n2',         output: '[[1,1]]'                     },
    { input: '[1]\n3',         output: '[[1,1,1]]'                   },
    { input: '[2]\n2',         output: '[[2]]'                       },
    { input: '[2]\n4',         output: '[[2,2]]'                     },
    { input: '[2]\n6',         output: '[[2,2,2]]'                   },
    { input: '[3]\n3',         output: '[[3]]'                       },
    { input: '[3]\n5',         output: '[]'                          },
    { input: '[2,3]\n3',       output: '[[3]]'                       },
    { input: '[2,3]\n4',       output: '[[2,2]]'                     },
    { input: '[2,3]\n5',       output: '[[2,3]]'                     },
    { input: '[2,3]\n6',       output: '[[2,2,2],[3,3]]'             },
    { input: '[2,3]\n7',       output: '[[2,2,3]]'                   },
    // single candidate satisfies
    { input: '[7]\n7',         output: '[[7]]'                       },
    { input: '[7]\n14',        output: '[[7,7]]'                     },
    { input: '[7]\n6',         output: '[]'                          },
    // multiple combos
    { input: '[1,2,3]\n4',     output: '[[1,1,1,1],[1,1,2],[1,3],[2,2]]' },
    { input: '[1,2]\n4',       output: '[[1,1,1,1],[1,1,2],[2,2]]'   },
    { input: '[2,3,4,5]\n10',  output: '[[2,2,2,2,2],[2,2,3,3],[2,2,6],[2,3,5],[2,4,4],[3,3,4],[5,5]]' },
    // large target
    { input: '[2,3,5]\n10',    output: '[[2,2,2,2,2],[2,2,3,3],[2,3,5],[5,5]]' },
    { input: '[3,5,7]\n12',    output: '[[3,3,3,3],[3,4,5],[5,7]]'   },
    { input: '[3,5,7]\n15',    output: '[[3,3,3,3,3],[3,5,7],[5,5,5]]' },
    // small candidates
    { input: '[1,2,3,4,5]\n5', output: '[[1,1,1,1,1],[1,1,1,2],[1,1,3],[1,2,2],[1,4],[2,3],[5]]' },
    // stress single solution
    { input: '[2,7,6,3,5,4]\n7', output: '[[2,2,3],[3,4],[7]]'        },
    { input: '[1]\n5',           output: '[[1,1,1,1,1]]'              },
    // target unreachable
    { input: '[5,10,15]\n3',     output: '[]'                         },
    { input: '[6,9,12]\n4',      output: '[]'                         },
    // zero combos vs one combo
    { input: '[2,4,6,8]\n5',     output: '[]'                         },
    { input: '[2,4,6,8]\n4',     output: '[[2,2],[4]]'                },
    { input: '[2,4,6,8]\n6',     output: '[[2,2,2],[2,4],[6]]'        },
    // longer candidates
    { input: '[2,3,5,7,11,13]\n7', output: '[[2,2,3],[7]]'            },
    { input: '[2,3,5,7,11,13]\n13',output: '[[2,2,2,2,2,3],[2,2,2,3,4],[2,2,2,7],[2,2,3,6],[2,2,9],[2,3,3,5],[2,3,8],[2,4,7],[2,5,6],[2,11],[3,3,7],[3,4,6],[3,10],[4,9],[5,8],[6,7],[13]]' },
    // stress
    { input: '[2,3,6,7]\n3',       output: '[[3]]'            },
    { input: '[2,3,6,7]\n6',       output: '[[2,2,2],[3,3],[6]]' },
    { input: '[2,3,6,7]\n14',      output: '[[2,2,2,2,2,2,2],[2,2,2,2,6],[2,2,2,8],[2,2,3,7],[2,2,4,4],[2,3,3,6],[2,5,7],[3,3,3,5],[3,4,7],[3,5,6],[6,8],[7,7]]' },
    { input: '[2,3,7]\n7',         output: '[[2,2,3],[7]]'     },
    { input: '[8,7,4,3]\n11',       output: '[[3,4,4],[3,8],[4,7]]' },
    { input: '[2,5,3,1]\n8',        output: '[[1,1,1,1,1,1,1,1],[1,1,1,1,1,3],[1,1,1,1,2,2],[1,1,1,2,3],[1,1,1,5],[1,1,2,2,2],[1,1,3,3],[1,2,2,3],[1,2,5],[1,3,4],[2,2,2,2],[2,3,3],[3,5]]' },
    { input: '[3,5,7,9]\n12',       output: '[[3,3,3,3],[3,9],[5,7]]' },
    { input: '[3,5,7,9]\n9',        output: '[[3,3,3],[9]]'    },
  ],

  // -------------------------------------------------------------------------
  // 44. NUMBER OF ISLANDS
  // Input:  grid (string[][], "1" = land, "0" = water)
  // Output: number of islands (int)
  // -------------------------------------------------------------------------
  'number-of-islands': [
    // samples
    { input: '[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]',
      output: '1' },
    { input: '[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]',
      output: '3' },
    // basic
    { input: '[["1"]]',             output: '1' },
    { input: '[["0"]]',             output: '0' },
    { input: '[["1","0"],["0","1"]]', output: '2' },
    { input: '[["1","1"],["1","1"]]', output: '1' },
    { input: '[["0","0"],["0","0"]]', output: '0' },
    { input: '[["1","0"],["0","0"]]', output: '1' },
    { input: '[["0","1"],["0","0"]]', output: '1' },
    // single row
    { input: '[["1","1","1","1","1"]]', output: '1' },
    { input: '[["1","0","1","0","1"]]', output: '3' },
    { input: '[["0","0","0"]]',         output: '0' },
    { input: '[["1","0","0"]]',         output: '1' },
    // single col
    { input: '[["1"],["1"],["1"]]',     output: '1' },
    { input: '[["1"],["0"],["1"]]',     output: '2' },
    { input: '[["0"],["0"],["0"]]',     output: '0' },
    // 3x3
    { input: '[["1","0","1"],["0","0","0"],["1","0","1"]]', output: '4' },
    { input: '[["1","1","1"],["0","0","0"],["1","1","1"]]', output: '2' },
    { input: '[["1","1","1"],["1","0","1"],["1","1","1"]]', output: '1' },
    { input: '[["0","0","0"],["0","0","0"],["0","0","0"]]', output: '0' },
    { input: '[["1","1","1"],["1","1","1"],["1","1","1"]]', output: '1' },
    // diagonal (not connected by 4 dirs)
    { input: '[["1","0","0"],["0","1","0"],["0","0","1"]]', output: '3' },
    { input: '[["0","1","0"],["1","0","1"],["0","1","0"]]', output: '4' },
    // 4x4
    { input: '[["1","0","0","0"],["0","1","0","0"],["0","0","1","0"],["0","0","0","1"]]', output: '4' },
    { input: '[["1","1","0","0"],["1","1","0","0"],["0","0","1","1"],["0","0","1","1"]]', output: '2' },
    // 5x5 all land
    { input: '[["1","1","1","1","1"],["1","1","1","1","1"],["1","1","1","1","1"],["1","1","1","1","1"],["1","1","1","1","1"]]', output: '1' },
    // 5x5 checkerboard
    { input: '[["1","0","1","0","1"],["0","1","0","1","0"],["1","0","1","0","1"],["0","1","0","1","0"],["1","0","1","0","1"]]', output: '13' },
    // L-shaped island
    { input: '[["1","0","0"],["1","0","0"],["1","1","1"]]', output: '1' },
    // T-shaped island
    { input: '[["1","1","1"],["0","1","0"],["0","1","0"]]', output: '1' },
    // two separate islands
    { input: '[["1","1","0","1","1"],["1","1","0","1","1"],["0","0","0","0","0"]]', output: '2' },
    // border island
    { input: '[["1","0","0","0","1"],["0","0","0","0","0"],["0","0","0","0","0"],["1","0","0","0","1"]]', output: '4' },
    // complex
    { input: '[["1","1","0","0","0"],["0","1","0","0","1"],["1","0","0","1","1"],["0","0","0","0","0"],["1","0","1","0","1"]]', output: '6' },
    // long bridge
    { input: '[["1","1","1","1","1","1","1"]]', output: '1' },
    { input: '[["1","0","1","0","1","0","1"]]', output: '4' },
    // water border
    { input: '[["0","0","0"],["0","1","0"],["0","0","0"]]', output: '1' },
    // stress 4x5
    { input: '[["1","0","1","0","1"],["0","0","0","0","0"],["0","1","0","1","0"],["0","0","0","0","0"]]', output: '5' },
    // snake island
    { input: '[["1","1","1"],["0","0","1"],["1","1","1"]]', output: '1' },
    { input: '[["1","0","1"],["1","0","1"],["1","1","1"]]', output: '1' },
    // ring — inside is water but outer is all land
    { input: '[["1","1","1","1","1"],["1","0","0","0","1"],["1","0","0","0","1"],["1","0","0","0","1"],["1","1","1","1","1"]]', output: '1' },
    { input: '[["0","1","0"],["1","1","1"],["0","1","0"]]', output: '1' },
  ],

  // -------------------------------------------------------------------------
  // 45. MAX AREA OF ISLAND
  // Input:  grid (int[][], 1=land, 0=water)
  // Output: max area (int)
  // -------------------------------------------------------------------------
  'max-area-of-island': [
    // samples
    { input: '[[0,0,1,0,0,0,0,1,0,0,0,0,0],[0,0,0,0,0,0,0,1,1,1,0,0,0],[0,1,1,0,1,0,0,0,0,0,0,0,0],[0,1,0,0,1,1,0,0,1,0,1,0,0],[0,1,0,0,1,1,0,0,1,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,1,0,0],[0,0,0,0,0,0,0,1,1,1,0,0,0],[0,0,0,0,0,0,0,1,1,0,0,0,0]]',
      output: '6' },
    { input: '[[0,0,0,0,0,0,0,0]]', output: '0' },
    // basic
    { input: '[[1]]',                output: '1' },
    { input: '[[0]]',                output: '0' },
    { input: '[[1,0],[0,1]]',        output: '1' },
    { input: '[[1,1],[1,1]]',        output: '4' },
    { input: '[[1,1],[1,0]]',        output: '3' },
    { input: '[[1,0],[1,1]]',        output: '3' },
    { input: '[[0,1],[1,1]]',        output: '3' },
    // single row
    { input: '[[1,1,1,1,1]]',        output: '5' },
    { input: '[[1,0,1,0,1]]',        output: '1' },
    { input: '[[1,1,0,1,1]]',        output: '2' },
    // single col
    { input: '[[1],[1],[1],[1]]',     output: '4' },
    { input: '[[1],[0],[1]]',         output: '1' },
    // two islands pick larger
    { input: '[[1,1,0,1],[1,1,0,1],[0,0,0,1]]', output: '4' },
    { input: '[[1,1,1,0],[0,0,0,1],[0,0,0,1]]', output: '3' },
    // 3x3
    { input: '[[1,0,1],[0,0,0],[1,0,1]]', output: '1' },
    { input: '[[1,1,1],[0,0,0],[1,1,1]]', output: '3' },
    { input: '[[1,1,1],[1,0,1],[1,1,1]]', output: '8' },
    { input: '[[0,0,0],[0,1,0],[0,0,0]]', output: '1' },
    // all zeros
    { input: '[[0,0,0],[0,0,0],[0,0,0]]', output: '0' },
    { input: '[[0,0],[0,0]]',             output: '0' },
    // all ones
    { input: '[[1,1,1],[1,1,1],[1,1,1]]', output: '9' },
    // diagonal not connected
    { input: '[[1,0,0],[0,1,0],[0,0,1]]', output: '1' },
    // L-shape
    { input: '[[1,0],[1,0],[1,1]]', output: '4' },
    // large island
    { input: '[[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1]]', output: '15' },
    // island with hole (doesn't matter)
    { input: '[[1,1,1,1,1],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,1]]', output: '12' },
    // 4x4 two islands
    { input: '[[1,1,0,0],[1,1,0,0],[0,0,1,1],[0,0,1,1]]', output: '4' },
    // checkerboard
    { input: '[[1,0,1,0],[0,1,0,1],[1,0,1,0]]', output: '1' },
    // various shapes
    { input: '[[0,1,1,0],[1,1,0,0],[0,1,0,0]]', output: '5' },
    { input: '[[1,0,0,1],[0,1,1,0],[0,1,0,0]]', output: '3' },
    { input: '[[1,1,0,1,1],[1,0,0,0,1],[1,1,0,1,1]]', output: '5' },
    // single land in corner
    { input: '[[1,0,0],[0,0,0],[0,0,0]]', output: '1' },
    { input: '[[0,0,1],[0,0,0],[0,0,0]]', output: '1' },
    { input: '[[0,0,0],[0,0,0],[1,0,0]]', output: '1' },
    { input: '[[0,0,0],[0,0,0],[0,0,1]]', output: '1' },
    // stress
    { input: '[[1,1,0,0,0],[1,1,0,0,0],[0,0,0,1,1],[0,0,0,1,1]]', output: '4' },
    { input: '[[1,0,0,0,0],[1,1,0,0,0],[1,1,1,0,0],[0,0,0,0,0]]', output: '6' },
    { input: '[[0,0,0,0,0],[0,1,1,0,0],[0,1,1,0,0],[0,0,0,0,0]]', output: '4' },
    { input: '[[0,1,0],[1,1,1],[0,1,0]]', output: '5' },
    { input: '[[1,1,0,0,1],[0,1,1,0,1],[0,0,0,1,1]]', output: '4' },
    { input: '[[0,0,0,0,0,0,0,0],[0,1,1,0,0,1,1,0],[0,1,1,0,0,1,1,0],[0,0,0,0,0,0,0,0]]', output: '4' },
  ],

  // -------------------------------------------------------------------------
  // 46. WORD SEARCH
  // Input:  board (char[][]) \n word (string)
  // Output: boolean
  // -------------------------------------------------------------------------
  'word-search': [
    // samples
    { input: '[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]\n"ABCCED"', output: 'true'  },
    { input: '[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]\n"SEE"',    output: 'true'  },
    { input: '[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]\n"ABCB"',  output: 'false' },
    // single cell
    { input: '[["A"]]\n"A"',  output: 'true'  },
    { input: '[["A"]]\n"B"',  output: 'false' },
    { input: '[["A"]]\n"AA"', output: 'false' },
    // 1x1 board
    { input: '[["Z"]]\n"Z"',  output: 'true'  },
    { input: '[["Z"]]\n"ZZ"', output: 'false' },
    // 1-row board
    { input: '[["A","B","C"]]\n"ABC"', output: 'true'  },
    { input: '[["A","B","C"]]\n"ACB"', output: 'false' },
    { input: '[["A","B","C"]]\n"CBA"', output: 'true'  },
    { input: '[["A","B","C"]]\n"BC"',  output: 'true'  },
    // 1-col board
    { input: '[["A"],["B"],["C"]]\n"ABC"', output: 'true'  },
    { input: '[["A"],["B"],["C"]]\n"ACB"', output: 'false' },
    { input: '[["A"],["B"],["C"]]\n"CBA"', output: 'true'  },
    // 2x2 board
    { input: '[["A","B"],["C","D"]]\n"ABDC"', output: 'true'  },
    { input: '[["A","B"],["C","D"]]\n"ABCD"', output: 'false' },
    { input: '[["A","B"],["C","D"]]\n"DCBA"', output: 'true'  },
    { input: '[["A","B"],["C","D"]]\n"AD"',   output: 'false' },
    { input: '[["A","B"],["C","D"]]\n"AC"',   output: 'true'  },
    // longer words
    { input: '[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]\n"ABCCED"', output: 'true'  },
    { input: '[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]\n"SFCS"',   output: 'true'  },
    { input: '[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]\n"SADES"',  output: 'false' },
    // word longer than board
    { input: '[["A","B"],["C","D"]]\n"ABCDA"', output: 'false' },
    // cannot reuse cells
    { input: '[["A","A","A"],["A","A","A"],["A","A","A"]]\n"AAAAAAAAAA"', output: 'false' },
    { input: '[["A","A","A"],["A","A","A"],["A","A","A"]]\n"AAAAAAAAA"',  output: 'true'  },
    // snake path
    { input: '[["A","B","C"],["D","E","F"],["G","H","I"]]\n"ABEHI"', output: 'true'  },
    { input: '[["A","B","C"],["D","E","F"],["G","H","I"]]\n"ABEDC"', output: 'false' },
    // must go specific direction
    { input: '[["C","A","A"],["A","A","A"],["B","C","D"]]\n"AAB"', output: 'true'  },
    // not found because backtrack needed
    { input: '[["A","B"],["C","D"]]\n"ADCB"', output: 'false' },
    { input: '[["A","B"],["C","D"]]\n"CDBA"', output: 'false' },
    // 3x3 
    { input: '[["A","B","C"],["D","E","F"],["G","H","I"]]\n"DEF"',  output: 'true'  },
    { input: '[["A","B","C"],["D","E","F"],["G","H","I"]]\n"CEF"',  output: 'true'  },
    { input: '[["A","B","C"],["D","E","F"],["G","H","I"]]\n"EHI"',  output: 'true'  },
    { input: '[["A","B","C"],["D","E","F"],["G","H","I"]]\n"EDA"',  output: 'true'  },
    { input: '[["A","B","C"],["D","E","F"],["G","H","I"]]\n"IHG"',  output: 'true'  },
    { input: '[["A","B","C"],["D","E","F"],["G","H","I"]]\n"AGD"',  output: 'false' },
    { input: '[["A","B","C"],["D","E","F"],["G","H","I"]]\n"AEI"',  output: 'false' },
    // spiral / all cells
    { input: '[["A","B","C"],["D","E","F"],["G","H","I"]]\n"ABCFIHGDE"', output: 'true'  },
    { input: '[["A","B","C"],["D","E","F"],["G","H","I"]]\n"ABCFIEDGH"', output: 'false' },
    // same letter board
    { input: '[["A","A","A"],["A","A","A"]]\n"AAAA"', output: 'true'  },
    { input: '[["A","A","A"],["A","A","A"]]\n"AAAAAAA"', output: 'false' },
    // words not present at all
    { input: '[["A","B"],["C","D"]]\n"X"',   output: 'false' },
    { input: '[["A","B"],["C","D"]]\n"XY"',  output: 'false' },
    // start from multiple positions
    { input: '[["A","B","A"],["A","A","A"]]\n"AA"',  output: 'true'  },
    { input: '[["A","B","A"],["A","A","A"]]\n"ABA"', output: 'true'  },
    // stress
    { input: '[["F","Y","C","E","N","R","D"],["K","L","N","F","I","N","U"],["A","A","A","E","L","A","O"],["V","C","E","L","M","G","N"]]' +
              '\n"FLNAIL"', output: 'false' },
    { input: '[["A","B","C","E"],["S","F","E","S"],["A","D","E","E"]]\n"ABCESEEDAS"', output: 'false' },
    { input: '[["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]]\n"eat"', output: 'true'  },
    { input: '[["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]]\n"oath"', output: 'true'  },
    { input: '[["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]]\n"peak"', output: 'false' },
    { input: '[["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]]\n"naif"', output: 'false' },
  ],

  // -------------------------------------------------------------------------
  // 47. CLONE GRAPH
  // Input:  adjList (int[][]) — 1-indexed; adjList[i] = neighbors of node i+1
  // Output: adjList (int[][]) — same structure
  // -------------------------------------------------------------------------
  'clone-graph': [
    // samples
    { input: '[[2,4],[1,3],[2,4],[1,3]]', output: '[[2,4],[1,3],[2,4],[1,3]]' },
    { input: '[[]]',                      output: '[[]]'                       },
    { input: '[]',                        output: '[]'                         },
    { input: '[[2],[1]]',                 output: '[[2],[1]]'                  },
    // basic
    { input: '[[2],[1,3],[2]]',           output: '[[2],[1,3],[2]]'            },
    { input: '[[2,3],[1,3],[1,2]]',       output: '[[2,3],[1,3],[1,2]]'        },
    // single node
    { input: '[[]]',                      output: '[[]]'                       },
    // disconnected (only one node passed)
    { input: '[]',                        output: '[]'                         },
    // linear chain
    { input: '[[2],[1,3],[2,4],[3]]',     output: '[[2],[1,3],[2,4],[3]]'      },
    { input: '[[2],[1,3],[2,4],[3,5],[4]]',output:'[[2],[1,3],[2,4],[3,5],[4]]'},
    // star topology  (center=1 connects to 2,3,4,5)
    { input: '[[2,3,4,5],[1],[1],[1],[1]]',output:'[[2,3,4,5],[1],[1],[1],[1]]'},
    // complete graph K4
    { input: '[[2,3,4],[1,3,4],[1,2,4],[1,2,3]]',
      output: '[[2,3,4],[1,3,4],[1,2,4],[1,2,3]]' },
    // cycle 4
    { input: '[[2,4],[1,3],[2,4],[1,3]]', output: '[[2,4],[1,3],[2,4],[1,3]]' },
    // path of 5
    { input: '[[2],[1,3],[2,4],[3,5],[4]]',output:'[[2],[1,3],[2,4],[3,5],[4]]'},
    // cycle of 3
    { input: '[[2,3],[1,3],[1,2]]',       output: '[[2,3],[1,3],[1,2]]'       },
    // cycle of 5
    { input: '[[2,5],[1,3],[2,4],[3,5],[4,1]]',
      output: '[[2,5],[1,3],[2,4],[3,5],[1,4]]' },
    // stress
    { input: '[[2,3,4],[1,3,4],[1,2,4],[1,2,3]]',
      output: '[[2,3,4],[1,3,4],[1,2,4],[1,2,3]]' },
    // two-node bidirectional repeated checks
    { input: '[[2],[1]]', output: '[[2],[1]]' },
    { input: '[[2],[1]]', output: '[[2],[1]]' },
    { input: '[[2],[1]]', output: '[[2],[1]]' },
    { input: '[[2,4],[1,3],[2,4],[1,3]]', output: '[[2,4],[1,3],[2,4],[1,3]]' },
    { input: '[[2,4],[1,3],[2,4],[1,3]]', output: '[[2,4],[1,3],[2,4],[1,3]]' },
    // K3 repeated
    { input: '[[2,3],[1,3],[1,2]]', output: '[[2,3],[1,3],[1,2]]' },
    { input: '[[2,3],[1,3],[1,2]]', output: '[[2,3],[1,3],[1,2]]' },
    { input: '[[2,3],[1,3],[1,2]]', output: '[[2,3],[1,3],[1,2]]' },
    // linear 6
    { input: '[[2],[1,3],[2,4],[3,5],[4,6],[5]]',
      output: '[[2],[1,3],[2,4],[3,5],[4,6],[5]]' },
    // wheel graph: node 1 center, 2-5 rim
    { input: '[[2,3,4,5],[1,3,5],[1,2,4],[1,3,5],[1,2,4]]',
      output: '[[2,3,4,5],[1,3,5],[1,2,4],[1,3,5],[1,2,4]]' },
    // repeated clones should produce same structure
    { input: '[[2,3,4],[1,3,4],[1,2,4],[1,2,3]]',
      output: '[[2,3,4],[1,3,4],[1,2,4],[1,2,3]]' },
    { input: '[[2,3,4],[1,3,4],[1,2,4],[1,2,3]]',
      output: '[[2,3,4],[1,3,4],[1,2,4],[1,2,3]]' },
    // straight line reversed
    { input: '[[2],[1,3],[2,4],[3,5],[4]]', output: '[[2],[1,3],[2,4],[3,5],[4]]' },
    // empty / null
    { input: '[]', output: '[]' },
    { input: '[]', output: '[]' },
    // 5-cycle
    { input: '[[2,5],[1,3],[2,4],[3,5],[4,1]]',
      output: '[[2,5],[1,3],[2,4],[3,5],[1,4]]' },
    // mixed
    { input: '[[2,3],[1],[1]]',  output: '[[2,3],[1],[1]]'  },
    { input: '[[2],[1,3],[2]]',  output: '[[2],[1,3],[2]]'  },
    // star 6
    { input: '[[2,3,4,5,6],[1],[1],[1],[1],[1]]',
      output: '[[2,3,4,5,6],[1],[1],[1],[1],[1]]' },
    // K5
    { input: '[[2,3,4,5],[1,3,4,5],[1,2,4,5],[1,2,3,5],[1,2,3,4]]',
      output: '[[2,3,4,5],[1,3,4,5],[1,2,4,5],[1,2,3,5],[1,2,3,4]]' },
    // path + shortcut
    { input: '[[2,3],[1,3,4],[1,2],[2,5],[4]]',
      output: '[[2,3],[1,3,4],[1,2],[2,5],[4]]' },
    { input: '[[2],[1,3,4],[2,4],[2,3]]',
      output: '[[2],[1,3,4],[2,4],[2,3]]' },
    { input: '[[2,4],[1,3],[2,4],[1,3]]', output: '[[2,4],[1,3],[2,4],[1,3]]' },
    { input: '[[]]',  output: '[[]]' },
    { input: '[[2],[1]]', output: '[[2],[1]]' },
  ],

  // -------------------------------------------------------------------------
  // 48. PACIFIC ATLANTIC WATER FLOW
  // Input:  heights (int[][])
  // Output: [row,col][] sorted by row then col
  // -------------------------------------------------------------------------
  'pacific-atlantic-water-flow': [
    // samples
    { input: '[[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]',
      output: '[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]' },
    { input: '[[1]]',            output: '[[0,0]]'         },
    { input: '[[1,1],[1,1]]',    output: '[[0,0],[0,1],[1,0],[1,1]]' },
    // basic 1x1
    { input: '[[10]]',           output: '[[0,0]]'         },
    // 1x2
    { input: '[[1,2]]',          output: '[[0,1]]'         },
    { input: '[[2,1]]',          output: '[[0,0]]'         },
    { input: '[[1,1]]',          output: '[[0,0],[0,1]]'   },
    // 2x1
    { input: '[[1],[2]]',        output: '[[1,0]]'         },
    { input: '[[2],[1]]',        output: '[[0,0]]'         },
    { input: '[[1],[1]]',        output: '[[0,0],[1,0]]'   },
    // 2x2
    { input: '[[1,2],[3,4]]',    output: '[[0,1],[1,0],[1,1]]' },
    { input: '[[4,3],[2,1]]',    output: '[[0,0],[0,1],[1,0]]' },
    { input: '[[2,2],[2,2]]',    output: '[[0,0],[0,1],[1,0],[1,1]]' },
    { input: '[[1,3],[2,4]]',    output: '[[0,1],[1,1]]'   },
    // all same height → all cells flow to both
    { input: '[[5,5,5],[5,5,5],[5,5,5]]',
      output: '[[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2]]' },
    // peak in middle
    { input: '[[1,2,1],[2,5,2],[1,2,1]]',
      output: '[[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2]]' },
    // descending rows
    { input: '[[3,2,1],[2,1,0],[1,0,0]]',
      output: '[[0,0],[0,1],[0,2],[1,0],[2,0]]' },
    // ascending rows
    { input: '[[1,2,3],[2,3,4],[3,4,5]]',
      output: '[[0,2],[1,1],[1,2],[2,0],[2,1],[2,2]]' },
    // 1-row
    { input: '[[1,2,3,4,5]]',    output: '[[0,4]]'                          },
    { input: '[[5,4,3,2,1]]',    output: '[[0,0]]'                          },
    { input: '[[3,3,3,3,3]]',    output: '[[0,0],[0,1],[0,2],[0,3],[0,4]]'  },
    // 1-col
    { input: '[[1],[2],[3],[4],[5]]', output: '[[4,0]]'                      },
    { input: '[[5],[4],[3],[2],[1]]', output: '[[0,0]]'                      },
    // 3x3 staircase
    { input: '[[1,2,3],[4,5,6],[7,8,9]]',
      output: '[[0,2],[1,2],[2,0],[2,1],[2,2]]' },
    { input: '[[9,8,7],[6,5,4],[3,2,1]]',
      output: '[[0,0],[0,1],[0,2],[1,0],[2,0]]' },
    // plateau border
    { input: '[[10,10,10],[10,1,10],[10,10,10]]',
      output: '[[0,0],[0,1],[0,2],[1,0],[1,2],[2,0],[2,1],[2,2]]' },
    // all zeros
    { input: '[[0,0,0],[0,0,0],[0,0,0]]',
      output: '[[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2]]' },
    // 2x3
    { input: '[[1,2,3],[4,5,6]]',
      output: '[[0,2],[1,0],[1,1],[1,2]]' },
    { input: '[[6,5,4],[3,2,1]]',
      output: '[[0,0],[0,1],[0,2],[1,0]]' },
    // classic NeetCode example variant
    { input: '[[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]',
      output: '[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]' },
    // stress
    { input: '[[2,1,3],[4,5,2],[1,3,4]]',
      output: '[[0,2],[1,1],[1,2],[2,2]]' },
    { input: '[[1,3,1],[3,5,3],[1,3,1]]',
      output: '[[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2]]' },
    { input: '[[3,1],[1,3]]',
      output: '[[0,0],[0,1],[1,0],[1,1]]' },
    { input: '[[1,2,3],[0,0,4],[3,2,1]]',
      output: '[[0,2],[1,2],[2,0],[2,1],[2,2]]' },
    { input: '[[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]',
      output: '[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]' },
    { input: '[[3,3,3,3,3],[3,3,3,3,3],[3,3,3,3,3]]',
      output: '[[0,0],[0,1],[0,2],[0,3],[0,4],[1,0],[1,1],[1,2],[1,3],[1,4],[2,0],[2,1],[2,2],[2,3],[2,4]]' },
    // edge same height borders
    { input: '[[2,2],[2,2]]',
      output: '[[0,0],[0,1],[1,0],[1,1]]' },
    { input: '[[1,1],[1,1]]',
      output: '[[0,0],[0,1],[1,0],[1,1]]' },
    // all corners reachable
    { input: '[[1,2,3],[8,9,4],[7,6,5]]',
      output: '[[0,2],[1,0],[1,1],[1,2],[2,0]]' },
    { input: '[[5,6,7],[4,9,8],[3,2,1]]',
      output: '[[0,0],[0,1],[0,2],[1,0],[1,1],[2,0]]' },
  ],

  // -------------------------------------------------------------------------
  // 49. SURROUNDED REGIONS
  // Input:  board (string[][]) — "X" or "O"
  // Output: modified board string[][]
  // -------------------------------------------------------------------------
  'surrounded-regions': [
    // samples
    { input: '[["X","X","X","X"],["X","O","O","X"],["X","X","O","X"],["X","O","X","X"]]',
      output: '[["X","X","X","X"],["X","X","X","X"],["X","X","X","X"],["X","O","X","X"]]' },
    { input: '[["X"]]', output: '[["X"]]' },
    // basic
    { input: '[["O"]]', output: '[["O"]]' },
    { input: '[["O","O"],["O","O"]]', output: '[["O","O"],["O","O"]]' },
    { input: '[["X","X"],["X","X"]]', output: '[["X","X"],["X","X"]]' },
    { input: '[["X","O"],["X","X"]]', output: '[["X","O"],["X","X"]]' },
    { input: '[["X","X"],["O","X"]]', output: '[["X","X"],["O","X"]]' },
    { input: '[["X","X"],["X","O"]]', output: '[["X","X"],["X","O"]]' },
    { input: '[["O","X"],["X","X"]]', output: '[["O","X"],["X","X"]]' },
    // surrounded O
    { input: '[["X","X","X"],["X","O","X"],["X","X","X"]]',
      output: '[["X","X","X"],["X","X","X"],["X","X","X"]]' },
    // border O preserved
    { input: '[["O","X","X"],["X","O","X"],["X","X","O"]]',
      output: '[["O","X","X"],["X","X","X"],["X","X","O"]]' },
    // connected to border
    { input: '[["X","X","X","X"],["X","O","O","X"],["X","O","X","X"],["X","X","X","X"]]',
      output: '[["X","X","X","X"],["X","X","X","X"],["X","X","X","X"],["X","X","X","X"]]' },
    // O on border preserved
    { input: '[["O","X","O"],["X","O","X"],["O","X","O"]]',
      output: '[["O","X","O"],["X","X","X"],["O","X","O"]]' },
    // large all X
    { input: '[["X","X","X","X","X"],["X","X","X","X","X"],["X","X","X","X","X"]]',
      output: '[["X","X","X","X","X"],["X","X","X","X","X"],["X","X","X","X","X"]]' },
    // large all O
    { input: '[["O","O","O","O"],["O","O","O","O"],["O","O","O","O"]]',
      output: '[["O","O","O","O"],["O","O","O","O"],["O","O","O","O"]]' },
    // O island in center 5x5
    { input: '[["X","X","X","X","X"],["X","O","O","O","X"],["X","O","X","O","X"],["X","O","O","O","X"],["X","X","X","X","X"]]',
      output: '[["X","X","X","X","X"],["X","X","X","X","X"],["X","X","X","X","X"],["X","X","X","X","X"],["X","X","X","X","X"]]' },
    // O connected to border through chain
    { input: '[["X","O","X"],["O","O","X"],["X","X","X"]]',
      output: '[["X","O","X"],["O","O","X"],["X","X","X"]]' },
    // mixed
    { input: '[["X","X","X","X"],["X","O","X","X"],["X","O","O","X"],["X","O","X","X"],["X","X","X","X"]]',
      output: '[["X","X","X","X"],["X","X","X","X"],["X","X","X","X"],["X","X","X","X"],["X","X","X","X"]]' },
    // connected to border
    { input: '[["X","X","X","X"],["O","O","O","X"],["X","X","X","X"]]',
      output: '[["X","X","X","X"],["O","O","O","X"],["X","X","X","X"]]' },
    { input: '[["X","X","X","X"],["X","O","O","O"],["X","X","X","X"]]',
      output: '[["X","X","X","X"],["X","O","O","O"],["X","X","X","X"]]' },
    // single row
    { input: '[["X","O","X","O","X"]]', output: '[["X","O","X","O","X"]]' },
    { input: '[["O","O","O","O","O"]]', output: '[["O","O","O","O","O"]]' },
    { input: '[["X","X","X","X","X"]]', output: '[["X","X","X","X","X"]]' },
    // single col
    { input: '[["X"],["O"],["X"],["O"],["X"]]',
      output: '[["X"],["O"],["X"],["O"],["X"]]' },
    // stress
    { input: '[["X","X","X","X"],["X","O","O","X"],["X","X","O","X"],["X","O","X","X"]]',
      output: '[["X","X","X","X"],["X","X","X","X"],["X","X","X","X"],["X","O","X","X"]]' },
    { input: '[["O","X","X","O","X"],["X","O","O","X","O"],["X","O","X","O","X"],["O","X","O","O","O"],["X","X","O","X","O"]]',
      output: '[["O","X","X","O","X"],["X","X","X","X","O"],["X","X","X","O","X"],["O","X","O","O","O"],["X","X","O","X","O"]]' },
    // only border cells
    { input: '[["O","O","O"],["O","O","O"],["O","O","O"]]',
      output: '[["O","O","O"],["O","O","O"],["O","O","O"]]' },
    { input: '[["O","O","O"],["O","X","O"],["O","O","O"]]',
      output: '[["O","O","O"],["O","X","O"],["O","O","O"]]' },
    // 2x4
    { input: '[["X","O","X","O"],["O","X","O","X"]]',
      output: '[["X","O","X","O"],["O","X","O","X"]]' },
    // 4x2
    { input: '[["X","O"],["O","X"],["X","O"],["O","X"]]',
      output: '[["X","O"],["O","X"],["X","O"],["O","X"]]' },
  ],

  // -------------------------------------------------------------------------
  // 50. ROTTING ORANGES
  // Input:  grid (int[][], 0=empty, 1=fresh, 2=rotten)
  // Output: minutes until all fresh rot (-1 if impossible)
  // -------------------------------------------------------------------------
  'rotting-oranges': [
    // samples
    { input: '[[2,1,1],[1,1,0],[0,1,1]]', output: '4'  },
    { input: '[[2,1,1],[0,1,1],[1,0,1]]', output: '-1' },
    { input: '[[0,2]]',                   output: '0'  },
    // basic
    { input: '[[0]]',                     output: '0'  },
    { input: '[[1]]',                     output: '-1' },
    { input: '[[2]]',                     output: '0'  },
    { input: '[[1,2]]',                   output: '1'  },
    { input: '[[2,1]]',                   output: '1'  },
    { input: '[[2,2]]',                   output: '0'  },
    { input: '[[1,1]]',                   output: '-1' },
    { input: '[[0,0]]',                   output: '0'  },
    // 2x2
    { input: '[[2,1],[1,1]]',             output: '2'  },
    { input: '[[1,1],[1,2]]',             output: '2'  },
    { input: '[[2,2],[2,2]]',             output: '0'  },
    { input: '[[1,1],[1,1]]',             output: '-1' },
    { input: '[[0,0],[0,0]]',             output: '0'  },
    { input: '[[2,0],[0,1]]',             output: '-1' },
    { input: '[[0,2],[1,0]]',             output: '-1' },
    { input: '[[2,1],[0,0]]',             output: '1'  },
    // 3x3
    { input: '[[2,1,1],[1,1,1],[1,1,2]]', output: '2'  },
    { input: '[[2,0,0],[0,0,0],[0,0,1]]', output: '-1' },
    { input: '[[2,2,2],[2,1,2],[2,2,2]]', output: '1'  },
    { input: '[[0,0,0],[0,2,0],[0,0,0]]', output: '0'  },
    { input: '[[1,1,1],[1,2,1],[1,1,1]]', output: '2'  },
    { input: '[[1,0,1],[0,0,0],[1,0,1]]', output: '-1' },
    // spreading corner to corner
    { input: '[[2,1,1],[1,1,1],[1,1,1]]', output: '4'  },
    { input: '[[1,1,1],[1,1,1],[1,1,2]]', output: '4'  },
    // two rotten
    { input: '[[2,1,2],[1,1,1],[2,1,2]]', output: '2'  },
    { input: '[[2,1,0,1,2]]',             output: '1'  },
    { input: '[[2,0,0,0,2]]',             output: '0'  },
    { input: '[[2,1,1,1,2]]',             output: '2'  },
    // cannot reach island
    { input: '[[2,0,1],[0,0,0],[1,0,2]]', output: '-1' },
    { input: '[[0,2,0],[1,0,1],[0,2,0]]', output: '-1' },
    // diagonal not spread
    { input: '[[2,0],[0,1]]',             output: '-1' },
    { input: '[[0,1],[2,0]]',             output: '-1' },
    // all empty
    { input: '[[0,0,0],[0,0,0],[0,0,0]]', output: '0'  },
    // all rotten
    { input: '[[2,2,2],[2,2,2],[2,2,2]]', output: '0'  },
    // single row chain
    { input: '[[2,1,1,1,1,1]]',           output: '5'  },
    { input: '[[1,1,1,1,1,2]]',           output: '5'  },
    { input: '[[2,1,1,1,1,2]]',           output: '3'  },
    // single col chain
    { input: '[[2],[1],[1],[1],[1]]',      output: '4'  },
    { input: '[[1],[1],[1],[1],[2]]',      output: '4'  },
    // stress
    { input: '[[0,1,2],[0,1,1],[0,1,1]]', output: '2'  },
    { input: '[[2,1,1],[1,1,1],[0,0,2]]', output: '3'  },
    { input: '[[2,1,1],[1,1,0],[0,1,1]]', output: '4'  },
    { input: '[[1,2,1],[1,1,1],[1,2,1]]', output: '2'  },
    { input: '[[2,2,2,2],[1,1,1,1],[2,2,2,2]]', output: '1' },
    { input: '[[1,1,1,1],[1,1,1,1],[1,1,1,2]]', output: '6' },
    { input: '[[2,0,1,1],[0,0,1,1],[1,0,1,1],[1,0,1,2]]', output: '-1' },
    { input: '[[1,1,0,0,2],[1,1,0,0,1],[0,0,0,0,1],[2,1,1,1,1]]', output: '-1' },
  ],

  // -------------------------------------------------------------------------
  // 51. WALLS AND GATES
  // Input:  rooms (int[][], INF=2147483647, -1=wall, 0=gate)
  // Output: filled int[][]
  // -------------------------------------------------------------------------
  'walls-and-gates': [
    // samples
    { input: '[[2147483647,-1,0,2147483647],[2147483647,2147483647,2147483647,-1],[2147483647,-1,2147483647,-1],[0,-1,2147483647,2147483647]]',
      output: '[[3,-1,0,1],[2,2,1,-1],[1,-1,2,-1],[0,-1,3,4]]' },
    { input: '[[-1]]',            output: '[[-1]]'              },
    { input: '[[0]]',             output: '[[0]]'              },
    { input: '[[2147483647]]',    output: '[[2147483647]]'     },
    // basic
    { input: '[[0,2147483647]]',  output: '[[0,1]]'            },
    { input: '[[2147483647,0]]',  output: '[[1,0]]'            },
    { input: '[[0,0]]',           output: '[[0,0]]'            },
    { input: '[[-1,2147483647]]', output: '[[-1,2147483647]]'  },
    { input: '[[2147483647,-1]]', output: '[[2147483647,-1]]'  },
    // 2x2
    { input: '[[0,2147483647],[2147483647,2147483647]]',
      output: '[[0,1],[1,2]]'                                  },
    { input: '[[2147483647,2147483647],[2147483647,0]]',
      output: '[[2,1],[1,0]]'                                  },
    { input: '[[0,2147483647],[2147483647,0]]',
      output: '[[0,1],[1,0]]'                                  },
    { input: '[[-1,-1],[-1,-1]]', output: '[[-1,-1],[-1,-1]]'  },
    // single row
    { input: '[[0,2147483647,2147483647,2147483647,2147483647]]',
      output: '[[0,1,2,3,4]]'                                  },
    { input: '[[2147483647,2147483647,2147483647,2147483647,0]]',
      output: '[[4,3,2,1,0]]'                                  },
    { input: '[[0,2147483647,2147483647,2147483647,0]]',
      output: '[[0,1,2,1,0]]'                                  },
    { input: '[[0,-1,2147483647]]',
      output: '[[0,-1,2147483647]]'                            },
    { input: '[[2147483647,-1,0]]',
      output: '[[2147483647,-1,0]]'                            },
    // single col
    { input: '[[0],[2147483647],[2147483647],[2147483647]]',
      output: '[[0],[1],[2],[3]]'                              },
    { input: '[[2147483647],[2147483647],[2147483647],[0]]',
      output: '[[3],[2],[1],[0]]'                              },
    // blocked by wall
    { input: '[[0,-1,2147483647],[2147483647,-1,2147483647],[2147483647,-1,2147483647]]',
      output: '[[0,-1,2147483647],[1,-1,2147483647],[2,-1,2147483647]]'  },
    // two gates
    { input: '[[0,2147483647,2147483647,2147483647,0]]',
      output: '[[0,1,2,1,0]]'                                  },
    { input: '[[0],[2147483647],[0]]',
      output: '[[0],[1],[0]]'                                   },
    // no gate
    { input: '[[2147483647,2147483647],[2147483647,2147483647]]',
      output: '[[2147483647,2147483647],[2147483647,2147483647]]'        },
    // 3x3 center gate
    { input: '[[2147483647,2147483647,2147483647],[2147483647,0,2147483647],[2147483647,2147483647,2147483647]]',
      output: '[[2,1,2],[1,0,1],[2,1,2]]'                      },
    // 3x3 two gates
    { input: '[[0,2147483647,2147483647],[2147483647,2147483647,2147483647],[2147483647,2147483647,0]]',
      output: '[[0,1,2],[1,2,1],[2,1,0]]'                      },
    // stress 4x4 from sample
    { input: '[[2147483647,-1,0,2147483647],[2147483647,2147483647,2147483647,-1],[2147483647,-1,2147483647,-1],[0,-1,2147483647,2147483647]]',
      output: '[[3,-1,0,1],[2,2,1,-1],[1,-1,2,-1],[0,-1,3,4]]' },
    // repeated
    { input: '[[2147483647,-1,0,2147483647],[2147483647,2147483647,2147483647,-1],[2147483647,-1,2147483647,-1],[0,-1,2147483647,2147483647]]',
      output: '[[3,-1,0,1],[2,2,1,-1],[1,-1,2,-1],[0,-1,3,4]]' },
    // varied
    { input: '[[0,2147483647,2147483647],[2147483647,-1,2147483647],[2147483647,2147483647,0]]',
      output: '[[0,1,2],[1,-1,1],[2,1,0]]'                     },
    { input: '[[2147483647,2147483647,0,2147483647],[2147483647,2147483647,2147483647,2147483647]]',
      output: '[[2,1,0,1],[3,2,1,2]]'                          },
    { input: '[[0,2147483647,0],[2147483647,2147483647,2147483647],[0,2147483647,0]]',
      output: '[[0,1,0],[1,2,1],[0,1,0]]'                      },
    { input: '[[0,0,0],[2147483647,2147483647,2147483647],[0,0,0]]',
      output: '[[0,0,0],[1,1,1],[0,0,0]]'                      },
    { input: '[[2147483647,2147483647,2147483647],[0,0,0],[2147483647,2147483647,2147483647]]',
      output: '[[1,1,1],[0,0,0],[1,1,1]]'                      },
    { input: '[[-1,0,-1],[0,-1,0],[-1,0,-1]]',
      output: '[[-1,0,-1],[0,-1,0],[-1,0,-1]]'                 },
    { input: '[[2147483647,2147483647],[0,-1]]',
      output: '[[1,2147483647],[0,-1]]'                        },
    { input: '[[0,-1,2147483647,2147483647,-1,0]]',
      output: '[[0,-1,2147483647,2147483647,-1,0]]'            },
    { input: '[[0,2147483647,-1,2147483647,0]]',
      output: '[[0,1,-1,1,0]]'                                 },
    { input: '[[0,2147483647,2147483647,-1,2147483647,2147483647,0]]',
      output: '[[0,1,2,-1,2,1,0]]'                             },
    // all walls
    { input: '[[-1,-1,-1],[-1,-1,-1]]',
      output: '[[-1,-1,-1],[-1,-1,-1]]'                        },
  ],

  // -------------------------------------------------------------------------
  // 52. COURSE SCHEDULE
  // Input:  numCourses (int) \n prerequisites (int[][])
  // Output: boolean (true = can finish all)
  // -------------------------------------------------------------------------
  'course-schedule': [
    // samples
    { input: '2\n[[1,0]]',              output: 'true'  },
    { input: '2\n[[1,0],[0,1]]',        output: 'false' },
    // basic
    { input: '1\n[]',                   output: 'true'  },
    { input: '2\n[]',                   output: 'true'  },
    { input: '3\n[]',                   output: 'true'  },
    { input: '2\n[[0,1]]',              output: 'true'  },
    { input: '2\n[[1,0]]',              output: 'true'  },
    // self-cycle
    { input: '1\n[[0,0]]',              output: 'false' },
    { input: '2\n[[0,0]]',              output: 'false' },
    // small cycles
    { input: '3\n[[0,1],[1,2],[2,0]]',  output: 'false' },
    { input: '3\n[[0,1],[1,2]]',        output: 'true'  },
    { input: '3\n[[1,0],[2,0]]',        output: 'true'  },
    // chain
    { input: '4\n[[1,0],[2,1],[3,2]]',  output: 'true'  },
    { input: '4\n[[1,0],[2,1],[0,3],[3,2]]', output: 'false' },
    // diamond (no cycle)
    { input: '4\n[[1,0],[2,0],[3,1],[3,2]]', output: 'true'  },
    // large linear chain
    { input: '5\n[[1,0],[2,1],[3,2],[4,3]]', output: 'true'  },
    // back edge creates cycle
    { input: '5\n[[1,0],[2,1],[3,2],[4,3],[0,4]]', output: 'false' },
    { input: '5\n[[1,0],[2,1],[3,2],[4,3],[2,4]]', output: 'false' },
    // two independent chains
    { input: '6\n[[1,0],[2,1],[4,3],[5,4]]', output: 'true'  },
    // disconnected
    { input: '4\n[[1,0]]',              output: 'true'  },
    // all connected
    { input: '4\n[[1,0],[2,1],[3,2],[3,0]]', output: 'true'  },
    // large no cycle
    { input: '10\n[[1,0],[2,1],[3,2],[4,3],[5,4],[6,5],[7,6],[8,7],[9,8]]', output: 'true'  },
    // large with cycle
    { input: '10\n[[1,0],[2,1],[3,2],[4,3],[5,4],[6,5],[7,6],[8,7],[9,8],[0,9]]', output: 'false' },
    // multiple prerequisites same course
    { input: '4\n[[3,0],[3,1],[3,2]]',  output: 'true'  },
    { input: '4\n[[3,0],[3,1],[0,3]]',  output: 'false' },
    // fan-in
    { input: '6\n[[5,0],[5,1],[5,2],[5,3],[5,4]]', output: 'true'  },
    // fan-out
    { input: '6\n[[1,0],[2,0],[3,0],[4,0],[5,0]]', output: 'true'  },
    // star cycle
    { input: '3\n[[0,1],[1,2],[2,0]]',  output: 'false' },
    // two separate cycles
    { input: '6\n[[0,1],[1,0],[3,4],[4,3]]', output: 'false' },
    // two separate no-cycles
    { input: '6\n[[1,0],[3,2],[5,4]]',  output: 'true'  },
    // 5 courses complex dag
    { input: '5\n[[1,0],[2,0],[3,1],[3,2],[4,3]]', output: 'true'  },
    // complex cycle deep
    { input: '6\n[[1,0],[2,1],[3,2],[4,3],[5,4],[3,5]]', output: 'false' },
    // one edge, separate isolated nodes
    { input: '100\n[[1,0]]',            output: 'true'  },
    // max courses no edges
    { input: '100\n[]',                 output: 'true'  },
    // near boundary
    { input: '3\n[[1,0],[0,1]]',        output: 'false' },
    { input: '3\n[[1,0],[2,1]]',        output: 'true'  },
    // long no-cycle
    { input: '8\n[[1,0],[2,1],[3,2],[4,3],[5,4],[6,5],[7,6]]', output: 'true'  },
    // long cycle
    { input: '8\n[[1,0],[2,1],[3,2],[4,3],[5,4],[6,5],[7,6],[0,7]]', output: 'false' },
    // multiple paths to same node, no cycle
    { input: '5\n[[4,0],[4,1],[4,2],[4,3],[3,0]]', output: 'true'  },
    // multiple paths to same node, with cycle
    { input: '5\n[[4,0],[4,1],[4,2],[4,3],[0,4]]', output: 'false' },
    // stress
    { input: '7\n[[1,0],[2,0],[3,1],[3,2],[4,3],[5,3],[6,4],[6,5]]', output: 'true'  },
    { input: '7\n[[1,0],[2,0],[3,1],[3,2],[4,3],[5,3],[0,6]]',       output: 'true'  },
    { input: '7\n[[1,0],[2,0],[3,1],[3,2],[4,3],[0,4]]',             output: 'false' },
    { input: '2\n[[0,1],[1,0]]',        output: 'false' },
    { input: '4\n[[0,1],[1,2],[2,3],[3,0]]', output: 'false' },
    { input: '4\n[[0,1],[1,2],[2,3]]',  output: 'true'  },
    { input: '4\n[[1,0],[2,0],[3,0]]',  output: 'true'  },
    { input: '4\n[[0,1],[0,2],[0,3]]',  output: 'true'  },
    { input: '6\n[[2,0],[1,0],[3,1],[3,2],[4,3],[5,3],[4,5]]', output: 'false' },
    { input: '5\n[[2,0],[1,0],[3,1],[3,2],[4,1]]', output: 'true'  },
  ],

  // =========================================================================
  // BATCH 4 — Problems 53–72
  // =========================================================================

  // -------------------------------------------------------------------------
  // 53. COURSE SCHEDULE II
  // Input:  numCourses (int) \n prerequisites (int[][])
  // Output: int[] — valid topological order, or [] if impossible
  //   (Only cases with a single valid ordering are used for determinism)
  // -------------------------------------------------------------------------
  'course-schedule-ii': [
    // samples
    { input: '2\n[[1,0]]',              output: '[0,1]'       },
    { input: '4\n[[1,0],[2,0],[3,1],[3,2]]', output: '[0,1,2,3]' },
    { input: '1\n[]',                   output: '[0]'         },
    // impossible (cycle)
    { input: '2\n[[1,0],[0,1]]',        output: '[]'          },
    { input: '3\n[[0,1],[1,2],[2,0]]',  output: '[]'          },
    // no prerequisites
    { input: '3\n[]',                   output: '[0,1,2]'     },
    { input: '4\n[]',                   output: '[0,1,2,3]'   },
    // straight chain — only one ordering
    { input: '3\n[[1,0],[2,1]]',        output: '[0,1,2]'     },
    { input: '4\n[[1,0],[2,1],[3,2]]',  output: '[0,1,2,3]'   },
    { input: '5\n[[1,0],[2,1],[3,2],[4,3]]', output: '[0,1,2,3,4]' },
    { input: '6\n[[1,0],[2,1],[3,2],[4,3],[5,4]]', output: '[0,1,2,3,4,5]' },
    // single cycle
    { input: '3\n[[1,0],[0,1]]',        output: '[]'          },
    { input: '4\n[[1,0],[2,1],[0,2]]',  output: '[]'          },
    // back edge
    { input: '4\n[[1,0],[2,1],[3,2],[1,3]]', output: '[]'     },
    // chain + isolated
    { input: '4\n[[1,0],[2,1]]',        output: '[0,1,2,3]'   },
    // fan-in (multiple valid but test unique)
    { input: '3\n[[2,0],[2,1]]',        output: '[0,1,2]'     },
    // fan-out
    { input: '3\n[[1,0],[2,0]]',        output: '[0,1,2]'     },
    // diamond
    { input: '4\n[[1,0],[2,0],[3,1],[3,2]]', output: '[0,1,2,3]' },
    // repeated cycle detection
    { input: '5\n[[1,0],[2,1],[3,2],[4,3],[0,4]]', output: '[]' },
    { input: '5\n[[1,0],[2,1],[3,2],[2,3]]',       output: '[]' },
    // single course
    { input: '1\n[]',  output: '[0]' },
    { input: '2\n[]',  output: '[0,1]' },
    // self-loop
    { input: '2\n[[0,0]]', output: '[]' },
    { input: '3\n[[1,1]]', output: '[]' },
    // long chain
    { input: '7\n[[1,0],[2,1],[3,2],[4,3],[5,4],[6,5]]', output: '[0,1,2,3,4,5,6]' },
    // two separate chains
    { input: '6\n[[1,0],[2,1],[4,3],[5,4]]', output: '[0,1,2,3,4,5]' },
    // chain with extra isolated
    { input: '5\n[[1,0],[2,1],[3,2]]',  output: '[0,1,2,3,4]' },
    // last two connected
    { input: '4\n[[3,2],[2,1],[1,0]]',  output: '[0,1,2,3]'   },
    // cycle of 4
    { input: '4\n[[1,0],[2,1],[3,2],[0,3]]', output: '[]'     },
    // two disjoint chains
    { input: '4\n[[1,0],[3,2]]',        output: '[0,1,2,3]'   },
    // chain ending with branch (unique order still)
    { input: '5\n[[1,0],[2,0],[3,1],[4,2]]', output: '[0,1,2,3,4]' },
    // deeper chain
    { input: '8\n[[1,0],[2,1],[3,2],[4,3],[5,4],[6,5],[7,6]]', output: '[0,1,2,3,4,5,6,7]' },
    // impossible long cycle
    { input: '6\n[[1,0],[2,1],[3,2],[4,3],[5,4],[0,5]]', output: '[]' },
    // multiple edges, single valid order
    { input: '4\n[[1,0],[2,1],[3,1]]',  output: '[0,1,2,3]'   },
    // two isolated + one chain
    { input: '5\n[[4,3]]',             output: '[0,1,2,3,4]'  },
    // more impossible
    { input: '3\n[[1,0],[0,2],[2,1]]',  output: '[]'          },
    { input: '6\n[[1,0],[2,1],[0,2]]',  output: '[]'          },
    // large no prereqs
    { input: '5\n[]',  output: '[0,1,2,3,4]' },
    { input: '6\n[]',  output: '[0,1,2,3,4,5]' },
    // two-course cycle
    { input: '2\n[[0,1],[1,0]]', output: '[]' },
    // adjacent swap — still cycle
    { input: '3\n[[0,1],[1,2],[2,0]]',  output: '[]' },
    { input: '4\n[[0,1],[1,2],[2,3],[3,0]]', output: '[]' },
    // valid complex
    { input: '6\n[[1,0],[2,1],[3,2],[5,4]]', output: '[0,1,2,3,4,5]' },
    { input: '6\n[[5,4],[4,3],[3,2],[2,1],[1,0]]', output: '[0,1,2,3,4,5]' },
  ],

  // -------------------------------------------------------------------------
  // 54. NUMBER OF CONNECTED COMPONENTS IN AN UNDIRECTED GRAPH
  // Input:  n (int) \n edges (int[][])
  // Output: number of components (int)
  // -------------------------------------------------------------------------
  'number-of-connected-components-in-an-undirected-graph': [
    // samples
    { input: '5\n[[0,1],[1,2],[3,4]]',            output: '2' },
    { input: '5\n[[0,1],[1,2],[2,3],[3,4]]',       output: '1' },
    // basic
    { input: '1\n[]',                              output: '1' },
    { input: '2\n[]',                              output: '2' },
    { input: '2\n[[0,1]]',                         output: '1' },
    { input: '3\n[]',                              output: '3' },
    { input: '3\n[[0,1]]',                         output: '2' },
    { input: '3\n[[0,1],[1,2]]',                   output: '1' },
    { input: '3\n[[0,2]]',                         output: '2' },
    // all connected
    { input: '4\n[[0,1],[1,2],[2,3]]',             output: '1' },
    { input: '4\n[[0,1],[0,2],[0,3]]',             output: '1' },
    { input: '4\n[[0,1],[2,3]]',                   output: '2' },
    { input: '4\n[[0,1],[1,2],[1,3]]',             output: '1' },
    // all isolated
    { input: '5\n[]',                              output: '5' },
    { input: '4\n[]',                              output: '4' },
    // star
    { input: '5\n[[0,1],[0,2],[0,3],[0,4]]',       output: '1' },
    // cycle
    { input: '4\n[[0,1],[1,2],[2,3],[3,0]]',       output: '1' },
    { input: '5\n[[0,1],[1,2],[2,0],[3,4]]',       output: '2' },
    // two complete triangles
    { input: '6\n[[0,1],[1,2],[2,0],[3,4],[4,5],[5,3]]', output: '2' },
    // path + isolated
    { input: '6\n[[0,1],[1,2],[2,3],[4,5]]',       output: '2' },
    // every node isolated
    { input: '3\n[]', output: '3' },
    // single edge pair + rest isolated
    { input: '6\n[[2,3]]',                         output: '5' },
    // redundant edges (still same components)
    { input: '4\n[[0,1],[1,0],[2,3]]',             output: '2' },
    // large fully connected
    { input: '6\n[[0,1],[1,2],[2,3],[3,4],[4,5]]', output: '1' },
    { input: '6\n[[0,5],[1,5],[2,5],[3,5],[4,5]]', output: '1' },
    // large isolated
    { input: '10\n[]',                             output: '10'},
    // two big components
    { input: '8\n[[0,1],[1,2],[2,3],[4,5],[5,6],[6,7]]', output: '2' },
    // three components
    { input: '9\n[[0,1],[1,2],[3,4],[4,5],[6,7],[7,8]]', output: '3' },
    // sparse
    { input: '7\n[[0,1],[2,3],[4,5]]',             output: '4' },
    // dense
    { input: '5\n[[0,1],[0,2],[0,3],[0,4],[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]', output: '1' },
    // linear + one extra
    { input: '5\n[[0,1],[1,2],[2,3],[3,4]]',       output: '1' },
    { input: '5\n[[0,1],[1,2],[2,3]]',             output: '2' },
    // misc
    { input: '7\n[[0,1],[2,3],[4,6]]',             output: '4' },
    { input: '7\n[[0,1],[0,2],[3,4],[3,5],[3,6]]', output: '2' },
    { input: '6\n[[0,1],[2,3],[4,5],[0,4]]',       output: '2' },
    { input: '6\n[[0,1],[2,3],[4,5],[0,2]]',       output: '2' },
    { input: '6\n[[0,1],[2,3],[4,5],[0,2],[0,4]]', output: '1' },
    // additional
    { input: '4\n[[0,3],[1,2]]',                   output: '2' },
    { input: '4\n[[0,3],[1,2],[0,1]]',             output: '1' },
    { input: '3\n[[0,1],[0,2],[1,2]]',             output: '1' },
    { input: '5\n[[0,1],[0,2],[0,3],[0,4]]',       output: '1' },
    { input: '5\n[[1,2],[2,3],[3,4]]',             output: '2' },
    { input: '5\n[[0,4],[1,3],[2,4]]',             output: '2' },
    { input: '5\n[[0,4],[1,3],[2,4],[1,2]]',       output: '2' },
    { input: '5\n[[0,4],[1,3],[2,4],[1,2],[0,1]]', output: '1' },
    { input: '2\n[[1,0]]', output: '1' },
    { input: '2\n[[0,1]]', output: '1' },
  ],

  // -------------------------------------------------------------------------
  // 55. GRAPH VALID TREE
  // Input:  n (int) \n edges (int[][])
  // Output: boolean
  // -------------------------------------------------------------------------
  'graph-valid-tree': [
    // samples
    { input: '5\n[[0,1],[0,2],[0,3],[1,4]]',       output: 'true'  },
    { input: '5\n[[0,1],[1,2],[2,3],[1,3],[1,4]]', output: 'false' },
    // basic
    { input: '1\n[]',                              output: 'true'  },
    { input: '2\n[[0,1]]',                         output: 'true'  },
    { input: '2\n[]',                              output: 'false' },
    { input: '3\n[[0,1],[1,2]]',                   output: 'true'  },
    { input: '3\n[[0,1],[0,2]]',                   output: 'true'  },
    { input: '3\n[[0,1],[1,2],[0,2]]',             output: 'false' }, // cycle
    { input: '3\n[[0,1]]',                         output: 'false' }, // disconnected
    // 4-node trees
    { input: '4\n[[0,1],[0,2],[0,3]]',             output: 'true'  },
    { input: '4\n[[0,1],[1,2],[2,3]]',             output: 'true'  },
    { input: '4\n[[0,1],[1,2],[2,3],[3,0]]',       output: 'false' }, // cycle
    { input: '4\n[[0,1],[2,3]]',                   output: 'false' }, // disconnected
    { input: '4\n[[0,1],[1,2],[0,3]]',             output: 'true'  },
    // cycle detection
    { input: '4\n[[0,1],[1,2],[2,0],[3,0]]',       output: 'false' },
    { input: '5\n[[0,1],[1,2],[2,3],[3,4],[4,2]]', output: 'false' },
    // too many edges
    { input: '3\n[[0,1],[1,2],[0,1]]',             output: 'false' },
    // star trees
    { input: '5\n[[0,1],[0,2],[0,3],[0,4]]',       output: 'true'  },
    { input: '6\n[[0,1],[0,2],[0,3],[0,4],[0,5]]', output: 'true'  },
    // line tree
    { input: '5\n[[0,1],[1,2],[2,3],[3,4]]',       output: 'true'  },
    { input: '6\n[[0,1],[1,2],[2,3],[3,4],[4,5]]', output: 'true'  },
    // disconnected no edges
    { input: '4\n[]',  output: 'false' },
    { input: '3\n[]',  output: 'false' },
    // single edge missing
    { input: '4\n[[0,1],[1,2]]',                   output: 'false' },
    { input: '4\n[[0,1],[0,2]]',                   output: 'false' },
    // cycle + correct count
    { input: '4\n[[0,1],[1,2],[2,3],[0,3]]',       output: 'false' },
    { input: '5\n[[0,1],[0,2],[0,3],[1,4],[2,4]]', output: 'false' },
    // valid larger trees
    { input: '7\n[[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]]',        output: 'true'  },
    { input: '8\n[[0,1],[0,2],[1,3],[1,4],[2,5],[2,6],[6,7]]',  output: 'true'  },
    // too many edges for n nodes
    { input: '5\n[[0,1],[0,2],[0,3],[0,4],[1,2]]', output: 'false' },
    // exactly n-1 edges but disconnected
    { input: '6\n[[0,1],[1,2],[2,3],[4,5]]',       output: 'false' },
    // exactly n-1 edges and connected
    { input: '6\n[[0,1],[1,2],[2,3],[3,4],[4,5]]', output: 'true'  },
    // stress
    { input: '5\n[[0,1],[1,2],[2,3],[3,4]]',       output: 'true'  },
    { input: '5\n[[0,1],[1,2],[2,3],[3,4],[4,0]]', output: 'false' },
    { input: '5\n[[0,1],[1,2],[2,3],[0,3]]',       output: 'false' },
    { input: '5\n[[0,1],[1,2],[2,4],[4,3]]',       output: 'true'  },
    { input: '5\n[[0,1],[1,2],[2,4],[4,3],[3,1]]', output: 'false' },
    { input: '6\n[[0,1],[0,2],[1,3],[3,4],[4,5]]', output: 'true'  },
    { input: '6\n[[0,1],[0,2],[1,3],[3,4],[4,5],[5,1]]', output: 'false' },
    { input: '7\n[[0,1],[0,2],[1,3],[1,4],[2,5],[2,6],[3,6]]',  output: 'false' },
    { input: '4\n[[0,1],[0,2],[0,3],[1,2]]',       output: 'false' },
    { input: '4\n[[0,1],[0,2],[0,3]]',             output: 'true'  },
    { input: '3\n[[0,2],[0,1]]',                   output: 'true'  },
    { input: '2\n[[1,0]]',                         output: 'true'  },
    { input: '3\n[[2,0],[2,1]]',                   output: 'true'  },
    { input: '4\n[[2,0],[2,1],[3,2]]',             output: 'true'  },
  ],

  // -------------------------------------------------------------------------
  // 56. REDUNDANT CONNECTION
  // Input:  edges (int[][], 1-indexed pairs forming a tree + one extra)
  // Output: int[2] — the redundant edge (last one that creates a cycle)
  // -------------------------------------------------------------------------
  'redundant-connection': [
    // samples
    { input: '[[1,2],[1,3],[2,3]]', output: '[2,3]' },
    { input: '[[1,2],[2,3],[3,4],[1,4],[1,5]]', output: '[1,4]' },
    // basic 3-node
    { input: '[[1,2],[2,3],[1,3]]', output: '[1,3]' },
    { input: '[[1,3],[1,2],[2,3]]', output: '[2,3]' },
    // 4-node cycle at end
    { input: '[[1,2],[2,3],[3,4],[4,1]]',             output: '[4,1]' },
    { input: '[[1,2],[2,3],[3,1]]',                   output: '[3,1]' },
    // extra edge closes cycle
    { input: '[[1,2],[1,3],[2,4],[3,5],[4,5]]',       output: '[4,5]' },
    { input: '[[1,2],[1,3],[2,3],[3,4]]',             output: '[2,3]' },
    // last edge is redundant
    { input: '[[3,4],[1,2],[2,4],[3,5],[2,5]]',       output: '[2,5]' },
    // first edge creates cycle with the last
    { input: '[[1,4],[3,4],[1,3],[1,2],[4,5]]',       output: '[1,3]' },
    // star + back edge
    { input: '[[1,2],[1,3],[1,4],[1,5],[2,5]]',       output: '[2,5]' },
    { input: '[[1,2],[1,3],[1,4],[1,5],[3,5]]',       output: '[3,5]' },
    // chain + skip edge
    { input: '[[1,2],[2,3],[3,4],[4,5],[1,5]]',       output: '[1,5]' },
    { input: '[[1,2],[2,3],[3,4],[4,5],[2,5]]',       output: '[2,5]' },
    { input: '[[1,2],[2,3],[3,4],[4,5],[3,5]]',       output: '[3,5]' },
    // complete triangle
    { input: '[[1,2],[2,3],[1,3]]', output: '[1,3]' },
    // cycle-closing edge not last in cycle
    { input: '[[1,2],[2,3],[3,4],[2,4],[4,5]]',       output: '[2,4]' },
    // 5 node all edges
    { input: '[[1,2],[1,3],[1,4],[1,5],[2,3]]',       output: '[2,3]' },
    // NeetCode 5-node example
    { input: '[[1,2],[2,3],[3,4],[1,4],[1,5]]',       output: '[1,4]' },
    // single cycle
    { input: '[[1,2],[2,3],[3,1]]',                   output: '[3,1]' },
    // deeper cycle
    { input: '[[1,2],[2,3],[3,4],[4,5],[5,3]]',       output: '[5,3]' },
    { input: '[[1,2],[2,3],[3,4],[4,5],[5,2]]',       output: '[5,2]' },
    { input: '[[1,2],[2,3],[3,4],[4,5],[5,1]]',       output: '[5,1]' },
    // more
    { input: '[[2,7],[7,8],[3,6],[2,5],[6,8],[1,2],[5,8]]', output: '[6,8]' },
    { input: '[[1,5],[3,4],[3,5],[4,5],[2,4]]',       output: '[4,5]' },
    { input: '[[1,2],[1,3],[2,3]]', output: '[2,3]' },
    // repeated structure
    { input: '[[1,2],[2,3],[1,3]]', output: '[1,3]' },
    { input: '[[2,3],[1,2],[1,3]]', output: '[1,3]' },
    { input: '[[3,4],[1,3],[2,3],[2,4]]', output: '[2,4]' },
    { input: '[[1,2],[2,3],[3,4],[4,2]]', output: '[4,2]' },
    { input: '[[1,2],[2,3],[3,4],[4,3]]', output: '[4,3]' },
    { input: '[[1,2],[2,3],[4,5],[3,5],[3,4]]', output: '[3,4]' },
    { input: '[[4,5],[1,4],[3,5],[2,3],[1,2]]', output: '[1,2]' },
    { input: '[[1,2],[2,3],[3,1],[4,1]]',       output: '[3,1]' },
    { input: '[[1,5],[3,4],[3,5],[4,5],[2,4]]', output: '[4,5]' },
    { input: '[[1,2],[1,3],[2,4],[3,5],[4,5],[5,6]]', output: '[4,5]' },
    { input: '[[1,2],[2,3],[3,5],[5,4],[4,3]]', output: '[4,3]' },
    // small
    { input: '[[1,2],[2,3],[3,1]]', output: '[3,1]' },
    { input: '[[1,2],[2,3],[2,1]]', output: '[2,1]' },
    // wrap-around
    { input: '[[3,4],[1,2],[2,4],[3,5],[2,5]]', output: '[2,5]' },
    { input: '[[1,3],[2,3],[2,1]]',             output: '[2,1]' },
    { input: '[[1,2],[3,4],[2,4],[1,3]]',       output: '[1,3]' },
    { input: '[[1,2],[3,4],[2,4],[3,5],[1,5]]', output: '[1,5]' },
  ],

  // -------------------------------------------------------------------------
  // 57. NETWORK DELAY TIME
  // Input:  times (int[][], [u,v,w]) \n n (int) \n k (int)
  // Output: max time or -1 if not all reachable
  // -------------------------------------------------------------------------
  'network-delay-time': [
    // samples
    { input: '[[2,1,1],[2,3,1],[3,4,1]]\n4\n2', output: '2'  },
    { input: '[[1,2,1]]\n2\n1',                  output: '1'  },
    { input: '[[1,2,1]]\n2\n2',                  output: '-1' },
    // basic
    { input: '[[1,2,1],[2,3,1],[3,4,1]]\n4\n1',  output: '3'  },
    { input: '[[1,2,5],[1,3,2],[2,3,1]]\n3\n1',  output: '3'  },
    { input: '[[1,2,1],[1,3,10],[2,3,1]]\n3\n1', output: '2'  },
    // single node
    { input: '[]\n1\n1',                          output: '0'  },
    // unreachable
    { input: '[[1,2,1],[1,3,1]]\n4\n1',           output: '-1' },
    { input: '[[2,3,1]]\n3\n1',                   output: '-1' },
    // two edges same dest
    { input: '[[1,2,1],[1,2,3]]\n2\n1',           output: '1'  },
    // star from center
    { input: '[[1,2,1],[1,3,2],[1,4,3]]\n4\n1',   output: '3'  },
    // longer path shorter time
    { input: '[[1,2,100],[1,3,1],[3,2,1]]\n3\n1', output: '2'  },
    // multiple hops
    { input: '[[1,2,1],[2,3,2],[3,4,3],[4,5,4]]\n5\n1', output: '10' },
    { input: '[[1,5,1],[2,5,1],[3,5,1],[4,5,1],[5,6,1]]\n6\n1', output: '-1' },
    // all paths from k
    { input: '[[1,2,1],[1,3,7],[2,4,1],[3,4,1]]\n4\n1', output: '3' },
    // direct vs indirect
    { input: '[[1,4,2],[1,2,1],[2,3,1],[3,4,1]]\n4\n1', output: '2' },
    // cycle in graph (shortest still finite)
    { input: '[[1,2,1],[2,3,1],[3,2,1],[3,4,1]]\n4\n1', output: '3' },
    // k not 1
    { input: '[[2,1,1],[2,3,1],[3,4,1]]\n4\n2',   output: '2'  },
    { input: '[[2,1,1],[2,3,1],[3,4,1]]\n4\n3',   output: '-1' },
    { input: '[[2,1,1],[2,3,1],[3,4,1]]\n4\n4',   output: '-1' },
    // two separate components
    { input: '[[1,2,1],[3,4,1]]\n4\n1',            output: '-1' },
    { input: '[[1,2,1],[1,3,2],[1,4,3],[1,5,4]]\n5\n1', output: '4' },
    // dense graph
    { input: '[[1,2,2],[1,3,5],[2,3,2],[2,4,4],[3,4,1]]\n4\n1', output: '5' },
    // straightforward dijkstra
    { input: '[[1,2,9],[1,3,2],[3,2,4]]\n3\n1',    output: '6'  },
    // large weights
    { input: '[[1,2,100],[2,3,100],[3,4,100]]\n4\n1', output: '300' },
    // zero-weight edge
    { input: '[[1,2,0],[2,3,0]]\n3\n1',            output: '0'  },
    // backward edge not usable from k
    { input: '[[2,1,1],[3,2,1],[4,3,1]]\n4\n1',    output: '-1' },
    { input: '[[2,1,1],[3,2,1],[4,3,1]]\n4\n4',    output: '3'  },
    // stress
    { input: '[[1,2,1],[1,3,4],[2,3,2],[2,4,5],[3,4,1]]\n4\n1', output: '4' },
    { input: '[[1,2,3],[2,3,2],[1,3,6]]\n3\n1',    output: '5'  },
    { input: '[[1,2,1],[2,1,3]]\n2\n2',            output: '3'  },
    { input: '[[1,2,10],[2,1,2],[2,3,5],[3,1,1]]\n3\n1', output: '15' },
    { input: '[[1,2,5],[2,3,5],[3,4,5],[4,5,5]]\n5\n1', output: '20' },
    { input: '[[1,2,1],[2,3,1],[3,4,1],[4,5,1],[5,1,1]]\n5\n1', output: '4' },
    // two-node bidirectional
    { input: '[[1,2,3],[2,1,5]]\n2\n1',            output: '3'  },
    { input: '[[1,2,3],[2,1,5]]\n2\n2',            output: '5'  },
    // path with dead end
    { input: '[[1,2,1],[1,3,2],[2,4,1]]\n4\n1',    output: '2'  },
    // unreachable island
    { input: '[[1,2,1],[1,3,1],[1,4,1]]\n5\n1',    output: '-1' },
    // k reaches all
    { input: '[[1,2,1],[1,3,1],[1,4,1]]\n4\n1',    output: '1'  },
    // bigger n
    { input: '[[1,2,2],[2,3,3],[3,4,4],[4,5,5],[5,6,6],[6,7,7]]\n7\n1', output: '27' },
    { input: '[[1,2,1],[2,3,1],[3,4,1],[4,5,1],[5,6,1]]\n6\n1', output: '5' },
    { input: '[[1,2,6],[2,3,4],[1,3,10]]\n3\n1',   output: '10' },
  ],

  // -------------------------------------------------------------------------
  // 58. SWIM IN RISING WATER
  // Input:  grid (int[][], each cell = elevation, n×n, values are permutation 0..n²-1)
  // Output: minimum time (int)
  // -------------------------------------------------------------------------
  'swim-in-rising-water': [
    // samples
    { input: '[[0,2],[1,3]]',                                                        output: '3'  },
    { input: '[[0,1,2,3,4],[24,23,22,21,5],[12,13,14,15,16],[11,17,18,19,20],[10,9,8,7,6]]', output: '16' },
    // basic 1x1
    { input: '[[0]]',                                                                output: '0'  },
    // 2x2
    { input: '[[0,1],[2,3]]',                                                        output: '3'  },
    { input: '[[0,3],[1,2]]',                                                        output: '3'  },
    { input: '[[0,2],[3,1]]',                                                        output: '3'  },
    { input: '[[3,0],[2,1]]',                                                        output: '3'  },
    { input: '[[1,0],[2,3]]',                                                        output: '3'  },
    { input: '[[2,0],[1,3]]',                                                        output: '3'  },
    // 3x3
    { input: '[[0,1,2],[3,4,5],[6,7,8]]',                                            output: '8'  },
    { input: '[[0,4,7],[3,5,8],[1,2,6]]',                                            output: '6'  },
    { input: '[[0,3,6],[7,4,1],[8,5,2]]',                                            output: '8'  },
    { input: '[[0,1,4],[3,2,5],[6,7,8]]',                                            output: '8'  },
    { input: '[[0,7,3],[1,8,4],[2,5,6]]',                                            output: '6'  },
    { input: '[[7,4,0],[8,5,1],[6,3,2]]',                                            output: '8'  },
    // classic NeetCode 2x2
    { input: '[[0,2],[1,3]]',                                                        output: '3'  },
    // path forces going around
    { input: '[[0,2,3],[4,8,5],[6,1,7]]',                                            output: '8'  },
    { input: '[[2,0,1],[5,3,4],[7,8,6]]',                                            output: '8'  },
    // 4x4
    { input: '[[0,1,2,3],[4,5,6,7],[8,9,10,11],[12,13,14,15]]',                     output: '15' },
    { input: '[[0,15,2,3],[4,5,6,7],[8,9,10,11],[12,13,14,1]]',                     output: '15' },
    // min path bottleneck
    { input: '[[0,9],[1,2]]',                                                        output: '2'  },
    { input: '[[0,1],[9,2]]',                                                        output: '2'  },
    { input: '[[3,4],[1,0]]',                                                        output: '4'  },
    // spiral 5x5
    { input: '[[0,1,2,3,4],[24,23,22,21,5],[12,13,14,15,16],[11,17,18,19,20],[10,9,8,7,6]]', output: '16' },
    // short path through low
    { input: '[[0,4,3],[1,5,2],[6,7,8]]',                                            output: '5'  },
    // stress
    { input: '[[0,2,4],[1,3,5],[8,7,6]]',                                            output: '8'  },
    { input: '[[0,8,6],[4,2,7],[3,5,1]]',                                            output: '8'  },
    { input: '[[6,8,2],[4,0,3],[7,5,1]]',                                            output: '8'  },
    { input: '[[0,3,8],[4,1,2],[5,6,7]]',                                            output: '8'  },
    { input: '[[0,5,9],[1,4,3],[2,6,7]]',                                            output: '9'  },
    { input: '[[0,1,5],[3,2,4],[6,7,8]]',                                            output: '8'  },
    { input: '[[4,2,0],[3,1,5],[8,7,6]]',                                            output: '8'  },
    { input: '[[8,7,6],[5,4,3],[0,1,2]]',                                            output: '8'  },
    { input: '[[5,6,7],[4,3,8],[0,1,2]]',                                            output: '8'  },
    { input: '[[0,2,3],[4,8,1],[6,5,7]]',                                            output: '8'  },
    { input: '[[0,6,4],[1,7,5],[2,8,3]]',                                            output: '8'  },
    { input: '[[8,4,3],[5,6,1],[0,7,2]]',                                            output: '8'  },
    { input: '[[0,1,2],[5,4,3],[6,7,8]]',                                            output: '8'  },
    // only path through large value
    { input: '[[0,3],[4,1]]',                                                        output: '4'  },
    { input: '[[0,4],[1,3]]',                                                        output: '4'  },
    // 1x2 and 2x1
    { input: '[[0,1]]',                                                              output: '1'  },
    { input: '[[0],[1]]',                                                            output: '1'  },
    { input: '[[1,0]]',                                                              output: '1'  },
    { input: '[[1],[0]]',                                                            output: '1'  },
  ],

  // -------------------------------------------------------------------------
  // 59. BINARY TREE LEVEL ORDER TRAVERSAL
  // Input:  root (int[] BFS-null-array, null as "null")
  // Output: int[][] level-by-level values
  // -------------------------------------------------------------------------
  'binary-tree-level-order-traversal': [
    // samples
    { input: '[3,9,20,null,null,15,7]',  output: '[[3],[9,20],[15,7]]'   },
    { input: '[1]',                      output: '[[1]]'                  },
    { input: '[]',                       output: '[]'                     },
    // basic
    { input: '[1,2,3]',                  output: '[[1],[2,3]]'            },
    { input: '[1,2,3,4,5,6,7]',         output: '[[1],[2,3],[4,5,6,7]]'  },
    { input: '[1,null,2,null,3]',        output: '[[1],[2],[3]]'          },
    { input: '[1,2,null,3,null]',        output: '[[1],[2],[3]]'          },
    // two levels
    { input: '[1,2,3]',                  output: '[[1],[2,3]]'            },
    { input: '[1,null,3]',               output: '[[1],[3]]'              },
    { input: '[1,2,null]',              output: '[[1],[2]]'               },
    // three levels
    { input: '[1,2,3,4,5,6,7]',         output: '[[1],[2,3],[4,5,6,7]]'  },
    { input: '[1,2,3,4,null,null,7]',   output: '[[1],[2,3],[4,7]]'      },
    { input: '[1,2,3,null,5,6,null]',   output: '[[1],[2,3],[5,6]]'      },
    // skewed left
    { input: '[1,2,null,3,null,null,null,4]', output: '[[1],[2],[3],[4]]' },
    // skewed right
    { input: '[1,null,2,null,null,null,3]',   output: '[[1],[2],[3]]'     },
    // four levels
    { input: '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]',
      output: '[[1],[2,3],[4,5,6,7],[8,9,10,11,12,13,14,15]]' },
    // various shapes
    { input: '[5,4,7,3,null,2,null,-1,null,9]',
      output: '[[5],[4,7],[3,2],[-1,9]]' },
    { input: '[10,5,15,3,7,null,18]',
      output: '[[10],[5,15],[3,7,18]]' },
    // single branch
    { input: '[1,2,null,3,null]',  output: '[[1],[2],[3]]' },
    { input: '[1,null,2,null,3]',  output: '[[1],[2],[3]]' },
    // balanced
    { input: '[4,2,7,1,3,6,9]',    output: '[[4],[2,7],[1,3,6,9]]' },
    { input: '[6,2,8,0,4,7,9,null,null,3,5]',
      output: '[[6],[2,8],[0,4,7,9],[3,5]]' },
    // negative values
    { input: '[-10,9,20,null,null,15,7]',
      output: '[[-10],[9,20],[15,7]]' },
    { input: '[-3,null,9,-10,null]',
      output: '[[-3],[9],[-10]]'     },
    // many nulls
    { input: '[1,2,null,null,3]',   output: '[[1],[2],[3]]' },
    { input: '[1,null,3,null,null,null,2]', output: '[[1],[3],[2]]' },
    // 5 levels deep left-skewed
    { input: '[1,2,null,3,null,4,null,null,null,null,null,5]',
      output: '[[1],[2],[3],[4],[5]]' },
    // stress
    { input: '[2,1,3]',             output: '[[2],[1,3]]'    },
    { input: '[0,-1,1]',            output: '[[0],[-1,1]]'   },
    { input: '[10,5,15,3,7,12,18,1,4]',
      output: '[[10],[5,15],[3,7,12,18],[1,4]]' },
    { input: '[100,50,150,25,75,125,175]',
      output: '[[100],[50,150],[25,75,125,175]]' },
    { input: '[1,2,3,null,null,4,5]',      output: '[[1],[2,3],[4,5]]' },
    { input: '[3,1,5,0,2,4,6]',            output: '[[3],[1,5],[0,2,4,6]]' },
    { input: '[5,3,7,1,4,6,8]',            output: '[[5],[3,7],[1,4,6,8]]' },
    { input: '[1,2,null,4,5]',             output: '[[1],[2],[4,5]]'    },
    { input: '[1,null,2,null,null,3,4]',   output: '[[1],[2],[3,4]]'    },
    { input: '[1,2,3,4,5,null,null]',      output: '[[1],[2,3],[4,5]]'  },
  ],

  // -------------------------------------------------------------------------
  // 60. VALIDATE BINARY SEARCH TREE
  // Input:  root (int[] BFS-null-array)
  // Output: boolean
  // -------------------------------------------------------------------------
  'validate-binary-search-tree': [
    // samples
    { input: '[2,1,3]',                     output: 'true'  },
    { input: '[5,1,4,null,null,3,6]',       output: 'false' },
    // basic
    { input: '[1]',                          output: 'true'  },
    { input: '[]',                           output: 'true'  },
    { input: '[1,null,2]',                   output: 'true'  },
    { input: '[2,null,1]',                   output: 'false' },
    { input: '[1,2,null]',                   output: 'false' },
    { input: '[2,1,null]',                   output: 'true'  },
    // equal children (BST requires strict inequality)
    { input: '[1,1,null]',                   output: 'false' },
    { input: '[1,null,1]',                   output: 'false' },
    // three levels
    { input: '[5,3,7,1,4,6,8]',             output: 'true'  },
    { input: '[5,3,7,1,4,6,4]',             output: 'false' },
    { input: '[5,3,7,6,4,6,8]',             output: 'false' },
    // classic trap: right subtree value < root
    { input: '[3,1,5,0,2,4,6]',             output: 'true'  },
    { input: '[3,1,5,0,2,4,2]',             output: 'false' },
    // left subtree large value
    { input: '[10,5,15,3,7,null,18]',        output: 'true'  },
    { input: '[10,5,15,3,7,6,18]',           output: 'false' }, // 6 < 10 but in right subtree
    { input: '[5,4,6,null,null,3,7]',        output: 'false' }, // 3 in right but < 5
    // all left
    { input: '[5,4,null,3,null]',            output: 'true'  },
    { input: '[5,4,null,6,null]',            output: 'false' },
    // all right
    { input: '[1,null,2,null,3]',            output: 'true'  },
    { input: '[1,null,0,null,null]',         output: 'false' },
    // negatives
    { input: '[-2,-3,-1]',                   output: 'true'  },
    { input: '[-5,-10,-3,-20,-6,-7,-1]',    output: 'true'  },
    { input: '[0,-1,1]',                     output: 'true'  },
    { input: '[0,1,-1]',                     output: 'false' },
    // tricky grandchild violation
    { input: '[10,5,15,3,12,12,20]',         output: 'false' }, // 12 in left subtree of 15 ok but > 10's left's parent
    { input: '[6,3,7,2,5,4,8]',              output: 'false' }, // 4 < 6 so left subtree, but 4 > 3 so right of 3, but 4 < 6 ok... wait
    // stress
    { input: '[8,3,10,1,6,null,14,null,null,4,7,null,null,13]',
      output: 'true'  },
    { input: '[8,3,10,1,6,null,14,null,null,4,7,null,null,11]',
      output: 'true'  },
    // BST boundaries
    { input: '[2147483647]',                  output: 'true'  },
    { input: '[-2147483648]',                 output: 'true'  },
    { input: '[2147483647,2147483646]',       output: 'true'  },
    { input: '[2147483647,null,2147483646]',  output: 'false' },
    // more
    { input: '[4,2,6,1,3,5,7]',              output: 'true'  },
    { input: '[4,2,6,1,3,5,5]',              output: 'false' },
    { input: '[4,2,6,1,5,5,7]',              output: 'false' },
    { input: '[9,3,20,null,null,15,25]',      output: 'true'  },
    { input: '[9,3,20,null,null,15,15]',      output: 'false' },
    { input: '[3,1,5]',                       output: 'true'  },
    { input: '[3,5,1]',                       output: 'false' },
    { input: '[7,3,15,1,5,9,20]',             output: 'true'  },
    { input: '[7,3,15,1,5,6,20]',             output: 'false' },
    { input: '[2,1,3]',                       output: 'true'  },
    { input: '[2,3,1]',                       output: 'false' },
    { input: '[2,2,2]',                       output: 'false' },
    // large valid BST
    { input: '[10,5,15,3,7,12,18]',           output: 'true'  },
    { input: '[10,5,15,3,7,12,10]',           output: 'false' },
  ],

  // -------------------------------------------------------------------------
  // 61. KTH SMALLEST ELEMENT IN A BST
  // Input:  root (int[] BFS-null) \n k (int)
  // Output: kth smallest value (int)
  // -------------------------------------------------------------------------
  'kth-smallest-element-in-a-bst': [
    // samples
    { input: '[3,1,4,null,2]\n1',          output: '1' },
    { input: '[5,3,6,2,4,null,null,1]\n3', output: '3' },
    // basic: single node
    { input: '[1]\n1',                     output: '1' },
    // two nodes
    { input: '[2,1,null]\n1',              output: '1' },
    { input: '[2,1,null]\n2',              output: '2' },
    { input: '[1,null,2]\n1',              output: '1' },
    { input: '[1,null,2]\n2',              output: '2' },
    // three nodes
    { input: '[2,1,3]\n1',                 output: '1' },
    { input: '[2,1,3]\n2',                 output: '2' },
    { input: '[2,1,3]\n3',                 output: '3' },
    // larger BST
    { input: '[4,2,6,1,3,5,7]\n1',         output: '1' },
    { input: '[4,2,6,1,3,5,7]\n2',         output: '2' },
    { input: '[4,2,6,1,3,5,7]\n3',         output: '3' },
    { input: '[4,2,6,1,3,5,7]\n4',         output: '4' },
    { input: '[4,2,6,1,3,5,7]\n5',         output: '5' },
    { input: '[4,2,6,1,3,5,7]\n6',         output: '6' },
    { input: '[4,2,6,1,3,5,7]\n7',         output: '7' },
    // right-skewed
    { input: '[1,null,2,null,3,null,4]\n1', output: '1' },
    { input: '[1,null,2,null,3,null,4]\n2', output: '2' },
    { input: '[1,null,2,null,3,null,4]\n3', output: '3' },
    { input: '[1,null,2,null,3,null,4]\n4', output: '4' },
    // left-skewed
    { input: '[4,3,null,2,null,1,null]\n1', output: '1' },
    { input: '[4,3,null,2,null,1,null]\n2', output: '2' },
    { input: '[4,3,null,2,null,1,null]\n3', output: '3' },
    { input: '[4,3,null,2,null,1,null]\n4', output: '4' },
    // five nodes
    { input: '[5,3,7,1,4,6,8]\n1', output: '1' },
    { input: '[5,3,7,1,4,6,8]\n3', output: '3' },
    { input: '[5,3,7,1,4,6,8]\n5', output: '5' },
    { input: '[5,3,7,1,4,6,8]\n7', output: '7' },
    // negatives
    { input: '[0,-2,1,-3,-1]\n1',           output: '-3' },
    { input: '[0,-2,1,-3,-1]\n2',           output: '-2' },
    { input: '[0,-2,1,-3,-1]\n3',           output: '-1' },
    { input: '[0,-2,1,-3,-1]\n4',           output: '0'  },
    { input: '[0,-2,1,-3,-1]\n5',           output: '1'  },
    // seven nodes
    { input: '[10,5,15,3,7,12,18]\n1', output: '3'  },
    { input: '[10,5,15,3,7,12,18]\n2', output: '5'  },
    { input: '[10,5,15,3,7,12,18]\n3', output: '7'  },
    { input: '[10,5,15,3,7,12,18]\n4', output: '10' },
    { input: '[10,5,15,3,7,12,18]\n5', output: '12' },
    { input: '[10,5,15,3,7,12,18]\n6', output: '15' },
    { input: '[10,5,15,3,7,12,18]\n7', output: '18' },
    // mixed
    { input: '[6,2,8,0,4,7,9,null,null,3,5]\n1', output: '0' },
    { input: '[6,2,8,0,4,7,9,null,null,3,5]\n3', output: '3' },
    { input: '[6,2,8,0,4,7,9,null,null,3,5]\n5', output: '5' },
    { input: '[6,2,8,0,4,7,9,null,null,3,5]\n6', output: '6' },
    // additional
    { input: '[3,1,4,null,2]\n2', output: '2' },
    { input: '[3,1,4,null,2]\n3', output: '3' },
    { input: '[3,1,4,null,2]\n4', output: '4' },
    { input: '[3,1,4,null,2]\n5', output: 'null' },
  ],

  // -------------------------------------------------------------------------
  // 62. CONSTRUCT BINARY TREE FROM PREORDER AND INORDER TRAVERSAL
  // Input:  preorder (int[]) \n inorder (int[])
  // Output: BFS-null-array representing the tree
  // -------------------------------------------------------------------------
  'construct-binary-tree-from-preorder-and-inorder-traversal': [
    // samples
    { input: '[3,9,20,15,7]\n[9,3,15,20,7]',       output: '[3,9,20,null,null,15,7]'    },
    { input: '[-1]\n[-1]',                          output: '[-1]'                       },
    // basic
    { input: '[1]\n[1]',                            output: '[1]'                        },
    { input: '[1,2]\n[2,1]',                        output: '[1,2,null]'                 },
    { input: '[1,2]\n[1,2]',                        output: '[1,null,2]'                 },
    { input: '[1,2,3]\n[2,1,3]',                    output: '[1,2,3]'                    },
    { input: '[1,2,3]\n[1,2,3]',                    output: '[1,null,2,null,3]'          },
    { input: '[1,2,3]\n[3,2,1]',                    output: '[1,2,null,3,null]'          },
    // balanced trees
    { input: '[4,2,1,3,6,5,7]\n[1,2,3,4,5,6,7]',   output: '[4,2,6,1,3,5,7]'           },
    { input: '[1,2,4,5,3,6,7]\n[4,2,5,1,6,3,7]',   output: '[1,2,3,4,5,6,7]'           },
    // left-skewed
    { input: '[1,2,3,4]\n[4,3,2,1]',               output: '[1,2,null,3,null,4,null]'   },
    // right-skewed
    { input: '[1,2,3,4]\n[1,2,3,4]',               output: '[1,null,2,null,3,null,4]'   },
    // four nodes balanced
    { input: '[1,2,4,3]\n[4,2,1,3]',               output: '[1,2,3,4,null,null,null]'   },
    // five nodes
    { input: '[5,3,1,4,7]\n[1,3,4,5,7]',           output: '[5,3,7,1,4,null,null]'      },
    { input: '[3,9,20,15,7]\n[9,3,15,20,7]',        output: '[3,9,20,null,null,15,7]'    },
    // repeated cross-check
    { input: '[2,1,3]\n[1,2,3]',                   output: '[2,1,3]'                    },
    { input: '[2,1,3]\n[3,2,1]',                   output: '[2,1,null,null,null,null,3]' },
    // mixed
    { input: '[7,3,2,6,1,5]\n[2,3,6,7,5,1]',       output: '[7,3,1,2,6,5,null]'         },
    { input: '[5,1,3,2,4]\n[1,3,5,2,4]',           output: '[5,1,2,null,3,null,4]'      },
    // NeetCode example
    { input: '[3,9,20,15,7]\n[9,3,15,20,7]',        output: '[3,9,20,null,null,15,7]'    },
    // six nodes
    { input: '[1,2,4,5,3,6]\n[4,2,5,1,3,6]',       output: '[1,2,3,4,5,null,6]'         },
    // two levels
    { input: '[1,2,3]\n[2,1,3]',                   output: '[1,2,3]'                    },
    // various small trees
    { input: '[3,2,1]\n[1,2,3]',                   output: '[3,2,null,1,null]'           },
    { input: '[3,1,2]\n[1,3,2]',                   output: '[3,1,null,null,2]'           },
    { input: '[3,1,2]\n[3,1,2]',                   output: '[3,null,1,null,2]'           },
    { input: '[3,1,2]\n[2,1,3]',                   output: '[3,1,null,2,null]'           },
    // five balanced
    { input: '[4,2,1,3,5]\n[1,2,3,4,5]',           output: '[4,2,5,1,3,null,null]'      },
    // larger
    { input: '[10,5,3,7,20,15]\n[3,5,7,10,15,20]', output: '[10,5,20,3,7,15,null]'      },
    { input: '[100,50,200]\n[50,100,200]',          output: '[100,50,200]'               },
    { input: '[100,200,300]\n[200,100,300]',        output: '[100,200,300]'              },
    // stress
    { input: '[6,4,2,3,5,7,8]\n[2,3,4,5,6,7,8]',  output: '[6,4,7,2,5,null,8,null,3]'  },
    { input: '[5,4,3,2,1]\n[1,2,3,4,5]',           output: '[5,4,null,3,null,2,null,1]' },
    { input: '[1,2,3,4,5]\n[1,2,3,4,5]',           output: '[1,null,2,null,3,null,4,null,5]' },
  ],

  // -------------------------------------------------------------------------
  // 63. BINARY TREE MAXIMUM PATH SUM
  // Input:  root (int[] BFS-null)
  // Output: maximum path sum (int)
  // -------------------------------------------------------------------------
  'binary-tree-maximum-path-sum': [
    // samples
    { input: '[1,2,3]',                         output: '6'   },
    { input: '[-10,9,20,null,null,15,7]',        output: '42'  },
    // basic
    { input: '[1]',                             output: '1'   },
    { input: '[-3]',                            output: '-3'  },
    { input: '[0]',                             output: '0'   },
    { input: '[-1,-2,-3]',                      output: '-1'  },
    // single path along left
    { input: '[5,4,null,11,null,7,2]',           output: '22'  },
    { input: '[5,4,8,11,null,13,4,7,2,null,null,null,1]',
      output: '48' },
    // negative branching
    { input: '[2,-1,-2]',                       output: '2'   },
    { input: '[-1,2,-2]',                       output: '2'   },
    // path at leaf
    { input: '[1,2,null]',                      output: '3'   },
    { input: '[1,null,2]',                      output: '3'   },
    // two leaves both positive
    { input: '[1,5,5]',                         output: '11'  },
    // all negative
    { input: '[-1,-2,-3]',                      output: '-1'  },
    { input: '[-5,-4,-3]',                      output: '-3'  },
    { input: '[-3,-2,-1]',                      output: '-1'  },
    // mixed
    { input: '[10,-5,5,null,null,3,7]',          output: '22'  },
    { input: '[10,5,-5,3,7]',                   output: '22'  },
    { input: '[-2,1]',                          output: '1'   },
    { input: '[-2,null,1]',                     output: '1'   },
    { input: '[1,-2,3]',                        output: '4'   },
    { input: '[1,2,-3,4]',                      output: '7'   },
    // curved path (both subtrees contribute)
    { input: '[3,4,5]',                         output: '12'  },
    { input: '[5,4,3]',                         output: '12'  },
    { input: '[10,5,15,3,7,12,20]',             output: '47'  },
    // large values
    { input: '[1000,1000,1000]',                output: '3000'},
    { input: '[1000,-1,-1]',                    output: '1000'},
    { input: '[-1000,1000,1000]',               output: '2000'},
    // zero path
    { input: '[0,0,0]',                         output: '0'   },
    { input: '[0,-1,-1]',                       output: '0'   },
    // path goes through root
    { input: '[4,2,6,1,3,5,7]',                 output: '18'  },
    // path does not go through root
    { input: '[1,-2,-3,1,3,-2,null,-1]',        output: '4'   },
    // stress
    { input: '[9,6,-3,null,null,-6,2,null,null,2,null,-6,-6,-6]',
      output: '16' },
    { input: '[2,null,-1]',                     output: '2'   },
    { input: '[5,1,-2]',                        output: '6'   },
    { input: '[-2,-1,-3,4,null,null,5]',        output: '5'   },
    { input: '[8,null,-2,null,null,null,-3]',   output: '8'   },
    { input: '[30,null,10,null,null,5,null]',   output: '30'  },
    { input: '[5,4,1,8]',                       output: '17'  },
    { input: '[1,2,3,null,null,null,4]',        output: '8'   },
    { input: '[100,200,300,10,20,30,40]',       output: '660' },
    { input: '[5,-3,null,4,6]',                 output: '10'  },
    { input: '[-1,5,null,-2,4]',                output: '9'   },
    { input: '[7,4,5,null,null,3,-1]',          output: '16'  },
    { input: '[1,2,4,null,null,3,5]',           output: '13'  },
    { input: '[2,1,1,null,null,null,null]',     output: '4'   },
  ],

  // -------------------------------------------------------------------------
  // 64. BINARY TREE RIGHT SIDE VIEW
  // Input:  root (int[] BFS-null)
  // Output: int[] — rightmost value at each level
  // -------------------------------------------------------------------------
  'binary-tree-right-side-view': [
    // samples
    { input: '[1,2,3,null,5,null,4]', output: '[1,3,4]' },
    { input: '[1,null,3]',            output: '[1,3]'   },
    { input: '[]',                    output: '[]'      },
    // basic
    { input: '[1]',                   output: '[1]'     },
    { input: '[1,2,null]',            output: '[1,2]'   },
    { input: '[1,null,2]',            output: '[1,2]'   },
    { input: '[1,2,3]',               output: '[1,3]'   },
    // three levels
    { input: '[1,2,3,4,5,6,7]',       output: '[1,3,7]' },
    { input: '[1,2,3,null,null,null,4]', output: '[1,3,4]' },
    { input: '[1,2,3,4,null,null,null]', output: '[1,3,4]' },
    // left subtree only with deeper nodes
    { input: '[1,2,null,3,null]',     output: '[1,2,3]' },
    { input: '[1,2,null,3,null,4]',   output: '[1,2,3,4]' },
    // right subtree only
    { input: '[1,null,2,null,3]',     output: '[1,2,3]' },
    // full four levels
    { input: '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]', output: '[1,3,7,15]' },
    // skewed left deep
    { input: '[1,2,null,3,null,4,null,5]', output: '[1,2,3,4,5]' },
    // mixed depth
    { input: '[1,2,3,4,null,null,null,5]', output: '[1,3,4,5]' },
    { input: '[1,2,3,null,4,null,5]', output: '[1,3,5]' },
    // negative values
    { input: '[-1,-2,-3]',            output: '[-1,-3]'  },
    { input: '[-1,null,-3,null,-5]',  output: '[-1,-3,-5]' },
    // balanced BST-like
    { input: '[4,2,7,1,3,6,9]',       output: '[4,7,9]' },
    { input: '[5,3,8,1,4,7,9]',       output: '[5,8,9]' },
    // single branch
    { input: '[1,2,null,4,null]',     output: '[1,2,4]' },
    { input: '[1,null,2,null,4]',     output: '[1,2,4]' },
    // NeetCode examples
    { input: '[1,2,3,null,5,null,4]', output: '[1,3,4]' },
    // wider tree
    { input: '[1,2,3,4,5,6,7,8,null,null,10,11,null,null,7]',
      output: '[1,3,7,7]' },
    // stress
    { input: '[3,9,20,null,null,15,7]', output: '[3,20,7]'  },
    { input: '[1,2,3,4,null,6,7]',      output: '[1,3,7]'   },
    { input: '[0,1,null]',              output: '[0,1]'     },
    { input: '[0,null,1]',              output: '[0,1]'     },
    { input: '[10,5,15,3,7,null,18]',   output: '[10,15,18]'},
    { input: '[10,5,15,null,7,null,null]', output: '[10,15,7]' },
    { input: '[2,1,3]',                 output: '[2,3]'    },
    { input: '[2,null,3,null,4]',       output: '[2,3,4]'  },
    { input: '[2,3,null,4,null]',       output: '[2,3,4]'  },
    { input: '[5,3,null,null,4]',       output: '[5,3,4]'  },
    { input: '[5,null,3,4,null]',       output: '[5,3,4]'  },
    { input: '[1,2,3,null,4,null,null,null,5]', output: '[1,3,4,5]' },
    { input: '[1,2,null,3,4]',          output: '[1,2,4]'  },
    { input: '[1,null,2,3,4]',          output: '[1,2,4]'  },
  ],

  // -------------------------------------------------------------------------
  // 65. COUNT GOOD NODES IN BINARY TREE
  // Input:  root (int[] BFS-null)
  // Output: count of good nodes (int)
  //   A node X is "good" if there is no node > X on path from root to X
  // -------------------------------------------------------------------------
  'count-good-nodes-in-binary-tree': [
    // samples
    { input: '[3,1,4,3,null,1,5]', output: '4' },
    { input: '[3,3,null,4,2]',     output: '3' },
    { input: '[1]',                output: '1' },
    // basic
    { input: '[1,2,3]',            output: '3' },
    { input: '[3,1,2]',            output: '2' },
    { input: '[1,2,null]',         output: '2' },
    { input: '[2,1,null]',         output: '1' },
    { input: '[1,null,2]',         output: '2' },
    { input: '[2,null,1]',         output: '1' },
    // all good (ascending paths)
    { input: '[1,2,3,4,5,6,7]',    output: '7' },
    // left-skewed ascending
    { input: '[1,2,null,3,null]',  output: '3' },
    { input: '[1,2,null,0,null]',  output: '2' },
    // root always good
    { input: '[5,1,2]',            output: '1' },
    { input: '[5,6,4]',            output: '2' },
    { input: '[5,6,7]',            output: '3' },
    // deeper paths
    { input: '[3,3,null,4,2]',     output: '3' },
    { input: '[3,1,4,3,null,1,5]', output: '4' },
    // all equal
    { input: '[5,5,5,5,5,5,5]',   output: '7' },
    // all decreasing
    { input: '[5,4,3,2,1]',        output: '1' },
    // all increasing
    { input: '[1,2,3,4,5]',        output: '5' },
    // negative values
    { input: '[-1,-2,-3]',         output: '2' },
    { input: '[-3,-2,-1]',         output: '3' },
    { input: '[-1,-2,0]',          output: '2' },
    // good node has equal max
    { input: '[2,2,2]',            output: '3' },
    { input: '[2,2,null,2]',       output: '3' },
    { input: '[3,9,20,null,null,15,7]', output: '3' },
    { input: '[5,3,8,1,4,6,9]',   output: '4' },
    { input: '[5,4,6,3,5,5,7]',   output: '6' },
    { input: '[10,5,15,3,7,12,18]', output: '4' },
    // stress
    { input: '[2,1,1,1,1,1,1]',   output: '3' },
    { input: '[1,1,1,1,1,1,1]',   output: '7' },
    { input: '[7,6,5,4,3,2,1]',   output: '1' },
    { input: '[1,null,2,null,3,null,4]', output: '4' },
    { input: '[4,null,3,null,2,null,1]', output: '1' },
    { input: '[3,1,4,3,null,1,5,3]',    output: '5' },
    { input: '[-1,null,-2,null,-3]',    output: '1' },
    { input: '[-3,null,-2,null,-1]',    output: '3' },
    { input: '[0,1,null,2,null,3]',     output: '4' },
    { input: '[5,5,5,3,5,5,5]',        output: '6' },
    { input: '[2,4,1,3,5,null,null]',  output: '4' },
    { input: '[3,null,4,3,5]',         output: '3' },
    { input: '[4,3,null,2,null,1]',    output: '1' },
    { input: '[4,3,5,2,null,null,6]',  output: '3' },
    { input: '[9,3,7,1,4,6,8,null,2]', output: '5' },
  ],

  // -------------------------------------------------------------------------
  // 66. LOWEST COMMON ANCESTOR OF A BINARY SEARCH TREE
  // Input:  root (int[] BFS-null) \n p (int) \n q (int)
  // Output: LCA node value (int)
  // -------------------------------------------------------------------------
  'lowest-common-ancestor-of-a-binary-search-tree': [
    // samples
    { input: '[6,2,8,0,4,7,9,null,null,3,5]\n2\n8', output: '6' },
    { input: '[6,2,8,0,4,7,9,null,null,3,5]\n2\n4', output: '2' },
    { input: '[2,1,3]\n1\n3',                       output: '2' },
    // basic
    { input: '[2,1,3]\n1\n2',                       output: '2' },
    { input: '[2,1,3]\n2\n3',                       output: '2' },
    { input: '[2,1,null]\n1\n2',                    output: '2' },
    { input: '[2,null,3]\n2\n3',                    output: '2' },
    // p or q is root
    { input: '[6,2,8,0,4,7,9]\n6\n4',              output: '6' },
    { input: '[6,2,8,0,4,7,9]\n6\n8',              output: '6' },
    // both left
    { input: '[6,2,8,0,4,7,9]\n0\n4',              output: '2' },
    { input: '[6,2,8,0,4,7,9]\n0\n2',              output: '2' },
    { input: '[6,2,8,0,4,7,9]\n2\n4',              output: '2' },
    // both right
    { input: '[6,2,8,0,4,7,9]\n7\n9',              output: '8' },
    { input: '[6,2,8,0,4,7,9]\n8\n9',              output: '8' },
    { input: '[6,2,8,0,4,7,9]\n7\n8',              output: '8' },
    // split at root
    { input: '[6,2,8,0,4,7,9]\n0\n9',              output: '6' },
    { input: '[6,2,8,0,4,7,9]\n4\n7',              output: '6' },
    // deeper BST
    { input: '[10,5,15,3,7,12,18]\n3\n7',          output: '5' },
    { input: '[10,5,15,3,7,12,18]\n3\n5',          output: '5' },
    { input: '[10,5,15,3,7,12,18]\n5\n7',          output: '5' },
    { input: '[10,5,15,3,7,12,18]\n12\n18',        output: '15'},
    { input: '[10,5,15,3,7,12,18]\n12\n15',        output: '15'},
    { input: '[10,5,15,3,7,12,18]\n3\n18',         output: '10'},
    { input: '[10,5,15,3,7,12,18]\n5\n15',         output: '10'},
    // three-level
    { input: '[4,2,6,1,3,5,7]\n1\n3',              output: '2' },
    { input: '[4,2,6,1,3,5,7]\n1\n4',              output: '4' },
    { input: '[4,2,6,1,3,5,7]\n5\n7',              output: '6' },
    { input: '[4,2,6,1,3,5,7]\n1\n7',              output: '4' },
    { input: '[4,2,6,1,3,5,7]\n2\n6',              output: '4' },
    { input: '[4,2,6,1,3,5,7]\n3\n5',              output: '4' },
    // single branch
    { input: '[1,null,2,null,3]\n1\n3',            output: '1' },
    { input: '[1,null,2,null,3]\n2\n3',            output: '2' },
    { input: '[3,2,null,1,null]\n1\n3',            output: '3' },
    { input: '[3,2,null,1,null]\n1\n2',            output: '2' },
    // stress
    { input: '[20,10,30,5,15,25,35]\n5\n15',       output: '10'},
    { input: '[20,10,30,5,15,25,35]\n25\n35',      output: '30'},
    { input: '[20,10,30,5,15,25,35]\n5\n35',       output: '20'},
    { input: '[20,10,30,5,15,25,35]\n10\n30',      output: '20'},
    { input: '[20,10,30,5,15,25,35]\n10\n15',      output: '10'},
    { input: '[20,10,30,5,15,25,35]\n5\n10',       output: '10'},
    { input: '[6,2,8,0,4,7,9,null,null,3,5]\n3\n5',output: '4' },
    { input: '[6,2,8,0,4,7,9,null,null,3,5]\n0\n3',output: '0' },
    { input: '[6,2,8,0,4,7,9,null,null,3,5]\n0\n5',output: '2' },
    { input: '[6,2,8,0,4,7,9,null,null,3,5]\n4\n9',output: '6' },
    { input: '[6,2,8,0,4,7,9,null,null,3,5]\n3\n9',output: '6' },
    { input: '[2,1,3]\n1\n3',                      output: '2' },
  ],

  // -------------------------------------------------------------------------
  // 67. IMPLEMENT TRIE (PREFIX TREE)
  // Input:  ops (string[]) — "insert:word", "search:word", "startsWith:prefix"
  // Output: results (string[]) for search/startsWith, "null" for insert
  // -------------------------------------------------------------------------
  'implement-trie-prefix-tree': [
    // samples
    { input: '["insert:apple","search:apple","search:app","startsWith:app","insert:app","search:app"]',
      output: '["null","true","false","true","null","true"]' },
    // basic inserts and searches
    { input: '["insert:hello","search:hello","search:hell","startsWith:hell","startsWith:hello","search:world"]',
      output: '["null","true","false","true","true","false"]' },
    { input: '["insert:a","search:a","startsWith:a","search:b","startsWith:b"]',
      output: '["null","true","true","false","false"]' },
    // empty after construction
    { input: '["search:any"]',
      output: '["false"]' },
    { input: '["startsWith:any"]',
      output: '["false"]' },
    // multiple words
    { input: '["insert:word","insert:words","search:word","search:words","startsWith:word","search:wor"]',
      output: '["null","null","true","true","true","false"]' },
    // prefix matches multiple words
    { input: '["insert:car","insert:card","insert:care","search:car","search:card","search:care","startsWith:car","search:cars"]',
      output: '["null","null","null","true","true","true","true","false"]' },
    // single char searches
    { input: '["insert:a","insert:b","insert:c","search:a","search:b","search:c","search:d"]',
      output: '["null","null","null","true","true","true","false"]' },
    // prefix only
    { input: '["insert:the","search:th","startsWith:th","search:the","startsWith:the"]',
      output: '["null","false","true","true","true"]' },
    // long word
    { input: '["insert:abcdefghij","search:abcdefghij","search:abcdefghi","startsWith:abcdefghi","startsWith:abcdefghijk"]',
      output: '["null","true","false","true","false"]' },
    // duplicate insert
    { input: '["insert:test","insert:test","search:test","startsWith:test"]',
      output: '["null","null","true","true"]' },
    // varied vocab
    { input: '["insert:dog","insert:cat","insert:cap","search:dog","search:cat","search:cap","search:ca","startsWith:ca","startsWith:do","startsWith:co"]',
      output: '["null","null","null","true","true","true","false","true","true","false"]' },
    // all startsWith returning false
    { input: '["insert:hello","startsWith:world","startsWith:xyz"]',
      output: '["null","false","false"]' },
    // nested prefixes
    { input: '["insert:a","insert:ab","insert:abc","insert:abcd","search:a","search:ab","search:abc","search:abcd","search:abcde","startsWith:abcd","startsWith:abcde"]',
      output: '["null","null","null","null","true","true","true","true","false","true","false"]' },
    // non-overlapping words
    { input: '["insert:apple","insert:banana","search:apple","search:banana","search:appl","startsWith:ban","startsWith:app","startsWith:bana","startsWith:xyz"]',
      output: '["null","null","true","true","false","true","true","true","false"]' },
    // single-letter insertions
    { input: '["insert:x","insert:y","insert:z","search:x","search:y","search:z","search:w","startsWith:x","startsWith:w"]',
      output: '["null","null","null","true","true","true","false","true","false"]' },
    // case sensitivity (lowercase only)
    { input: '["insert:leetcode","search:lee","search:leetcode","startsWith:leetc","startsWith:leaf"]',
      output: '["null","false","true","true","false"]' },
    // building up words
    { input: '["insert:trie","insert:trigger","insert:trip","search:tri","search:trie","search:trigger","search:trip","startsWith:tri"]',
      output: '["null","null","null","false","true","true","true","true"]' },
    // repeated lookups
    { input: '["insert:abc","search:abc","search:abc","startsWith:ab","startsWith:abc","startsWith:abcd"]',
      output: '["null","true","true","true","true","false"]' },
    // empty prefix (startsWith "")
    { input: '["insert:anything","startsWith:","search:"]',
      output: '["null","true","false"]' },
  ],

  // -------------------------------------------------------------------------
  // 68. HOUSE ROBBER
  // Input:  nums (int[])
  // Output: maximum amount (int)
  // -------------------------------------------------------------------------
  'house-robber': [
    // samples
    { input: '[1,2,3,1]',      output: '4'  },
    { input: '[2,7,9,3,1]',    output: '12' },
    // basic
    { input: '[0]',            output: '0'  },
    { input: '[1]',            output: '1'  },
    { input: '[10]',           output: '10' },
    { input: '[1,2]',          output: '2'  },
    { input: '[2,1]',          output: '2'  },
    { input: '[5,5]',          output: '5'  },
    // three houses
    { input: '[1,2,3]',        output: '4'  },
    { input: '[3,2,1]',        output: '4'  },
    { input: '[2,1,3]',        output: '5'  },
    { input: '[1,100,1]',      output: '100'},
    { input: '[10,1,10]',      output: '20' },
    { input: '[1,10,1]',       output: '10' },
    // four houses
    { input: '[1,2,3,4]',      output: '6'  },
    { input: '[4,3,2,1]',      output: '6'  },
    { input: '[2,1,1,2]',      output: '4'  },
    { input: '[5,1,1,5]',      output: '10' },
    // alternating
    { input: '[10,1,10,1,10]', output: '30' },
    { input: '[1,10,1,10,1]',  output: '20' },
    // all zeros
    { input: '[0,0,0,0,0]',    output: '0'  },
    // large gap
    { input: '[100,1,1,100]',  output: '200'},
    { input: '[1,100,1,1,100]',output: '200'},
    // increasing
    { input: '[1,2,3,4,5,6,7,8,9,10]',  output: '30' },
    // decreasing
    { input: '[10,9,8,7,6,5,4,3,2,1]',  output: '30' },
    // all same
    { input: '[5,5,5,5,5,5]',  output: '15' },
    { input: '[3,3,3,3,3]',    output: '9'  },
    // stress
    { input: '[2,7,9,3,1]',    output: '12' },
    { input: '[1,3,1,3,100]',  output: '103'},
    { input: '[5,3,4,11,2]',   output: '16' },
    { input: '[2,3,2]',        output: '3'  },
    { input: '[2,4,6,2,5]',    output: '13' },
    { input: '[2,1,1,2,9,1,3,2,1,1]', output: '17' },
    { input: '[10,1,1,10,1,1,10]',    output: '30' },
    { input: '[100,1,100,1,100]',     output: '300'},
    { input: '[2,3,4,5,6]',    output: '12' },
    { input: '[6,5,4,3,2]',    output: '12' },
    { input: '[10,10,10,10,10]', output: '30' },
    { input: '[0,1,0,1,0]',    output: '2'  },
    { input: '[1,0,1,0,1]',    output: '3'  },
    { input: '[3,4,2,3,5,2,1]',output: '12' },
    { input: '[183,219,57,193,94,233,202,154,65,240,97,234,100,249,186,66,90,238,168,128,177,235,50,81,185,165,217,207,88,80,112,78,135,62,228,247,211]',
      output: '3365' },
    { input: '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]', output: '110' },
    { input: '[2,2,2,2,2,2,2,2,2,2]', output: '10' },
  ],

  // -------------------------------------------------------------------------
  // 69. HOUSE ROBBER II
  // Input:  nums (int[]) — circular arrangement
  // Output: maximum amount (int)
  // -------------------------------------------------------------------------
  'house-robber-ii': [
    // samples
    { input: '[2,3,2]',        output: '3'  },
    { input: '[1,2,3,1]',      output: '4'  },
    { input: '[1,2,3]',        output: '3'  },
    // single house
    { input: '[1]',            output: '1'  },
    { input: '[0]',            output: '0'  },
    { input: '[5]',            output: '5'  },
    // two houses (take max)
    { input: '[1,2]',          output: '2'  },
    { input: '[2,1]',          output: '2'  },
    { input: '[5,5]',          output: '5'  },
    { input: '[3,7]',          output: '7'  },
    // three houses
    { input: '[1,2,3]',        output: '3'  },
    { input: '[3,2,1]',        output: '3'  },
    { input: '[2,3,2]',        output: '3'  },
    { input: '[1,100,1]',      output: '100'},
    { input: '[10,1,10]',      output: '10' },
    // four houses
    { input: '[1,2,3,4]',      output: '6'  },
    { input: '[4,3,2,1]',      output: '6'  },
    { input: '[2,1,1,2]',      output: '3'  },
    { input: '[5,1,1,5]',      output: '6'  },
    // five houses
    { input: '[2,7,9,3,1]',    output: '11' },
    { input: '[1,2,3,4,5]',    output: '8'  },
    { input: '[5,4,3,2,1]',    output: '8'  },
    // alternating
    { input: '[10,1,10,1,10]', output: '20' },
    { input: '[1,10,1,10,1]',  output: '20' },
    // all zeros
    { input: '[0,0,0,0]',      output: '0'  },
    // all same
    { input: '[5,5,5,5,5]',    output: '10' },
    { input: '[3,3,3,3]',      output: '6'  },
    // large gap (circular constraint matters)
    { input: '[100,1,1,100]',  output: '101'},
    { input: '[1,100,1,1,100]',output: '200'},
    // stress
    { input: '[200,3,140,20,10]', output: '340' },
    { input: '[1,3,1,3,100]',  output: '103'},
    { input: '[94,40,49,65,21,21,106,80,92,81,679,4,61,6,237,12,72,74,29,95,265,35,47,1,61,397,52,72,37,4,78,44,54,59,282,35,61,29]',
      output: '2696' },
    { input: '[10,10,10,10,10,10]', output: '30' },
    { input: '[6,5,4,3,2,1]',  output: '12' },
    { input: '[1,2,3,4,5,6]',  output: '12' },
    { input: '[3,3,3]',        output: '3'  },
    { input: '[4,4,4]',        output: '4'  },
    { input: '[2,3,2,3,2]',    output: '6'  },
    { input: '[3,2,3,2,3]',    output: '9'  },
    { input: '[1,1,1,1,1]',    output: '2'  },
    { input: '[10,5,1,9,7]',   output: '17' },
    { input: '[10,5,1,9,7,2]', output: '20' },
    { input: '[2,2,2,2]',      output: '4'  },
    { input: '[1,2,1,2,1,2,1]',output: '6'  },
    { input: '[5,3,5,3,5]',    output: '10' },
  ],

  // -------------------------------------------------------------------------
  // 70. LONGEST PALINDROMIC SUBSTRING
  // Input:  s (string)
  // Output: length of longest palindromic substring (int)
  //   (Using length to avoid ambiguity when multiple palindromes of same length exist)
  // -------------------------------------------------------------------------
  'longest-palindromic-substring': [
    // samples (we return length for determinism)
    { input: '"babad"', output: '3' },
    { input: '"cbbd"',  output: '2' },
    // basic
    { input: '"a"',     output: '1' },
    { input: '"aa"',    output: '2' },
    { input: '"ab"',    output: '1' },
    { input: '"aba"',   output: '3' },
    { input: '"aab"',   output: '2' },
    { input: '"baa"',   output: '2' },
    { input: '"abba"',  output: '4' },
    { input: '"abbc"',  output: '2' },
    // all same
    { input: '"aaaa"',  output: '4' },
    { input: '"aaaaa"', output: '5' },
    // no palindrome longer than 1
    { input: '"abcd"',  output: '1' },
    { input: '"abcde"', output: '1' },
    // odd palindrome in middle
    { input: '"xabax"', output: '5' },
    { input: '"xabay"', output: '3' },
    // even palindrome
    { input: '"xaabbx"',output: '6' },
    { input: '"xaabby"',output: '4' },
    // palindrome at start
    { input: '"aaabcd"',output: '3' },
    // palindrome at end
    { input: '"dcbaaa"',output: '3' },
    // longer strings
    { input: '"racecar"',output: '7' },
    { input: '"racecars"', output: '7' },
    { input: '"madam"',  output: '5' },
    { input: '"madams"', output: '5' },
    // single char repeated
    { input: '"aaaaaaaaa"', output: '9' },
    // mixed
    { input: '"abcba"',  output: '5' },
    { input: '"abcbad"', output: '5' },
    { input: '"abcbadcba"', output: '5' },
    // classic
    { input: '"civilwartestingwhetherthatnaptionoranynationsoconceivedandsodedicatedcanlongendure"',
      output: '7' },
    { input: '"noon"',    output: '4' },
    { input: '"noone"',   output: '4' },
    { input: '"kayak"',   output: '5' },
    { input: '"kayaks"',  output: '5' },
    { input: '"level"',   output: '5' },
    { input: '"levelup"', output: '5' },
    // stress
    { input: '"bananas"', output: '5' },
    { input: '"amanaplanacanalpanama"', output: '19' },
    { input: '"tattarrattat"', output: '12' },
    { input: '"zzz"',     output: '3' },
    { input: '"zzzz"',    output: '4' },
    { input: '"abacaba"', output: '7' },
    { input: '"abacabas"',output: '7' },
    { input: '"abacd"',   output: '3' },
    { input: '"abcbca"',  output: '5' },
    { input: '"xyzyx"',   output: '5' },
    { input: '"xyzyxz"',  output: '5' },
    { input: '"ccc"',     output: '3' },
    { input: '"cbbc"',    output: '4' },
    { input: '"cbbcd"',   output: '4' },
    { input: '"aacabdkacaa"', output: '3' },
    { input: '"bb"',      output: '2' },
  ],

  // -------------------------------------------------------------------------
  // SERIALIZE AND DESERIALIZE BINARY TREE
  // Input:  root (int[] BFS-null serialized string)
  // Output: same BFS-null serialized string (round-trip check)
  // -------------------------------------------------------------------------
  'serialize-and-deserialize-binary-tree': [
    { input: '[1,2,3,null,null,4,5]',              output: '[1,2,3,null,null,4,5]'       },
    { input: '[]',                                 output: '[]'                          },
    { input: '[1]',                                output: '[1]'                         },
    { input: '[1,2,null]',                         output: '[1,2,null]'                  },
    { input: '[1,null,2]',                         output: '[1,null,2]'                  },
    { input: '[1,2,3]',                            output: '[1,2,3]'                     },
    { input: '[1,2,3,4,5,6,7]',                    output: '[1,2,3,4,5,6,7]'             },
    { input: '[3,9,20,null,null,15,7]',             output: '[3,9,20,null,null,15,7]'     },
    { input: '[-1,-2,-3]',                         output: '[-1,-2,-3]'                  },
    { input: '[1,null,2,null,3,null,4]',            output: '[1,null,2,null,3,null,4]'    },
    { input: '[4,3,null,2,null,1]',                output: '[4,3,null,2,null,1]'         },
    { input: '[1,2,3,4,null,null,5]',              output: '[1,2,3,4,null,null,5]'       },
    { input: '[5,4,8,11,null,13,4,7,2,null,null,null,1]',
      output: '[5,4,8,11,null,13,4,7,2,null,null,null,1]' },
    { input: '[10,5,15,3,7,12,18]',                output: '[10,5,15,3,7,12,18]'         },
    { input: '[0]',                                output: '[0]'                         },
    { input: '[-3,5,null,-8,10]',                  output: '[-3,5,null,-8,10]'           },
    { input: '[100]',                              output: '[100]'                       },
    { input: '[1,1,1,1,1,1,1]',                    output: '[1,1,1,1,1,1,1]'             },
    { input: '[2,1,3,null,null,null,4]',            output: '[2,1,3,null,null,null,4]'    },
    { input: '[4,2,6,1,3,5,7]',                    output: '[4,2,6,1,3,5,7]'             },
    { input: '[1,2,3,null,4,null,5]',              output: '[1,2,3,null,4,null,5]'       },
    { input: '[6,2,8,0,4,7,9,null,null,3,5]',       output: '[6,2,8,0,4,7,9,null,null,3,5]' },
    { input: '[-10,9,20,null,null,15,7]',           output: '[-10,9,20,null,null,15,7]'   },
    { input: '[1,2,3,4,5]',                        output: '[1,2,3,4,5]'                 },
    { input: '[5,3,6,2,4,null,null,1]',             output: '[5,3,6,2,4,null,null,1]'     },
    { input: '[0,-1,1,-2,null,null,2]',             output: '[0,-1,1,-2,null,null,2]'     },
    { input: '[7,null,7,null,7,null,7]',            output: '[7,null,7,null,7,null,7]'    },
    { input: '[3,5,1,6,2,0,8,null,null,7,4]',       output: '[3,5,1,6,2,0,8,null,null,7,4]' },
    { input: '[2,null,3,null,null,null,4]',         output: '[2,null,3,null,null,null,4]' },
    { input: '[1,2,null,3,null,null,null,4]',       output: '[1,2,null,3,null,null,null,4]' },
    { input: '[1,null,null]',                      output: '[1]'                         },
    { input: '[1,2,3,null,null,4,null,null,5]',    output: '[1,2,3,null,null,4,null,null,5]' },
    { input: '[10,9,null,8,null,7,null,6]',        output: '[10,9,null,8,null,7,null,6]' },
    { input: '[1,0,-1]',                           output: '[1,0,-1]'                    },
    { input: '[4,2,7,1,3,6,9]',                    output: '[4,2,7,1,3,6,9]'             },
    { input: '[8,3,10,1,6,null,14,null,null,4,7,13]',
      output: '[8,3,10,1,6,null,14,null,null,4,7,13]' },
    { input: '[2,1,null,null,3]',                  output: '[2,1,null,null,3]'           },
    { input: '[5,null,6,null,null,4,7]',           output: '[5,null,6,null,null,4,7]'   },
    { input: '[50,25,75,10,30,60,90]',             output: '[50,25,75,10,30,60,90]'      },
    { input: '[1,2,3,4,5,6,7,8,9,10]',             output: '[1,2,3,4,5,6,7,8,9,10]'     },
    { input: '[-1,null,-2,null,-3]',               output: '[-1,null,-2,null,-3]'        },
    { input: '[-1,-2,null,null,-3]',               output: '[-1,-2,null,null,-3]'        },
    { input: '[1,2,3,null,null,5,null,null,6]',    output: '[1,2,3,null,null,5,null,null,6]' },
    { input: '[9,3,20,null,null,15,7,null,null,null,null,null,null,null,1]',
      output: '[9,3,20,null,null,15,7]' },
    { input: '[2,4,5,3,1,null,null]',              output: '[2,4,5,3,1,null,null]'       },
    { input: '[4,1,null,null,2,null,3]',           output: '[4,1,null,null,2,null,3]'   },
    { input: '[99]',                               output: '[99]'                        },
    { input: '[1,2,null,4,null,8,null]',           output: '[1,2,null,4,null,8,null]'   },
    { input: '[1,null,3,null,null,2,4]',           output: '[1,null,3,null,null,2,4]'   },
    { input: '[5,2,null,1,null]',                  output: '[5,2,null,1,null]'           },
    { input: '[1,2,3,4]',                          output: '[1,2,3,4]'                   },
  ],

  // -------------------------------------------------------------------------
  // DESIGN ADD AND SEARCH WORDS DATA STRUCTURE
  // Input:  ops (string[]) — "addWord:word" | "search:pattern" (. = wildcard)
  // Output: results (string[]) — "null" for addWord, "true"/"false" for search
  // -------------------------------------------------------------------------
  'design-add-and-search-words-data-structure': [
    { input: '["addWord:bad","addWord:dad","addWord:mad","search:pad","search:bad","search:.ad","search:b.."]',
      output: '["null","null","null","false","true","true","true"]' },
    { input: '["addWord:a","search:a","search:.","search:aa"]',
      output: '["null","true","true","false"]' },
    { input: '["search:any"]',
      output: '["false"]' },
    { input: '["addWord:hello","search:hello","search:hell","search:....o","search:.....","search:world"]',
      output: '["null","true","false","true","true","false"]' },
    { input: '["addWord:abc","search:abc","search:a..","search:.b.","search:..c","search:...","search:ab"]',
      output: '["null","true","true","true","true","true","false"]' },
    { input: '["addWord:at","addWord:and","addWord:an","addWord:add","search:a","search:.at","search:an.","search:.n.","search:..."]',
      output: '["null","null","null","null","false","true","true","true","true"]' },
    { input: '["addWord:word","search:.or.","search:w..d","search:...."]',
      output: '["null","true","true","true"]' },
    { input: '["addWord:dog","addWord:cat","search:d.g","search:c.t","search:.at","search:.og","search:...","search:d..","search:cat"]',
      output: '["null","null","true","true","true","true","true","true","true"]' },
    { input: '["addWord:ab","addWord:cd","addWord:ef","search:..","search:ab","search:ac"]',
      output: '["null","null","null","true","true","false"]' },
    { input: '["addWord:run","addWord:ran","addWord:rug","search:r.n","search:ru.","search:r..","search:..."]',
      output: '["null","null","null","true","true","true","true"]' },
    { input: '["addWord:apple","addWord:apply","addWord:apt","search:appl.","search:app..","search:.....","search:app"]',
      output: '["null","null","null","true","true","true","false"]' },
    { input: '["addWord:x","search:x","search:.","search:xx"]',
      output: '["null","true","true","false"]' },
    { input: '["addWord:abc","addWord:abc","search:abc","search:a..","search:..."]',
      output: '["null","null","true","true","true"]' },
    { input: '["addWord:abc","search:xyz","search:...","search:ab.","search:.bc"]',
      output: '["null","false","true","true","true"]' },
    { input: '["addWord:see","addWord:sea","addWord:so","search:s..","search:se.","search:s.a","search:.ee"]',
      output: '["null","null","null","true","true","true","true"]' },
    { input: '["addWord:a","addWord:aa","addWord:aaa","search:.","search:..","search:...","search:...."]',
      output: '["null","null","null","true","true","true","false"]' },
    { input: '["addWord:coding","search:c.....","search:......","search:co.ing","search:.oding"]',
      output: '["null","true","true","true","true"]' },
    { input: '["addWord:bad","search:b.d","search:...","search:b..","search:.ad","search:bad","search:bads"]',
      output: '["null","true","true","true","true","true","false"]' },
    { input: '["addWord:test","addWord:testing","search:test","search:t...","search:t......","search:.est...."]',
      output: '["null","null","true","true","true","true"]' },
    { input: '["addWord:one","addWord:two","addWord:three","search:.ne","search:tw.","search:t....","search:...","search:o.e"]',
      output: '["null","null","null","true","true","true","true","true"]' },
    { input: '["addWord:abc","search:a.c","search:...","search:abc."]',
      output: '["null","true","true","false"]' },
  ],

  // -------------------------------------------------------------------------
  // WORD SEARCH II
  // Input:  board (char[][] as JSON) \n words (string[])
  // Output: found words (string[], sorted)
  // -------------------------------------------------------------------------
  'word-search-ii': [
    { input: '[["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]]\n["oath","pea","eat","rain"]',
      output: '["eat","oath"]' },
    { input: '[["a","b"],["c","d"]]\n["abcb"]',
      output: '[]' },
    { input: '[["a"]]\n["a"]',
      output: '["a"]' },
    { input: '[["a"]]\n["b"]',
      output: '[]' },
    { input: '[["a","b"],["c","d"]]\n["ab","cd","ac","bd","abdc","abcd"]',
      output: '["ab","abdc","ac","cd"]' },
    { input: '[["a","b","c"],["a","e","d"],["a","f","g"]]\n["abcdefg","gfedcba","eaabcdgf"]',
      output: '["abcdefg","eaabcdgf","gfedcba"]' },
    { input: '[["o","a","b","n"],["o","t","a","e"],["a","h","k","r"],["a","f","l","v"]]\n["oa","oaa"]',
      output: '["oa","oaa"]' },
    { input: '[["a","b","c","e"],["s","f","c","s"],["a","d","e","e"]]\n["abcced","see","abcb"]',
      output: '["abcced","see"]' },
    { input: '[["a","a","a","a"],["a","a","a","a"],["a","a","a","a"]]\n["aaaaaaaaaaaa"]',
      output: '[]' },
    { input: '[["a","a","a","a"],["a","a","a","a"],["a","a","a","a"]]\n["aaaa"]',
      output: '["aaaa"]' },
    { input: '[["a","b","c"],["d","e","f"],["g","h","i"]]\n["abc","def","ghi","aei","ceg"]',
      output: '["abc","def","ghi"]' },
    { input: '[["c","a","a"],["a","a","a"],["b","c","d"]]\n["a","aa","aaa","aaaa","aaaaa"]',
      output: '["a","aa","aaa","aaaa","aaaaa"]' },
    { input: '[["a","b"],["a","b"]]\n["ab","aab","abb","ba"]',
      output: '["aab","ab","ba"]' },
    { input: '[["z"]]\n["z","zz"]',
      output: '["z"]' },
    { input: '[["a","b","c","d"],["e","f","g","h"],["i","j","k","l"],["m","n","o","p"]]\n["abfj","abcd","mnop","dcba"]',
      output: '["abcd","abfj","mnop"]' },
    { input: '[["t","h","i","s"],["i","s","o","n"],["l","y","a","t"],["e","s","t","!"]]\n["this","is","only","a","test"]',
      output: '["a","is","only","this"]' },
    { input: '[["a","b"],["c","d"]]\n["ac","ca","bd","db","abdc","cdba"]',
      output: '["abdc","ac","bd","ca","cdba","db"]' },
    { input: '[["a","b","c"],["d","e","f"],["g","h","i"]]\n["abcfedghi","ghidefeabc"]',
      output: '["abcfedghi"]' },
    { input: '[["a","b","c"],["d","e","f"],["g","h","i"]]\n["aei","beh","cfi","adg","beh","cfi"]',
      output: '["adg","aei","beh","cfi"]' },
    { input: '[["a","b","c","e"],["s","f","e","s"],["a","d","e","e"]]\n["abceseeefs","abcefsfs"]',
      output: '["abceseeefs","abcefsfs"]' },
    { input: '[["a","a"],["a","a"]]\n["aaa"]',
      output: '["aaa"]' },
  ],

  // -------------------------------------------------------------------------
  // 74. PALINDROMIC SUBSTRINGS
  // Input:  s (string)
  // Output: count of palindromic substrings (int)
  // -------------------------------------------------------------------------
  'palindromic-substrings': [
    { input: '"abc"',       output: '3'  },
    { input: '"aaa"',       output: '6'  },
    { input: '"a"',         output: '1'  },
    { input: '"aa"',        output: '3'  },
    { input: '"ab"',        output: '2'  },
    { input: '"aba"',       output: '4'  },
    { input: '"abba"',      output: '6'  },
    { input: '"abcd"',      output: '4'  },
    { input: '"aaaa"',      output: '10' },
    { input: '"aab"',       output: '4'  },
    { input: '"baa"',       output: '4'  },
    { input: '"abbc"',      output: '5'  },
    { input: '"abcba"',     output: '7'  },
    { input: '"racecar"',   output: '10' },
    { input: '"madam"',     output: '7'  },
    { input: '"noon"',      output: '6'  },
    { input: '"level"',     output: '7'  },
    { input: '"kayak"',     output: '7'  },
    { input: '"aabaa"',     output: '9'  },
    { input: '"aabaaa"',    output: '13' },
    { input: '"aaaaaa"',    output: '21' },
    { input: '"zzz"',       output: '6'  },
    { input: '"xyzyx"',     output: '7'  },
    { input: '"abacaba"',   output: '11' },
    { input: '"cbbd"',      output: '4'  },
    { input: '"babad"',     output: '7'  },
    { input: '"xaabax"',    output: '9'  },
    { input: '"aaaa"',      output: '10' },
    { input: '"abcb"',      output: '5'  },
    { input: '"aaab"',      output: '7'  },
    { input: '"baaa"',      output: '7'  },
    { input: '"aabb"',      output: '6'  },
    { input: '"bbaa"',      output: '6'  },
    { input: '"abcbc"',     output: '7'  },
    { input: '"ccc"',       output: '6'  },
    { input: '"cccc"',      output: '10' },
    { input: '"abcbca"',    output: '10' },
    { input: '"xyzzyx"',    output: '9'  },
    { input: '"tattarrattat"', output: '30' },
    { input: '"zz"',        output: '3'  },
    { input: '"zzzz"',      output: '10' },
    { input: '"aba"',       output: '4'  },
    { input: '"abba"',      output: '6'  },
    { input: '"abcde"',     output: '5'  },
    { input: '"aabba"',     output: '8'  },
    { input: '"aabbaa"',    output: '11' },
    { input: '"x"',         output: '1'  },
    { input: '"xx"',        output: '3'  },
    { input: '"xxx"',       output: '6'  },
    { input: '"xyx"',       output: '4'  },
    { input: '"xyxy"',      output: '6'  },
    { input: '"abcba"',     output: '7'  },
    { input: '"pqrqp"',     output: '7'  },
    { input: '"aababaa"',   output: '14' },
    { input: '"abacab"',    output: '9'  },
    { input: '"qwerty"',    output: '6'  },
    { input: '"qwertyq"',   output: '8'  },
    { input: '"aba"',       output: '4'  },
    { input: '"abcbad"',    output: '8'  },
    { input: '"aaabaa"',    output: '13' },
    { input: '"eabcba"',    output: '10' },
    { input: '"racecarracecar"', output: '25' },
  ],

  // -------------------------------------------------------------------------
  // 75. DECODE WAYS
  // Input:  s (string of digits)
  // Output: number of decodings (int)
  // -------------------------------------------------------------------------
  'decode-ways': [
    { input: '"12"',          output: '2'  },
    { input: '"226"',         output: '3'  },
    { input: '"06"',          output: '0'  },
    { input: '"0"',           output: '0'  },
    { input: '"1"',           output: '1'  },
    { input: '"2"',           output: '1'  },
    { input: '"9"',           output: '1'  },
    { input: '"10"',          output: '1'  },
    { input: '"11"',          output: '2'  },
    { input: '"19"',          output: '2'  },
    { input: '"20"',          output: '1'  },
    { input: '"21"',          output: '2'  },
    { input: '"26"',          output: '2'  },
    { input: '"27"',          output: '1'  },
    { input: '"30"',          output: '0'  },
    { input: '"100"',         output: '0'  },
    { input: '"101"',         output: '1'  },
    { input: '"110"',         output: '1'  },
    { input: '"111"',         output: '3'  },
    { input: '"121"',         output: '3'  },
    { input: '"123"',         output: '3'  },
    { input: '"200"',         output: '0'  },
    { input: '"211"',         output: '2'  },
    { input: '"2101"',        output: '1'  },
    { input: '"2611055971756562"', output: '4' },
    { input: '"11111"',       output: '8'  },
    { input: '"111111"',      output: '13' },
    { input: '"1111"',        output: '5'  },
    { input: '"1212"',        output: '5'  },
    { input: '"2121"',        output: '4'  },
    { input: '"2626"',        output: '4'  },
    { input: '"1111111111"',  output: '89' },
    { input: '"10"',          output: '1'  },
    { input: '"1001"',        output: '0'  },
    { input: '"1010"',        output: '1'  },
    { input: '"301"',         output: '0'  },
    { input: '"2201"',        output: '1'  },
    { input: '"1201"',        output: '1'  },
    { input: '"1220"',        output: '1'  },
    { input: '"2620"',        output: '1'  },
    { input: '"231"',         output: '2'  },
    { input: '"1326"',        output: '4'  },
    { input: '"1230"',        output: '1'  },
    { input: '"1260"',        output: '1'  },
    { input: '"27"',          output: '1'  },
    { input: '"235"',         output: '2'  },
    { input: '"1111111"',     output: '21' },
    { input: '"1221"',        output: '5'  },
    { input: '"2211"',        output: '4'  },
    { input: '"3"',           output: '1'  },
    { input: '"19"',          output: '2'  },
    { input: '"1919"',        output: '4'  },
    { input: '"1201234"',     output: '3'  },
    { input: '"102"',         output: '1'  },
    { input: '"1026"',        output: '2'  },
    { input: '"10206"',       output: '1'  },
    { input: '"2222"',        output: '5'  },
    { input: '"22222"',       output: '8'  },
    { input: '"26262"',       output: '4'  },
    { input: '"12012"',       output: '2'  },
    { input: '"1110"',        output: '2'  },
    { input: '"11100"',       output: '0'  },
  ],

  // -------------------------------------------------------------------------
  // 76. COIN CHANGE
  // Input:  coins (int[]) \n amount (int)
  // Output: min coins or -1 (int)
  // -------------------------------------------------------------------------
  'coin-change': [
    { input: '[1,2,5]\n11',     output: '3'  },
    { input: '[2]\n3',          output: '-1' },
    { input: '[1]\n0',          output: '0'  },
    { input: '[1]\n1',          output: '1'  },
    { input: '[1]\n5',          output: '5'  },
    { input: '[2]\n2',          output: '1'  },
    { input: '[2]\n4',          output: '2'  },
    { input: '[1,2]\n3',        output: '2'  },
    { input: '[1,2,5]\n0',      output: '0'  },
    { input: '[1,2,5]\n5',      output: '1'  },
    { input: '[1,2,5]\n6',      output: '2'  },
    { input: '[1,2,5]\n10',     output: '2'  },
    { input: '[1,2,5]\n11',     output: '3'  },
    { input: '[2,5,10,1]\n27',  output: '4'  },
    { input: '[3,7,405,436]\n8839', output: '25' },
    { input: '[186,419,83,408]\n6249', output: '20' },
    { input: '[1,5,10,25]\n30', output: '2'  },
    { input: '[1,5,10,25]\n31', output: '3'  },
    { input: '[1,5,10,25]\n100',output: '4'  },
    { input: '[5,10,25]\n30',   output: '2'  },
    { input: '[5,10,25]\n3',    output: '-1' },
    { input: '[2,5]\n3',        output: '-1' },
    { input: '[2,5]\n6',        output: '3'  },
    { input: '[2,5]\n10',       output: '2'  },
    { input: '[2,5]\n11',       output: '-1' },
    { input: '[3]\n6',          output: '2'  },
    { input: '[3]\n7',          output: '-1' },
    { input: '[1,2,3]\n6',      output: '2'  },
    { input: '[1,3,4,5]\n7',    output: '2'  },
    { input: '[2,4]\n8',        output: '2'  },
    { input: '[2,4]\n7',        output: '-1' },
    { input: '[1,5,10]\n15',    output: '2'  },
    { input: '[1,5,10]\n14',    output: '5'  },
    { input: '[1,5,10]\n11',    output: '2'  },
    { input: '[1,5,10]\n9',     output: '5'  },
    { input: '[1,5,10]\n20',    output: '2'  },
    { input: '[10]\n100',       output: '10' },
    { input: '[10]\n99',        output: '-1' },
    { input: '[1,7,10]\n14',    output: '2'  },
    { input: '[1,7,10]\n21',    output: '3'  },
    { input: '[2]\n0',          output: '0'  },
    { input: '[5,10]\n15',      output: '2'  },
    { input: '[5,10]\n20',      output: '2'  },
    { input: '[5,10]\n25',      output: '3'  },
    { input: '[6,9,10]\n11',    output: '-1' },
    { input: '[6,9,10]\n12',    output: '2'  },
    { input: '[6,9,10]\n15',    output: '-1' },
    { input: '[6,9,10]\n18',    output: '2'  },
    { input: '[3,5,7]\n11',     output: '3'  },
    { input: '[3,5,7]\n21',     output: '3'  },
    { input: '[1,4,5]\n8',      output: '2'  },
    { input: '[1,4,5]\n12',     output: '3'  },
    { input: '[2,3,6,7]\n7',    output: '1'  },
    { input: '[2,3,6,7]\n12',   output: '2'  },
    { input: '[2,3,6,7]\n14',   output: '2'  },
    { input: '[2,3,6,7]\n11',   output: '2'  },
    { input: '[1,2,5]\n100',    output: '20' },
    { input: '[1,3,4]\n6',      output: '2'  },
    { input: '[1,3,4]\n7',      output: '2'  },
    { input: '[1,3,4]\n11',     output: '3'  },
    { input: '[25,10,5,1]\n41', output: '4'  },
    { input: '[25,10,5,1]\n99', output: '9'  },
  ],

  // -------------------------------------------------------------------------
  // 77. MAXIMUM PRODUCT SUBARRAY
  // Input:  nums (int[])
  // Output: maximum product (int)
  // -------------------------------------------------------------------------
  'maximum-product-subarray': [
    { input: '[2,3,-2,4]',         output: '6'    },
    { input: '[-2,0,-1]',          output: '0'    },
    { input: '[-2]',               output: '-2'   },
    { input: '[0]',                output: '0'    },
    { input: '[1]',                output: '1'    },
    { input: '[2]',                output: '2'    },
    { input: '[1,2]',              output: '2'    },
    { input: '[-1,2]',             output: '2'    },
    { input: '[2,-1]',             output: '2'    },
    { input: '[-2,3]',             output: '3'    },
    { input: '[-1,-2]',            output: '2'    },
    { input: '[-1,-2,-3]',         output: '6'    },
    { input: '[2,3,4]',            output: '24'   },
    { input: '[-2,3,-4]',          output: '24'   },
    { input: '[2,-5,-2,-4,3]',     output: '24'   },
    { input: '[3,-1,4]',           output: '4'    },
    { input: '[-2,-3,-4]',         output: '12'   },
    { input: '[-1,-3,-10,0,60]',   output: '60'   },
    { input: '[0,2]',              output: '2'    },
    { input: '[0,-1]',             output: '0'    },
    { input: '[-1,0,-1]',          output: '0'    },
    { input: '[-2,-3,7]',          output: '42'   },
    { input: '[1,0,1]',            output: '1'    },
    { input: '[-1,-1,1]',          output: '1'    },
    { input: '[-1,1,-1]',          output: '1'    },
    { input: '[2,3,-2,4,-1]',      output: '48'   },
    { input: '[-4,-3,-2]',         output: '12'   },
    { input: '[6,-3,-10,0,2]',     output: '180'  },
    { input: '[-2,0,-1,0,1,2,3,0,-1,-2,0,-1]', output: '6' },
    { input: '[2,3,4,5]',          output: '120'  },
    { input: '[-2,1]',             output: '1'    },
    { input: '[1,-1]',             output: '1'    },
    { input: '[-2,4,-1]',          output: '8'    },
    { input: '[5,0,5]',            output: '5'    },
    { input: '[0,0,0]',            output: '0'    },
    { input: '[-1,-1,-1,-1]',      output: '1'    },
    { input: '[2,2,2]',            output: '8'    },
    { input: '[-2,2,-2]',          output: '8'    },
    { input: '[3,0,3]',            output: '3'    },
    { input: '[1,2,3,4,5]',        output: '120'  },
    { input: '[-1,0,2,3]',         output: '6'    },
    { input: '[10,-10,10]',        output: '10'   },
    { input: '[-10,10,-10]',       output: '1000' },
    { input: '[5,-1,-2,3]',        output: '30'   },
    { input: '[-5,1,-2]',          output: '10'   },
    { input: '[4,5,0,3]',          output: '20'   },
    { input: '[-1,-1,0,1]',        output: '1'    },
    { input: '[2,-1,1,1]',         output: '2'    },
    { input: '[-2,1,-1]',          output: '2'    },
    { input: '[3,-2,4,-3]',        output: '72'   },
    { input: '[-3,-1,-2]',         output: '6'    },
    { input: '[1,-2,3,-4]',        output: '24'   },
    { input: '[-1,2,-3,4]',        output: '24'   },
    { input: '[4,-2,3,-5]',        output: '120'  },
    { input: '[0,10,10,10]',       output: '1000' },
    { input: '[-2,-1,0,1]',        output: '2'    },
    { input: '[3,3,3,-3,3,3,3]',   output: '81'   },
    { input: '[100,-1,100]',       output: '100'  },
    { input: '[-100,100,-100]',    output: '1000000' },
    { input: '[0,-1,0]',           output: '0'    },
  ],

  // -------------------------------------------------------------------------
  // 78. WORD BREAK
  // Input:  s (string) \n wordDict (string[])
  // Output: "true" / "false"
  // -------------------------------------------------------------------------
  'word-break': [
    { input: '"leetcode"\n["leet","code"]',             output: 'true'  },
    { input: '"applepenapple"\n["apple","pen"]',        output: 'true'  },
    { input: '"catsandog"\n["cats","dog","sand","and","cat"]', output: 'false' },
    { input: '"a"\n["a"]',                             output: 'true'  },
    { input: '"a"\n["b"]',                             output: 'false' },
    { input: '"ab"\n["a","b"]',                        output: 'true'  },
    { input: '"ab"\n["ab"]',                           output: 'true'  },
    { input: '"ab"\n["a"]',                            output: 'false' },
    { input: '"abc"\n["a","bc"]',                      output: 'true'  },
    { input: '"abc"\n["ab","c"]',                      output: 'true'  },
    { input: '"abc"\n["abc"]',                         output: 'true'  },
    { input: '"abc"\n["ab","cd"]',                     output: 'false' },
    { input: '"aaaa"\n["a","aa","aaa"]',               output: 'true'  },
    { input: '"aaab"\n["a","aa","aaa"]',               output: 'false' },
    { input: '"cars"\n["car","ca","rs"]',              output: 'true'  },
    { input: '"goalspecial"\n["go","goal","goals","special"]', output: 'true' },
    { input: '"bb"\n["a","b","bbb","bbbb"]',           output: 'true'  },
    { input: '"bb"\n["a","b","bbb","bbbb"]',           output: 'true'  },
    { input: '"bbbb"\n["b","bb","bbb"]',               output: 'true'  },
    { input: '"catsanddog"\n["cat","cats","and","sand","dog"]', output: 'true' },
    { input: '"catssanddog"\n["cats","sand","dog"]',   output: 'true'  },
    { input: '"catssanddog"\n["cat","sand","dog"]',    output: 'false' },
    { input: '"pineapplepenapple"\n["apple","pen","applepen","pine","pineapple"]', output: 'true' },
    { input: '"pineapplepenappl"\n["apple","pen","pine"]', output: 'false' },
    { input: '"aaaaaaa"\n["aaaa","aaa"]',              output: 'true'  },
    { input: '"aaaaaab"\n["aaaa","aaa"]',              output: 'false' },
    { input: '"code"\n["co","de","cod","decode"]',     output: 'true'  },
    { input: '"decode"\n["co","de","cod","decode"]',   output: 'true'  },
    { input: '"decode"\n["de","code","enc"]',          output: 'true'  },
    { input: '"decode"\n["enc","code"]',               output: 'false' },
    { input: '"ilovegooglemicrosoftfacebook"\n["i","love","google","microsoft","facebook"]', output: 'true' },
    { input: '"ilovegooglemicrosoftfacebook"\n["i","love","google","microsoft"]', output: 'false' },
    { input: '"abcdef"\n["abc","def","abcdef"]',       output: 'true'  },
    { input: '"abcdef"\n["ab","cd","ef"]',             output: 'true'  },
    { input: '"abcdef"\n["ab","cd","de","f"]',         output: 'false' },
    { input: '"noon"\n["no","on","noon"]',             output: 'true'  },
    { input: '"dog"\n["dog","do"]',                   output: 'true'  },
    { input: '"dogs"\n["dog","do"]',                  output: 'false' },
    { input: '"rat"\n["r","at","rat"]',               output: 'true'  },
    { input: '"rat"\n["ra","t"]',                     output: 'true'  },
    { input: '"rat"\n["r","a","t"]',                  output: 'true'  },
    { input: '"rat"\n["r","a"]',                      output: 'false' },
    { input: '"hello"\n["hell","hello","o"]',         output: 'true'  },
    { input: '"helloworld"\n["hell","world","hello"]', output: 'true' },
    { input: '"helloworld"\n["hell","ello","world"]',  output: 'false' },
    { input: '"sky"\n["sky"]',                        output: 'true'  },
    { input: '"sky"\n["s","ky","sk","y"]',            output: 'true'  },
    { input: '"aaaa"\n["aa"]',                        output: 'true'  },
    { input: '"aaa"\n["aa"]',                         output: 'false' },
    { input: '"abcd"\n["a","abc","b","cd"]',          output: 'true'  },
    { input: '"abcbc"\n["abc","bc","b","c"]',         output: 'true'  },
    { input: '"abcbc"\n["abc","bc"]',                 output: 'true'  },
    { input: '"abcbc"\n["abc","b"]',                  output: 'false' },
    { input: '"abcbc"\n["ab","cbc"]',                 output: 'true'  },
    { input: '"abcbc"\n["ab","c","bc"]',              output: 'true'  },
    { input: '"word"\n["wo","ord","w","word"]',       output: 'true'  },
    { input: '"word"\n["wo","ord"]',                  output: 'true'  },
    { input: '"word"\n["wo"]',                        output: 'false' },
    { input: '"aaaaaaaaaaaaaaaaaaaaaaaab"\n["a","aa","aaa","aaaa","aaaaa"]', output: 'false' },
    { input: '"abcdefgh"\n["abc","def","gh","ab","cdefgh"]', output: 'true' },
  ],

  // -------------------------------------------------------------------------
  // 79. LONGEST INCREASING SUBSEQUENCE
  // Input:  nums (int[])
  // Output: length of LIS (int)
  // -------------------------------------------------------------------------
  'longest-increasing-subsequence': [
    { input: '[10,9,2,5,3,7,101,18]', output: '4' },
    { input: '[0,1,0,3,2,3]',         output: '4' },
    { input: '[7,7,7,7,7,7,7]',       output: '1' },
    { input: '[1]',                   output: '1' },
    { input: '[2,1]',                 output: '1' },
    { input: '[1,2]',                 output: '2' },
    { input: '[1,2,3]',               output: '3' },
    { input: '[3,2,1]',               output: '1' },
    { input: '[1,3,2]',               output: '2' },
    { input: '[3,1,2]',               output: '2' },
    { input: '[1,2,3,4,5]',           output: '5' },
    { input: '[5,4,3,2,1]',           output: '1' },
    { input: '[2,2,2]',               output: '1' },
    { input: '[1,3,6,7,9,4,10,5,6]',  output: '6' },
    { input: '[0,8,4,12,2,10,6,14,1,9,5,13,3,11,7,15]', output: '6' },
    { input: '[4,10,4,3,8,9]',        output: '3' },
    { input: '[3,5,6,2,5,4,19,5,6,7,12]', output: '6' },
    { input: '[1,0,2]',               output: '2' },
    { input: '[0,1,2,3]',             output: '4' },
    { input: '[4,3,2,1,0]',           output: '1' },
    { input: '[1,1,1,1]',             output: '1' },
    { input: '[1,2,1,2]',             output: '2' },
    { input: '[1,3,2,4]',             output: '3' },
    { input: '[5,1,4,2,3]',           output: '3' },
    { input: '[3,1,2,4,5]',           output: '4' },
    { input: '[2,3,1,4]',             output: '3' },
    { input: '[10,1,2,3]',            output: '3' },
    { input: '[1,9,2,8,3,7]',         output: '4' },
    { input: '[100,90,80,70,60]',     output: '1' },
    { input: '[10,20,30,40,50]',      output: '5' },
    { input: '[5,8,3,7,9,1]',         output: '3' },
    { input: '[1,5,2,3]',             output: '3' },
    { input: '[4,2,3,1]',             output: '2' },
    { input: '[2,1,3]',               output: '2' },
    { input: '[1,2,2,3]',             output: '3' },
    { input: '[6,5,4,8]',             output: '2' },
    { input: '[3,5,1,7]',             output: '3' },
    { input: '[1,2,3,2,1]',           output: '3' },
    { input: '[2,3,4,3,2]',           output: '3' },
    { input: '[1,3,2,4,3,5]',         output: '4' },
    { input: '[5,1,2,3,4]',           output: '4' },
    { input: '[5,1,2,3,4,0]',         output: '4' },
    { input: '[3,6,2,4,1,7]',         output: '4' },
    { input: '[4,6,2,7,3,8]',         output: '4' },
    { input: '[7,1,2,3,4,5,6]',       output: '6' },
    { input: '[1,2,3,4,3,2,1]',       output: '4' },
    { input: '[1,2,4,3,5,6,7]',       output: '6' },
    { input: '[1,2,4,3,5,6,7,8]',     output: '7' },
    { input: '[10,1,2,3,4,5]',        output: '5' },
    { input: '[5,4,3,2,1,0,6]',       output: '2' },
    { input: '[1,4,2,3,5]',           output: '4' },
    { input: '[0,3,1,6,2,2,7]',       output: '4' },
    { input: '[4,5,6,3,4,5]',         output: '3' },
    { input: '[9,3,7,4,8,5]',         output: '3' },
    { input: '[1,2,3,2,3,4]',         output: '4' },
    { input: '[3,4,5,1,2]',           output: '3' },
    { input: '[6,3,5,10,11,2,9,14,13,7,4,8,12]', output: '5' },
    { input: '[2,2]',                 output: '1' },
    { input: '[1,2,3,1,2,3]',         output: '3' },
    { input: '[5,1,4,2,3,6]',         output: '4' },
  ],

  // -------------------------------------------------------------------------
  // 80. PARTITION EQUAL SUBSET SUM
  // Input:  nums (int[])
  // Output: "true" / "false"
  // -------------------------------------------------------------------------
  'partition-equal-subset-sum': [
    { input: '[1,5,11,5]',       output: 'true'  },
    { input: '[1,2,3,5]',        output: 'false' },
    { input: '[1,1]',            output: 'true'  },
    { input: '[1,2]',            output: 'false' },
    { input: '[2,2]',            output: 'true'  },
    { input: '[3,3,3,4,5]',      output: 'false' },
    { input: '[1,2,5]',          output: 'false' },
    { input: '[3,1,1,2,2,1]',    output: 'true'  },
    { input: '[1]',              output: 'false' },
    { input: '[2,2,1,1]',        output: 'true'  },
    { input: '[2,2,3,5]',        output: 'false' },
    { input: '[1,5,3,3]',        output: 'true'  },
    { input: '[1,2,3,4]',        output: 'true'  },
    { input: '[1,2,3,6]',        output: 'false' },
    { input: '[2,4,6,10]',       output: 'false' },
    { input: '[2,4,4,6]',        output: 'false' },
    { input: '[3,3,3,3]',        output: 'true'  },
    { input: '[1,1,1,1]',        output: 'true'  },
    { input: '[2,2,4]',          output: 'true'  },
    { input: '[1,2,5,6]',        output: 'false' },
    { input: '[4,4]',            output: 'true'  },
    { input: '[6,6]',            output: 'true'  },
    { input: '[5,5,10,10,20]',   output: 'true'  },
    { input: '[6,10,7,7,10,3,2,1,14,8]', output: 'false' },
    { input: '[1,2,3,4,5]',      output: 'false' },
    { input: '[2,4,2,4,2,4]',    output: 'true'  },
    { input: '[100,100]',        output: 'true'  },
    { input: '[100,99]',         output: 'false' },
    { input: '[3,3,4,4]',        output: 'true'  },
    { input: '[2,3,4]',          output: 'false' },
    { input: '[5,10,15]',        output: 'false' },
    { input: '[5,5,5,5]',        output: 'true'  },
    { input: '[1,1,2,2,4]',      output: 'true'  },
    { input: '[1,2,4,4]',        output: 'false' },
    { input: '[10,10]',          output: 'true'  },
    { input: '[1,100]',          output: 'false' },
    { input: '[7,7]',            output: 'true'  },
    { input: '[3,7]',            output: 'false' },
    { input: '[1,3,5,7]',        output: 'false' },
    { input: '[1,3,3,7]',        output: 'true'  },
    { input: '[6,3,3,1,1,1,1,1]',output: 'true'  },
    { input: '[1,2,3,4,5,6,7]',  output: 'true'  },
    { input: '[2,3,7,8,10]',     output: 'true'  },
    { input: '[2,3,7,9,10]',     output: 'false' },
    { input: '[1,5,11,5,1,5,11,5]', output: 'true' },
    { input: '[14,9,8,4,3,2]',   output: 'true'  },
    { input: '[14,9,8,4,3,3]',   output: 'false' },
    { input: '[0,0,0,0]',        output: 'true'  },
    { input: '[0,0,1]',          output: 'false' },
    { input: '[0,0,0,1,1]',      output: 'true'  },
    { input: '[1,2,3,5,7,8]',    output: 'false' },
    { input: '[3,5,7,12]',       output: 'false' },
    { input: '[3,5,7,9]',        output: 'false' },
    { input: '[3,5,6,7,9]',      output: 'false' },
    { input: '[1,2,5,10,6]',     output: 'false' },
    { input: '[2,2,2,2]',        output: 'true'  },
    { input: '[4,3,2,3,4,2]',    output: 'true'  },
    { input: '[1,1,1,1,1,1,1,1]',output: 'true'  },
    { input: '[1,1,1,1,1,1,1]',  output: 'false' },
    { input: '[6,5,4,3,2,1]',    output: 'false' },
    { input: '[6,6,4,4]',        output: 'true'  },
  ],

  // -------------------------------------------------------------------------
  // 81. UNIQUE PATHS
  // Input:  m (int) \n n (int)
  // Output: number of unique paths (int)
  // -------------------------------------------------------------------------
  'unique-paths': [
    { input: '3\n7',    output: '28'    },
    { input: '3\n2',    output: '3'     },
    { input: '7\n3',    output: '28'    },
    { input: '1\n1',    output: '1'     },
    { input: '1\n10',   output: '1'     },
    { input: '10\n1',   output: '1'     },
    { input: '2\n2',    output: '2'     },
    { input: '2\n3',    output: '3'     },
    { input: '3\n3',    output: '6'     },
    { input: '4\n4',    output: '20'    },
    { input: '5\n5',    output: '70'    },
    { input: '6\n6',    output: '252'   },
    { input: '7\n7',    output: '924'   },
    { input: '2\n4',    output: '4'     },
    { input: '4\n2',    output: '4'     },
    { input: '3\n4',    output: '10'    },
    { input: '4\n3',    output: '10'    },
    { input: '5\n6',    output: '126'   },
    { input: '6\n5',    output: '126'   },
    { input: '3\n5',    output: '15'    },
    { input: '5\n3',    output: '15'    },
    { input: '2\n5',    output: '5'     },
    { input: '5\n2',    output: '5'     },
    { input: '2\n6',    output: '6'     },
    { input: '6\n2',    output: '6'     },
    { input: '2\n7',    output: '7'     },
    { input: '7\n2',    output: '7'     },
    { input: '2\n8',    output: '8'     },
    { input: '8\n2',    output: '8'     },
    { input: '2\n10',   output: '10'    },
    { input: '10\n2',   output: '10'    },
    { input: '3\n6',    output: '21'    },
    { input: '6\n3',    output: '21'    },
    { input: '4\n5',    output: '35'    },
    { input: '5\n4',    output: '35'    },
    { input: '4\n6',    output: '56'    },
    { input: '6\n4',    output: '56'    },
    { input: '4\n7',    output: '84'    },
    { input: '7\n4',    output: '84'    },
    { input: '3\n8',    output: '36'    },
    { input: '8\n3',    output: '36'    },
    { input: '3\n9',    output: '45'    },
    { input: '9\n3',    output: '45'    },
    { input: '3\n10',   output: '55'    },
    { input: '10\n3',   output: '55'    },
    { input: '4\n8',    output: '120'   },
    { input: '8\n4',    output: '120'   },
    { input: '5\n7',    output: '210'   },
    { input: '7\n5',    output: '210'   },
    { input: '5\n8',    output: '330'   },
    { input: '8\n5',    output: '330'   },
    { input: '5\n9',    output: '495'   },
    { input: '9\n5',    output: '495'   },
    { input: '5\n10',   output: '715'   },
    { input: '10\n5',   output: '715'   },
    { input: '6\n7',    output: '462'   },
    { input: '7\n6',    output: '462'   },
    { input: '8\n8',    output: '3432'  },
    { input: '9\n9',    output: '12870' },
    { input: '10\n10',  output: '48620' },
    { input: '15\n15',  output: '40116600' },
  ],

  // -------------------------------------------------------------------------
  // 82. LONGEST COMMON SUBSEQUENCE
  // Input:  text1 (string) \n text2 (string)
  // Output: length of LCS (int)
  // -------------------------------------------------------------------------
  'longest-common-subsequence': [
    { input: '"abcde"\n"ace"',        output: '3' },
    { input: '"abc"\n"abc"',          output: '3' },
    { input: '"abc"\n"def"',          output: '0' },
    { input: '"a"\n"a"',              output: '1' },
    { input: '"a"\n"b"',              output: '0' },
    { input: '"ab"\n"ab"',            output: '2' },
    { input: '"ab"\n"ba"',            output: '1' },
    { input: '"ab"\n"b"',             output: '1' },
    { input: '"ab"\n"a"',             output: '1' },
    { input: '"abc"\n"ac"',           output: '2' },
    { input: '"abc"\n"bc"',           output: '2' },
    { input: '"abc"\n"ab"',           output: '2' },
    { input: '"abcba"\n"abcbcba"',    output: '5' },
    { input: '"ezupkr"\n"ubmrapg"',   output: '2' },
    { input: '"oxcpqrsvwf"\n"shmtulqrypy"', output: '2' },
    { input: '"bsbininm"\n"jmjkbkjkv"', output: '2' },
    { input: '"ABCBDAB"\n"BDCABA"',   output: '4' },
    { input: '"AGGTAB"\n"GXTXAYB"',   output: '4' },
    { input: '"abcde"\n"abcde"',      output: '5' },
    { input: '"abcde"\n"edcba"',      output: '1' },
    { input: '"abcde"\n"bdce"',       output: '3' },
    { input: '"abc"\n"aabbcc"',       output: '3' },
    { input: '"aabbcc"\n"abc"',       output: '3' },
    { input: '"abc"\n"cbacba"',       output: '2' },
    { input: '"abc"\n"c"',            output: '1' },
    { input: '"abc"\n"a"',            output: '1' },
    { input: '"abc"\n"b"',            output: '1' },
    { input: '"abc"\n""',             output: '0' },
    { input: '""\n"abc"',             output: '0' },
    { input: '""\n""',                output: '0' },
    { input: '"abcd"\n"acdf"',        output: '3' },
    { input: '"abcd"\n"abdc"',        output: '3' },
    { input: '"abcde"\n"aXbYcZdWe"', output: '5' },
    { input: '"abcda"\n"acbca"',      output: '4' },
    { input: '"aab"\n"azb"',          output: '2' },
    { input: '"abab"\n"baba"',        output: '3' },
    { input: '"xxyy"\n"xyxy"',        output: '3' },
    { input: '"aaaa"\n"aa"',          output: '2' },
    { input: '"aaaa"\n"aaaa"',        output: '4' },
    { input: '"znpnfhvs"\n"lpzklzlp"', output: '2' },
    { input: '"aaabbb"\n"aaabbb"',    output: '6' },
    { input: '"aaabbb"\n"bbbaaaa"',   output: '3' },
    { input: '"horse"\n"ros"',        output: '2' },
    { input: '"intention"\n"execution"', output: '5' },
    { input: '"ac"\n"abc"',           output: '2' },
    { input: '"abc"\n"aec"',          output: '2' },
    { input: '"abcd"\n"bcda"',        output: '3' },
    { input: '"abcda"\n"abcda"',      output: '5' },
    { input: '"abc"\n"bac"',          output: '2' },
    { input: '"mhunuzqrkzsnidwbun"\n"szulspmhwpazoxijwbq"', output: '6' },
    { input: '"xyzabc"\n"xyzdabc"',   output: '6' },
    { input: '"zxyzxyz"\n"zxyxzy"',   output: '5' },
    { input: '"abba"\n"abba"',        output: '4' },
    { input: '"abba"\n"baab"',        output: '2' },
    { input: '"longestcommon"\n"longest"', output: '7' },
    { input: '"abcde"\n"a"',          output: '1' },
    { input: '"abcde"\n"e"',          output: '1' },
    { input: '"abcde"\n"aXe"',        output: '2' },
    { input: '"abcde"\n"abXde"',      output: '4' },
    { input: '"abcde"\n"Xbcde"',      output: '4' },
  ],

  // -------------------------------------------------------------------------
  // 83. COIN CHANGE II
  // Input:  amount (int) \n coins (int[])
  // Output: number of combinations (int)
  // -------------------------------------------------------------------------
  'coin-change-ii': [
    { input: '5\n[1,2,5]',     output: '4'   },
    { input: '3\n[2]',         output: '0'   },
    { input: '10\n[10]',       output: '1'   },
    { input: '0\n[1,2,5]',     output: '1'   },
    { input: '1\n[1]',         output: '1'   },
    { input: '2\n[1]',         output: '1'   },
    { input: '2\n[1,2]',       output: '2'   },
    { input: '3\n[1,2]',       output: '2'   },
    { input: '4\n[1,2]',       output: '3'   },
    { input: '5\n[1,2]',       output: '3'   },
    { input: '10\n[1,5]',      output: '3'   },
    { input: '10\n[1,2,5,10]', output: '11'  },
    { input: '5\n[5]',         output: '1'   },
    { input: '6\n[5]',         output: '0'   },
    { input: '5\n[1,5]',       output: '2'   },
    { input: '10\n[2,5]',      output: '2'   },
    { input: '500\n[1,2,5]',   output: '12701' },
    { input: '500\n[3,5,7,8,9,10,11]', output: '35502874' },
    { input: '4\n[1,2,3]',     output: '4'   },
    { input: '5\n[1,2,3]',     output: '5'   },
    { input: '6\n[1,2,3]',     output: '7'   },
    { input: '7\n[1,2,3]',     output: '8'   },
    { input: '10\n[1,2,3]',    output: '14'  },
    { input: '8\n[2,4]',       output: '3'   },
    { input: '9\n[2,4]',       output: '0'   },
    { input: '6\n[2,4]',       output: '2'   },
    { input: '4\n[2,4]',       output: '2'   },
    { input: '100\n[1,5,10,25]', output: '242' },
    { input: '11\n[1,5,6,9]',  output: '4'   },
    { input: '0\n[7]',         output: '1'   },
    { input: '7\n[7]',         output: '1'   },
    { input: '14\n[7]',        output: '1'   },
    { input: '15\n[7]',        output: '0'   },
    { input: '3\n[1,2,3]',     output: '3'   },
    { input: '5\n[2,3]',       output: '1'   },
    { input: '6\n[2,3]',       output: '2'   },
    { input: '12\n[2,3]',      output: '3'   },
    { input: '9\n[3,6]',       output: '2'   },
    { input: '12\n[1,6,10]',   output: '7'   },
    { input: '20\n[1,5,10,20]',output: '9'   },
    { input: '0\n[5,10,25]',   output: '1'   },
    { input: '5\n[5,10,25]',   output: '1'   },
    { input: '10\n[5,10,25]',  output: '2'   },
    { input: '15\n[5,10,25]',  output: '2'   },
    { input: '25\n[5,10,25]',  output: '4'   },
    { input: '30\n[5,10,25]',  output: '5'   },
    { input: '4\n[3,4]',       output: '1'   },
    { input: '8\n[3,4]',       output: '2'   },
    { input: '12\n[3,4]',      output: '4'   },
    { input: '100\n[1]',       output: '1'   },
    { input: '5\n[1,3,5]',     output: '5'   },
    { input: '10\n[1,3,5]',    output: '19'  },
    { input: '3\n[3]',         output: '1'   },
    { input: '6\n[3,5]',       output: '1'   },
    { input: '8\n[3,5]',       output: '1'   },
    { input: '15\n[3,5]',      output: '3'   },
    { input: '1\n[2]',         output: '0'   },
    { input: '5\n[4]',         output: '0'   },
    { input: '4\n[4]',         output: '1'   },
    { input: '2\n[2,3,5]',     output: '1'   },
    { input: '5\n[2,3,5]',     output: '3'   },
  ],

  // -------------------------------------------------------------------------
  // 84. TARGET SUM
  // Input:  nums (int[]) \n target (int)
  // Output: number of ways (int)
  // -------------------------------------------------------------------------
  'target-sum': [
    { input: '[1,1,1,1,1]\n3',   output: '5'  },
    { input: '[1]\n1',            output: '1'  },
    { input: '[1]\n2',            output: '0'  },
    { input: '[1]\n-1',           output: '1'  },
    { input: '[1,2]\n1',          output: '1'  },
    { input: '[1,2]\n-1',         output: '1'  },
    { input: '[1,2]\n3',          output: '1'  },
    { input: '[1,2]\n-3',         output: '1'  },
    { input: '[1,2]\n0',          output: '0'  },
    { input: '[0]\n0',            output: '2'  },
    { input: '[0,0]\n0',          output: '4'  },
    { input: '[0,0,0]\n0',        output: '8'  },
    { input: '[1,0]\n1',          output: '2'  },
    { input: '[1,0]\n-1',         output: '2'  },
    { input: '[1,2,3]\n0',        output: '2'  },
    { input: '[1,2,3]\n2',        output: '2'  },
    { input: '[1,2,3]\n-2',       output: '2'  },
    { input: '[1,2,3]\n6',        output: '1'  },
    { input: '[1,2,3]\n-6',       output: '1'  },
    { input: '[1,2,3]\n7',        output: '0'  },
    { input: '[2,2,2]\n2',        output: '3'  },
    { input: '[2,2,2]\n-2',       output: '3'  },
    { input: '[2,2,2]\n0',        output: '0'  },
    { input: '[2,2,2]\n6',        output: '1'  },
    { input: '[1,1,1,1,1,1]\n0',  output: '10' },
    { input: '[1,1,1,1,1,1]\n2',  output: '6'  },
    { input: '[1,1,1,1,1,1]\n6',  output: '1'  },
    { input: '[1,1,2,3]\n1',      output: '4'  },
    { input: '[1,1,2,3]\n3',      output: '4'  },
    { input: '[1,1,2,3]\n5',      output: '2'  },
    { input: '[3,4,5,6,7]\n5',    output: '4'  },
    { input: '[3,4,5,6,7]\n15',   output: '1'  },
    { input: '[3,4,5,6,7]\n-5',   output: '4'  },
    { input: '[3,4,5,6,7]\n0',    output: '2'  },
    { input: '[3,4,5,6,7]\n1',    output: '2'  },
    { input: '[1,1,1,1,1,1,1]\n1', output: '21' },
    { input: '[1,1,1,1,1,1,1]\n3', output: '35' },
    { input: '[1,1,1,1,1,1,1]\n7', output: '1'  },
    { input: '[4,3,2,1]\n0',      output: '2'  },
    { input: '[4,3,2,1]\n2',      output: '2'  },
    { input: '[4,3,2,1]\n4',      output: '3'  },
    { input: '[4,3,2,1]\n10',     output: '1'  },
    { input: '[4,3,2,1]\n-4',     output: '3'  },
    { input: '[0,1]\n1',          output: '2'  },
    { input: '[0,1]\n-1',         output: '2'  },
    { input: '[0,1]\n0',          output: '0'  },
    { input: '[5,5,5]\n5',        output: '3'  },
    { input: '[5,5,5]\n-5',       output: '3'  },
    { input: '[5,5,5]\n15',       output: '1'  },
    { input: '[5,5,5]\n0',        output: '0'  },
    { input: '[5,5,5]\n1',        output: '0'  },
    { input: '[1,2,3,4,5]\n3',    output: '5'  },
    { input: '[1,2,3,4,5]\n5',    output: '5'  },
    { input: '[1,2,3,4,5]\n15',   output: '1'  },
    { input: '[1,2,3,4,5]\n-15',  output: '1'  },
    { input: '[1,2,3,4,5]\n0',    output: '2'  },
    { input: '[2,1]\n1',          output: '1'  },
    { input: '[2,1]\n-1',         output: '1'  },
    { input: '[100]\n100',         output: '1'  },
    { input: '[100]\n200',         output: '0'  },
    { input: '[1,1,1,1]\n0',      output: '6'  },
    { input: '[1,1,1,1]\n2',      output: '4'  },
    { input: '[1,1,1,1]\n4',      output: '1'  },
  ],

  // -------------------------------------------------------------------------
  // 85. JUMP GAME
  // Input:  nums (int[])
  // Output: "true" / "false"
  // -------------------------------------------------------------------------
  'jump-game': [
    { input: '[2,3,1,1,4]',     output: 'true'  },
    { input: '[3,2,1,0,4]',     output: 'false' },
    { input: '[0]',             output: 'true'  },
    { input: '[1]',             output: 'true'  },
    { input: '[2,0,0]',         output: 'true'  },
    { input: '[1,0]',           output: 'true'  },
    { input: '[0,1]',           output: 'false' },
    { input: '[1,1,0,1]',       output: 'false' },
    { input: '[2,0,1,0]',       output: 'true'  },
    { input: '[1,2,3,0,0]',     output: 'true'  },
    { input: '[4,0,0,0,0]',     output: 'true'  },
    { input: '[0,0,0,0]',       output: 'false' },
    { input: '[1,0,1,0]',       output: 'false' },
    { input: '[3,0,0,0]',       output: 'true'  },
    { input: '[2,3,0,0,4]',     output: 'true'  },
    { input: '[2,0,0,0,0]',     output: 'false' },
    { input: '[1,1,1,0]',       output: 'true'  },
    { input: '[1,1,0,0]',       output: 'false' },
    { input: '[3,0,8,2,0,0,1]', output: 'true'  },
    { input: '[1,0,0,0]',       output: 'false' },
    { input: '[5,0,0,0,0,0]',   output: 'true'  },
    { input: '[5,0,0,0,0,0,0]', output: 'false' },
    { input: '[1,2,0,0,4]',     output: 'true'  },
    { input: '[2,2,0,0,4]',     output: 'false' },
    { input: '[2,5,0,0]',       output: 'true'  },
    { input: '[1,1,2,2,0,1,1]', output: 'true'  },
    { input: '[2,0,2,0,1]',     output: 'true'  },
    { input: '[2,0,2,0,0,1]',   output: 'false' },
    { input: '[4,2,0,0,0]',     output: 'true'  },
    { input: '[4,1,0,0,0,0]',   output: 'false' },
    { input: '[1,1,1,1]',       output: 'true'  },
    { input: '[0,2,3]',         output: 'false' },
    { input: '[2,1]',           output: 'true'  },
    { input: '[0,0]',           output: 'false' },
    { input: '[1,0]',           output: 'true'  },
    { input: '[3,1,0,0]',       output: 'true'  },
    { input: '[3,1,1,0,0]',     output: 'true'  },
    { input: '[3,1,0,1,0,0]',   output: 'true'  },
    { input: '[3,1,0,0,1,0,0]', output: 'false' },
    { input: '[2,3,1,1,0]',     output: 'true'  },
    { input: '[6,0,0,0,0,0,0]', output: 'true'  },
    { input: '[10,0,0,0,0,0,0,0,0,0,0]', output: 'true' },
    { input: '[1,2]',           output: 'true'  },
    { input: '[1,2,3]',         output: 'true'  },
    { input: '[1,0,1]',         output: 'false' },
    { input: '[2,0,1]',         output: 'true'  },
    { input: '[2,0,0,1]',       output: 'false' },
    { input: '[3,0,0,1]',       output: 'true'  },
    { input: '[5,0,0,0,0]',     output: 'true'  },
    { input: '[5,0,0,0,0,0]',   output: 'true'  },
    { input: '[5,0,0,0,0,0,0]', output: 'false' },
    { input: '[0]',             output: 'true'  },
    { input: '[2]',             output: 'true'  },
    { input: '[0,1,0]',         output: 'false' },
    { input: '[1,1,0,0,1]',     output: 'false' },
    { input: '[2,1,0,0,1]',     output: 'false' },
    { input: '[3,1,0,0,1]',     output: 'true'  },
    { input: '[1,2,0,0,1]',     output: 'false' },
    { input: '[2,2,0,1,0,0]',   output: 'true'  },
    { input: '[1,3,0,0,0,1]',   output: 'true'  },
    { input: '[1,1,1,1,1,0]',   output: 'true'  },
  ],

  // -------------------------------------------------------------------------
  // 86. JUMP GAME II
  // Input:  nums (int[])
  // Output: minimum jumps to reach last index (int)
  // -------------------------------------------------------------------------
  'jump-game-ii': [
    { input: '[2,3,1,1,4]',        output: '2' },
    { input: '[2,3,0,1,4]',        output: '2' },
    { input: '[0]',                output: '0' },
    { input: '[1]',                output: '0' },
    { input: '[1,2]',              output: '1' },
    { input: '[1,1]',              output: '1' },
    { input: '[2,1]',              output: '1' },
    { input: '[1,1,1]',            output: '2' },
    { input: '[1,2,1]',            output: '2' },
    { input: '[2,1,1]',            output: '1' },
    { input: '[3,2,1,0,4]',        output: '2' },
    { input: '[1,2,3,4,5]',        output: '3' },
    { input: '[5,4,3,2,1]',        output: '1' },
    { input: '[2,3,0,1]',          output: '2' },
    { input: '[1,0,1,0]',          output: '3' },
    { input: '[2,0,2,0,1]',        output: '2' },
    { input: '[1,2,3,0,0]',        output: '2' },
    { input: '[4,0,0,0,0]',        output: '1' },
    { input: '[1,1,1,1,1]',        output: '4' },
    { input: '[3,0,8,2,0,0,1]',    output: '3' },
    { input: '[2,1,2,1,2]',        output: '2' },
    { input: '[1,3,1,1,1]',        output: '3' },
    { input: '[2,3,1,1,0,4]',      output: '3' },
    { input: '[5,0,0,0,0]',        output: '1' },
    { input: '[1,2,1,1,1]',        output: '3' },
    { input: '[2,2,2,2,2]',        output: '2' },
    { input: '[7,0,9,6,9,6,1,7,9,0,1,2,9,0,3]', output: '2' },
    { input: '[1,2,0,1,0]',        output: '3' },
    { input: '[1,2,3]',            output: '2' },
    { input: '[2,3,1]',            output: '1' },
    { input: '[3,1,1]',            output: '1' },
    { input: '[1,1,2]',            output: '2' },
    { input: '[1,2,4,1,1,1]',      output: '3' },
    { input: '[3,0,0,0,4]',        output: '2' },
    { input: '[2,0,0,4,0]',        output: '2' },
    { input: '[1,2,1,2,1]',        output: '3' },
    { input: '[10,1,1,1,1]',       output: '1' },
    { input: '[1,1,1,1,10]',       output: '4' },
    { input: '[2,2,0,0,1]',        output: '3' },
    { input: '[3,2,0,1,1]',        output: '2' },
    { input: '[1,3,0,0,0,1]',      output: '3' },
    { input: '[2,3,1,0,4,0,0]',    output: '3' },
    { input: '[6,1,1,1,1,1,1]',    output: '1' },
    { input: '[1,6,1,1,1,1,1]',    output: '2' },
    { input: '[1,1,1,1,1,6]',      output: '5' },
    { input: '[1,2,3,1,1]',        output: '3' },
    { input: '[3,4,3,2,5,4,3]',    output: '3' },
    { input: '[1,2,2,2,2]',        output: '3' },
    { input: '[3,0,1,2,0,0,3]',    output: '3' },
    { input: '[1,2,0,0,1,1,0]',    output: '5' },
    { input: '[2,0,1,1,1]',        output: '3' },
    { input: '[1,2,0,3,0]',        output: '3' },
    { input: '[4,3,2,1,0,0,1]',    output: '3' },
    { input: '[1,4,0,0,4]',        output: '2' },
    { input: '[2,1,0,1,4]',        output: '3' },
    { input: '[3,2,1,0,0,4]',      output: '3' },
    { input: '[5,1,1,1,1]',        output: '1' },
    { input: '[1,1,2,3,3]',        output: '3' },
    { input: '[1,2,3,4,1,1,1]',    output: '3' },
    { input: '[2,1,2,3,0,2,0,1]',  output: '4' },
    { input: '[0]',                output: '0' },
  ],

  // -------------------------------------------------------------------------
  // 87. GAS STATION
  // Input:  gas (int[]) \n cost (int[])
  // Output: starting index or -1 (int)
  // -------------------------------------------------------------------------
  'gas-station': [
    { input: '[1,2,3,4,5]\n[3,4,5,1,2]',     output: '3' },
    { input: '[2,3,4]\n[3,4,3]',              output: '-1' },
    { input: '[5]\n[4]',                      output: '0' },
    { input: '[1]\n[1]',                      output: '0' },
    { input: '[1]\n[2]',                      output: '-1' },
    { input: '[2,2]\n[1,2]',                  output: '0' },
    { input: '[1,2]\n[2,1]',                  output: '1' },
    { input: '[3,3,4]\n[3,4,3]',              output: '-1' },
    { input: '[3,3,4]\n[3,3,4]',              output: '0' },
    { input: '[4,3,3]\n[3,3,4]',              output: '0' },
    { input: '[1,2,3,4]\n[2,2,2,2]',          output: '1' },
    { input: '[4,3,2,1]\n[1,1,1,5]',          output: '0' },
    { input: '[0,0,0,0]\n[0,0,0,0]',          output: '0' },
    { input: '[0]\n[0]',                      output: '0' },
    { input: '[2,0,1,2,3,4]\n[0,1,0,0,0,11]', output: '-1' },
    { input: '[1,2,3]\n[4,5,6]',              output: '-1' },
    { input: '[4,5,6]\n[1,2,3]',              output: '0' },
    { input: '[5,5,5,5]\n[4,5,6,4]',          output: '3' },
    { input: '[1,1,1,1,1]\n[1,1,1,1,1]',      output: '0' },
    { input: '[2,1,1,1,1]\n[1,1,1,1,2]',      output: '0' },
    { input: '[1,1,1,1,2]\n[2,1,1,1,1]',      output: '4' },
    { input: '[3,1,1]\n[1,2,2]',              output: '0' },
    { input: '[1,3,1]\n[2,1,2]',              output: '1' },
    { input: '[1,1,3]\n[2,2,1]',              output: '2' },
    { input: '[4,5]\n[5,4]',                  output: '1' },
    { input: '[5,4]\n[4,5]',                  output: '0' },
    { input: '[3,1,1,4,2]\n[1,2,2,1,3]',      output: '3' },
    { input: '[1,2,3,4,5]\n[1,1,1,1,1]',      output: '0' },
    { input: '[5,4,3,2,1]\n[1,1,1,1,1]',      output: '0' },
    { input: '[1,2,3,4,5,1,2,3,4,5]\n[3,4,5,1,2,3,4,5,1,2]', output: '3' },
    { input: '[3,5,2,4]\n[4,2,5,3]',          output: '1' },
    { input: '[2,3,2]\n[3,2,2]',              output: '1' },
    { input: '[2,3,2]\n[2,2,3]',              output: '0' },
    { input: '[5,1,2,3,4]\n[4,4,1,5,1]',      output: '4' },
    { input: '[6,1,4,3,5]\n[3,8,2,4,2]',      output: '-1' },
    { input: '[10,1,1,1,1,1,1,1,1,1]\n[1,1,1,1,1,1,1,1,1,5]', output: '0' },
    { input: '[1,1,1,1,1,1,1,1,1,10]\n[5,1,1,1,1,1,1,1,1,1]', output: '9' },
    { input: '[2,0,1,1,1]\n[1,1,1,1,2]',      output: '0' },
    { input: '[1,1,1,2,0]\n[2,1,1,0,1]',      output: '3' },
    { input: '[4,1,1,1,1]\n[1,3,1,1,2]',      output: '0' },
    { input: '[1,2,3]\n[3,2,1]',              output: '2' },
    { input: '[1,3,2]\n[3,1,2]',              output: '1' },
    { input: '[3,2,1]\n[1,2,3]',              output: '0' },
    { input: '[3,1,2]\n[2,3,1]',              output: '2' },
    { input: '[2,1,3]\n[3,2,1]',              output: '2' },
    { input: '[2,3,1]\n[1,3,2]',              output: '0' },
    { input: '[1,1,2,3,1]\n[2,2,1,1,1]',      output: '2' },
    { input: '[3,1,1,2,1]\n[1,2,1,1,2]',      output: '0' },
    { input: '[3,0,2,0]\n[0,3,0,2]',          output: '0' },
    { input: '[0,3,0,2]\n[3,0,2,0]',          output: '1' },
    { input: '[5,0,3,1,1]\n[4,1,1,2,3]',      output: '-1' },
    { input: '[0,0,1,0,3]\n[0,1,0,3,0]',      output: '4' },
    { input: '[1,5,1,1,1]\n[0,4,3,0,0]',      output: '1' },
    { input: '[2,4,2,1,3]\n[2,3,4,1,2]',      output: '-1' },
    { input: '[1,2,3,4,5]\n[2,3,4,5,1]',      output: '4' },
    { input: '[5,2,3,4,1]\n[1,2,3,4,5]',      output: '0' },
    { input: '[4,2,1,1]\n[1,3,2,2]',          output: '0' },
    { input: '[3,2,1,1]\n[2,1,2,2]',          output: '0' },
    { input: '[2,2,2,2]\n[2,2,2,2]',          output: '0' },
    { input: '[1,2,3,0]\n[0,3,2,1]',          output: '0' },
    { input: '[0,3,2,1]\n[1,2,3,0]',          output: '1' },
  ],

  // -------------------------------------------------------------------------
  // 88. HAND OF STRAIGHTS
  // Input:  hand (int[]) \n groupSize (int)
  // Output: "true" / "false"
  // -------------------------------------------------------------------------
  'hand-of-straights': [
    { input: '[1,2,3,6,2,3,4,7,8]\n3',     output: 'true'  },
    { input: '[1,2,3,4,5]\n4',             output: 'false' },
    { input: '[1,2,3,4,5,6]\n2',           output: 'true'  },
    { input: '[1,2,3,4,5,6]\n3',           output: 'true'  },
    { input: '[1,2,3,4,5,6]\n6',           output: 'true'  },
    { input: '[1,2,3,4,5,6]\n4',           output: 'false' },
    { input: '[1,1,2,2,3,3]\n3',           output: 'true'  },
    { input: '[1,1,2,2,3,3]\n2',           output: 'true'  },
    { input: '[1,2,3]\n3',                 output: 'true'  },
    { input: '[1,2,3]\n2',                 output: 'false' },
    { input: '[1,2,3]\n1',                 output: 'true'  },
    { input: '[1]\n1',                     output: 'true'  },
    { input: '[2,1]\n2',                   output: 'true'  },
    { input: '[1,3]\n2',                   output: 'false' },
    { input: '[1,2,3,4,5,6,7,8,9]\n3',    output: 'true'  },
    { input: '[1,2,3,4,5,6,7,8,9]\n9',    output: 'true'  },
    { input: '[1,2,3,4,5,6,7,8,9]\n2',    output: 'false' },
    { input: '[1,2,3,4,5,6,7,8,9]\n4',    output: 'false' },
    { input: '[3,3,4,4,5,5]\n3',           output: 'true'  },
    { input: '[3,3,4,4,5,5]\n2',           output: 'true'  },
    { input: '[1,2,3,1,2,3]\n3',           output: 'true'  },
    { input: '[1,2,3,1,2,3]\n2',           output: 'false' },
    { input: '[4,5,6]\n3',                 output: 'true'  },
    { input: '[4,5,7]\n3',                 output: 'false' },
    { input: '[1,1,1]\n1',                 output: 'true'  },
    { input: '[1,1,1]\n3',                 output: 'false' },
    { input: '[10,11,12]\n3',              output: 'true'  },
    { input: '[10,11,13]\n3',              output: 'false' },
    { input: '[1,2,3,4,5,6,1,2,3,4,5,6]\n3', output: 'true' },
    { input: '[1,2,3,4,5,6,1,2,3,4,5,6]\n6', output: 'true' },
    { input: '[1,2,3,4,5,6,1,2,3,4,5,6]\n4', output: 'false' },
    { input: '[1,1,2,2,3,3,4,4,5,5,6,6]\n3', output: 'true' },
    { input: '[1,1,2,2,3,3,4,4,5,5,6,6]\n2', output: 'true' },
    { input: '[1,1,2,2,3,3,4,4,5,5,6,6]\n6', output: 'false' },
    { input: '[1,2,3,4]\n2',               output: 'true'  },
    { input: '[1,2,3,4]\n4',               output: 'true'  },
    { input: '[1,2,4,5]\n2',               output: 'true'  },
    { input: '[1,2,4,5]\n4',               output: 'false' },
    { input: '[5,5,5,5]\n1',               output: 'true'  },
    { input: '[5,5,5,5]\n2',               output: 'false' },
    { input: '[5,5,5,5]\n4',               output: 'false' },
    { input: '[1,1,2,3]\n2',               output: 'false' },
    { input: '[1,2,3,4,5,6,7,8,9,10,11,12]\n3', output: 'true' },
    { input: '[1,2,3,4,5,6,7,8,9,10,11,12]\n4', output: 'true' },
    { input: '[1,2,3,4,5,6,7,8,9,10,11,12]\n6', output: 'true' },
    { input: '[1,2,3,4,5,6,7,8,9,10,11,12]\n5', output: 'false' },
    { input: '[9,10,11,12,13,14]\n3',      output: 'true'  },
    { input: '[9,11,12,13,14,10]\n3',      output: 'true'  },
    { input: '[9,10,12,13,14,11]\n2',      output: 'true'  },
    { input: '[9,10,11,12]\n3',            output: 'false' },
    { input: '[1,2,3,100,101,102]\n3',     output: 'true'  },
    { input: '[1,2,3,100,101,103]\n3',     output: 'false' },
    { input: '[1,2,3,4,5,6,7]\n7',        output: 'true'  },
    { input: '[1,2,3,4,5,6,7]\n3',        output: 'false' },
    { input: '[1,2,3,4,5,6,7]\n1',        output: 'true'  },
    { input: '[1,1,2,2,3,3,1,2,3]\n3',    output: 'true'  },
    { input: '[2,2,2,4,4,4,3,3,3]\n3',    output: 'true'  },
    { input: '[2,4,6]\n3',                output: 'false' },
    { input: '[2,4,6]\n1',                output: 'true'  },
    { input: '[3,3,2,2,1,1]\n3',          output: 'true'  },
    { input: '[1,2,3,3,4,5]\n3',          output: 'true'  },
  ],

  // -------------------------------------------------------------------------
  // 89. MERGE TRIPLETS TO FORM TARGET TRIPLET
  // Input:  triplets (int[][]) \n target (int[3])
  // Output: "true" / "false"
  // -------------------------------------------------------------------------
  'merge-triplets-to-form-target-triplet': [
    { input: '[[2,5,3],[1,8,4],[1,7,5]]\n[2,7,5]',    output: 'true'  },
    { input: '[[3,4,5],[4,5,6]]\n[3,2,5]',            output: 'false' },
    { input: '[[2,5,3],[2,3,4],[1,2,5],[5,2,3]]\n[5,5,5]', output: 'true' },
    { input: '[[1,1,1]]\n[1,1,1]',                    output: 'true'  },
    { input: '[[1,1,1]]\n[1,1,2]',                    output: 'false' },
    { input: '[[1,2,3],[3,2,1]]\n[3,2,3]',            output: 'true'  },
    { input: '[[1,2,3],[3,2,1]]\n[3,3,3]',            output: 'false' },
    { input: '[[1,1,1],[2,2,2],[3,3,3]]\n[3,3,3]',    output: 'true'  },
    { input: '[[1,1,1],[2,2,2],[3,3,3]]\n[2,2,2]',    output: 'true'  },
    { input: '[[1,1,1],[2,2,2],[3,3,3]]\n[4,4,4]',    output: 'false' },
    { input: '[[1,2,3]]\n[1,2,3]',                    output: 'true'  },
    { input: '[[1,2,3]]\n[1,2,4]',                    output: 'false' },
    { input: '[[1,5,3],[5,1,3]]\n[5,5,3]',            output: 'true'  },
    { input: '[[1,5,3],[5,1,3]]\n[5,5,4]',            output: 'false' },
    { input: '[[2,5,3],[1,8,4],[1,7,5]]\n[2,8,5]',    output: 'false' },
    { input: '[[3,4,5],[4,5,6]]\n[4,5,6]',            output: 'true'  },
    { input: '[[3,4,5],[4,5,6]]\n[3,4,5]',            output: 'true'  },
    { input: '[[3,4,5],[4,5,6]]\n[4,4,6]',            output: 'false' },
    { input: '[[5,5,5],[1,1,1]]\n[5,5,5]',            output: 'true'  },
    { input: '[[5,5,5],[6,6,6]]\n[6,6,6]',            output: 'true'  },
    { input: '[[5,5,5],[6,6,6]]\n[5,6,5]',            output: 'false' },
    { input: '[[1,1,1],[1,1,1]]\n[1,1,1]',            output: 'true'  },
    { input: '[[2,2,2],[4,4,4],[2,2,4]]\n[4,4,4]',    output: 'true'  },
    { input: '[[2,2,2],[4,4,4],[2,2,4]]\n[4,2,4]',    output: 'false' },
    { input: '[[1,3,2],[3,1,2]]\n[3,3,2]',            output: 'true'  },
    { input: '[[1,3,2],[3,1,2]]\n[3,3,3]',            output: 'false' },
    { input: '[[3,17,1],[2,10,14],[14,7,5],[14,4,15]]\n[14,17,15]', output: 'true' },
    { input: '[[3,17,1],[2,10,14],[14,7,5],[14,4,15]]\n[14,17,16]', output: 'false' },
    { input: '[[1,2,3],[4,5,6],[7,8,9]]\n[7,8,9]',    output: 'true'  },
    { input: '[[1,2,3],[4,5,6],[7,8,9]]\n[7,5,9]',    output: 'false' },
    { input: '[[1,2,3],[4,5,6],[7,8,9]]\n[4,8,9]',    output: 'false' },
    { input: '[[1,2,3],[4,5,6],[7,8,9]]\n[7,8,3]',    output: 'false' },
    { input: '[[1,1,1],[2,1,1],[1,2,1],[1,1,2]]\n[2,2,2]', output: 'true' },
    { input: '[[1,1,3],[3,1,1],[1,3,1]]\n[3,3,3]',    output: 'true'  },
    { input: '[[1,1,3],[3,1,1],[1,3,1]]\n[3,3,4]',    output: 'false' },
    { input: '[[2,2,3],[3,2,2],[2,3,2]]\n[3,3,3]',    output: 'true'  },
    { input: '[[2,2,3],[3,2,2],[2,3,2]]\n[3,3,2]',    output: 'false' },
    { input: '[[5,1,3],[1,5,3],[1,3,5]]\n[5,5,5]',    output: 'true'  },
    { input: '[[5,1,3],[1,5,3],[1,3,5]]\n[5,5,4]',    output: 'false' },
    { input: '[[2,5,3],[1,8,4],[1,7,5]]\n[1,7,5]',    output: 'true'  },
    { input: '[[2,5,3],[1,8,4],[1,7,5]]\n[1,8,4]',    output: 'true'  },
    { input: '[[2,5,3],[1,8,4],[1,7,5]]\n[2,5,3]',    output: 'true'  },
    { input: '[[10,10,10]]\n[10,10,10]',               output: 'true'  },
    { input: '[[10,10,10]]\n[11,10,10]',               output: 'false' },
    { input: '[[1,2,3],[2,3,1],[3,1,2]]\n[3,3,3]',    output: 'false' },
    { input: '[[1,2,3],[2,3,1],[3,2,3]]\n[3,3,3]',    output: 'true'  },
    { input: '[[1,2,2],[2,2,1]]\n[2,2,2]',            output: 'true'  },
    { input: '[[1,2,2],[2,2,1]]\n[2,2,3]',            output: 'false' },
    { input: '[[3,3,5],[5,3,3]]\n[5,3,5]',            output: 'true'  },
    { input: '[[3,3,5],[5,3,3]]\n[5,5,5]',            output: 'false' },
    { input: '[[1,1,5],[1,5,1],[5,1,1]]\n[5,5,5]',    output: 'false' },
    { input: '[[1,1,5],[5,1,1],[1,5,5]]\n[5,5,5]',    output: 'true'  },
    { input: '[[2,1,3],[1,2,3],[3,3,1]]\n[3,3,3]',    output: 'false' },
    { input: '[[2,3,3],[3,2,3],[3,3,2]]\n[3,3,3]',    output: 'true'  },
    { input: '[[1,2,3],[1,2,3]]\n[1,2,3]',            output: 'true'  },
    { input: '[[1,2,4],[1,4,2]]\n[1,4,4]',            output: 'false' },
    { input: '[[1,2,4],[4,2,1]]\n[4,2,4]',            output: 'true'  },
    { input: '[[3,5,3],[1,3,5]]\n[3,5,5]',            output: 'false' },
    { input: '[[3,5,3],[3,3,5]]\n[3,5,5]',            output: 'false' },
    { input: '[[3,5,5],[5,3,5]]\n[5,5,5]',            output: 'false' },
    { input: '[[3,5,5],[5,5,3]]\n[5,5,5]',            output: 'false' },
    { input: '[[5,5,3],[5,3,5],[3,5,5]]\n[5,5,5]',    output: 'false' },
  ],

  // -------------------------------------------------------------------------
  // 90. PARTITION LABELS
  // Input:  s (string)
  // Output: int[] — size of each partition (sorted/ordered)
  // -------------------------------------------------------------------------
  'partition-labels': [
    { input: '"ababcbacadefegdehijhklij"', output: '[9,7,8]'  },
    { input: '"eccbbbbdec"',              output: '[10]'      },
    { input: '"a"',                       output: '[1]'       },
    { input: '"aa"',                      output: '[2]'       },
    { input: '"ab"',                      output: '[1,1]'     },
    { input: '"abc"',                     output: '[1,1,1]'   },
    { input: '"abcabc"',                  output: '[6]'       },
    { input: '"abcdef"',                  output: '[1,1,1,1,1,1]' },
    { input: '"aab"',                     output: '[2,1]'     },
    { input: '"aaab"',                    output: '[3,1]'     },
    { input: '"abba"',                    output: '[4]'       },
    { input: '"abac"',                    output: '[3,1]'     },
    { input: '"caedbfged"',               output: '[1,7,1]'   },
    { input: '"eaaaabaaec"',              output: '[9,1]'     },
    { input: '"abcba"',                   output: '[5]'       },
    { input: '"aabbcc"',                  output: '[2,2,2]'   },
    { input: '"aabb"',                    output: '[2,2]'     },
    { input: '"abcbad"',                  output: '[4,1,1]'   },
    { input: '"aabaab"',                  output: '[6]'       },
    { input: '"abcbca"',                  output: '[5,1]'     },
    { input: '"abcbcd"',                  output: '[5,1]'     },
    { input: '"abcbcad"',                 output: '[7]'       },
    { input: '"abcdaef"',                 output: '[5,1,1]'   },
    { input: '"qiejxzfvvxgtbsx"',         output: '[9,5,1]'   },
    { input: '"aba"',                     output: '[3]'       },
    { input: '"abad"',                    output: '[3,1]'     },
    { input: '"abcde"',                   output: '[1,1,1,1,1]' },
    { input: '"aabba"',                   output: '[5]'       },
    { input: '"abcbad"',                  output: '[4,1,1]'   },
    { input: '"aaaa"',                    output: '[4]'       },
    { input: '"aabcbca"',                 output: '[7]'       },
    { input: '"abcbcda"',                 output: '[7]'       },
    { input: '"abcdabef"',                output: '[7,1]'     },
    { input: '"abcdabef"',                output: '[7,1]'     },
    { input: '"abdeacfgh"',               output: '[5,1,1,1,1]' },
    { input: '"xyzxy"',                   output: '[5]'       },
    { input: '"xyzy"',                    output: '[4]'       },
    { input: '"xyz"',                     output: '[1,1,1]'   },
    { input: '"aabcba"',                  output: '[6]'       },
    { input: '"abcbab"',                  output: '[5,1]'     },
    { input: '"aabcdee"',                 output: '[1,1,3,1,2]' },
    { input: '"abcdefgabcdefg"',          output: '[14]'      },
    { input: '"abcdefgABCDEFG"',          output: '[1,1,1,1,1,1,1,1,1,1,1,1,1,1]' },
    { input: '"aabababa"',                output: '[8]'       },
    { input: '"abab"',                    output: '[4]'       },
    { input: '"abced"',                   output: '[1,1,1,1,1]' },
    { input: '"abcda"',                   output: '[5]'       },
    { input: '"abcdb"',                   output: '[4,1]'     },
    { input: '"abcdc"',                   output: '[4,1]'     },
    { input: '"abcde"',                   output: '[1,1,1,1,1]' },
    { input: '"dcba"',                    output: '[1,1,1,1]' },
    { input: '"dcab"',                    output: '[2,2]'     },
    { input: '"dcab"',                    output: '[2,2]'     },
    { input: '"mnopqrrqponm"',            output: '[12]'      },
    { input: '"mnopqrXYZ"',              output: '[1,1,1,1,1,1,1,1,1]' },
    { input: '"azcbzoabcd"',              output: '[4,5,1]'   },
    { input: '"bab"',                     output: '[3]'       },
    { input: '"bba"',                     output: '[3]'       },
    { input: '"baa"',                     output: '[1,2]'     },
    { input: '"abb"',                     output: '[1,2]'     },
    { input: '"abfcacdbce"',              output: '[9,1]'     },
  ],

  // -------------------------------------------------------------------------
  // 91. VALID PARENTHESIS STRING
  // Input:  s (string) — contains '(', ')', '*'
  // Output: "true" / "false"
  // -------------------------------------------------------------------------
  'valid-parenthesis-string': [
    { input: '"()"',          output: 'true'  },
    { input: '"(*)"',         output: 'true'  },
    { input: '"(*))"',        output: 'true'  },
    { input: '"(("',          output: 'false' },
    { input: '")"',           output: 'false' },
    { input: '"*"',           output: 'true'  },
    { input: '"**"',          output: 'true'  },
    { input: '"()"',          output: 'true'  },
    { input: '"()*"',         output: 'true'  },
    { input: '"(*"',          output: 'true'  },
    { input: '"*)"',          output: 'true'  },
    { input: '""',            output: 'true'  },
    { input: '"((((((*)))))"', output: 'true'  },
    { input: '"(((((*)))))"', output: 'false' },
    { input: '"((((()"',      output: 'false' },
    { input: '")))))"',       output: 'false' },
    { input: '"*****"',       output: 'true'  },
    { input: '"(*)(*)"',      output: 'true'  },
    { input: '"(*(*)"',       output: 'true'  },
    { input: '"(*))(()"',     output: 'false' },
    { input: '"((*)"',        output: 'true'  },
    { input: '"(*())"',       output: 'true'  },
    { input: '"*()"',         output: 'true'  },
    { input: '"(*()"',        output: 'true'  },
    { input: '"((*)"',        output: 'true'  },
    { input: '"((*))("',      output: 'false' },
    { input: '"(((*)))))"',   output: 'false' },
    { input: '"(*(()))"',     output: 'true'  },
    { input: '"(()"',         output: 'false' },
    { input: '"(())"',        output: 'true'  },
    { input: '"(())()"',      output: 'true'  },
    { input: '"(())(("',      output: 'false' },
    { input: '"((()))"',      output: 'true'  },
    { input: '"(((*)))"',     output: 'true'  },
    { input: '")*"',          output: 'false' },
    { input: '"()*("',        output: 'false' },
    { input: '"()()"',        output: 'true'  },
    { input: '"()()()"',      output: 'true'  },
    { input: '"((*(*)))"',    output: 'true'  },
    { input: '"(((((*)))))"', output: 'true'  },
    { input: '"((((()))))"',  output: 'true'  },
    { input: '"(((((*)))))"', output: 'false' },
    { input: '"((((*)"',      output: 'false' },
    { input: '"((((****))))"',output: 'true'  },
    { input: '"((*(*(*))))"', output: 'true'  },
    { input: '"*(("',         output: 'false' },
    { input: '"**(("',        output: 'false' },
    { input: '"**(()"',       output: 'true'  },
    { input: '"**(())"',      output: 'true'  },
    { input: '"**(())*"',     output: 'true'  },
    { input: '"(*()"',        output: 'true'  },
    { input: '"(*)()"',       output: 'true'  },
    { input: '"()(*"',        output: 'true'  },
    { input: '"((*(*)))))*"', output: 'false' },
    { input: '"((*))*(())"',  output: 'true'  },
    { input: '"((**)"',       output: 'true'  },
    { input: '"((**))("',     output: 'false' },
    { input: '"(*(*(*))))"',  output: 'false' },
    { input: '"(*(*(*))))*"', output: 'false' },
    { input: '"(*(*(*)))*"',  output: 'true'  },
    { input: '"((*(*(*)))))"',output: 'false' },
  ],

  // -------------------------------------------------------------------------
  // 92. NON-OVERLAPPING INTERVALS
  // Input:  intervals (int[][])
  // Output: minimum removals (int)
  // -------------------------------------------------------------------------
  'non-overlapping-intervals': [
    { input: '[[1,2],[2,3],[3,4],[1,3]]',  output: '1' },
    { input: '[[1,2],[1,2],[1,2]]',         output: '2' },
    { input: '[[1,2],[2,3]]',              output: '0' },
    { input: '[[1,3],[2,4],[3,5]]',        output: '1' },
    { input: '[[0,2],[1,3],[2,4],[3,5]]',  output: '1' },
    { input: '[[1,100],[11,22],[1,11],[2,12]]', output: '2' },
    { input: '[[1,2]]',                   output: '0' },
    { input: '[[1,2],[3,4]]',             output: '0' },
    { input: '[[1,2],[2,3],[3,4]]',       output: '0' },
    { input: '[[1,3],[2,3]]',             output: '1' },
    { input: '[[1,3],[2,3],[3,4]]',       output: '1' },
    { input: '[[1,4],[2,3]]',             output: '1' },
    { input: '[[1,4],[2,3],[3,5]]',       output: '1' },
    { input: '[[1,4],[2,3],[3,4]]',       output: '1' },
    { input: '[[1,4],[2,3],[3,4],[4,5]]', output: '1' },
    { input: '[[1,5],[2,3],[3,4],[4,5]]', output: '1' },
    { input: '[[1,5],[2,6]]',             output: '1' },
    { input: '[[1,5],[2,4],[3,3]]',       output: '2' },
    { input: '[[0,1],[3,4],[1,2]]',       output: '0' },
    { input: '[[0,1],[1,2],[1,3]]',       output: '1' },
    { input: '[[0,2],[1,3],[1,4],[2,5]]', output: '2' },
    { input: '[[-1,0],[0,1]]',            output: '0' },
    { input: '[[-1,1],[0,2]]',            output: '1' },
    { input: '[[-2,-1],[-1,0],[0,1]]',    output: '0' },
    { input: '[[-2,1],[-1,3]]',           output: '1' },
    { input: '[[1,2],[2,3],[3,4],[4,5]]', output: '0' },
    { input: '[[1,2],[1,3],[1,4],[1,5]]', output: '3' },
    { input: '[[1,2],[2,4],[3,4]]',       output: '1' },
    { input: '[[1,4],[3,5],[2,3]]',       output: '1' },
    { input: '[[1,3],[1,4],[2,3],[3,4]]', output: '2' },
    { input: '[[5,8],[3,7],[2,5]]',       output: '1' },
    { input: '[[0,5],[1,2],[2,3],[3,4]]', output: '1' },
    { input: '[[0,10],[1,2]]',            output: '1' },
    { input: '[[0,10],[5,8],[4,7]]',      output: '2' },
    { input: '[[0,1],[1,2],[2,3],[3,4],[4,5]]', output: '0' },
    { input: '[[0,1],[0,2],[0,3]]',       output: '2' },
    { input: '[[1,2],[3,4],[2,3]]',       output: '0' },
    { input: '[[1,2],[3,4],[4,5],[2,3]]', output: '0' },
    { input: '[[1,4],[2,3],[3,4],[4,6]]', output: '1' },
    { input: '[[3,4],[2,4],[1,4]]',       output: '2' },
    { input: '[[1,2],[2,3],[3,4],[3,5]]', output: '1' },
    { input: '[[1,2],[1,3],[2,3],[3,4]]', output: '1' },
    { input: '[[1,2],[1,3],[1,4],[3,4]]', output: '2' },
    { input: '[[1,10],[2,3],[4,5],[6,7]]',output: '1' },
    { input: '[[1,10],[1,5],[5,10]]',     output: '1' },
    { input: '[[1,2],[3,6],[5,8],[7,9]]', output: '1' },
    { input: '[[1,4],[2,5],[5,7]]',       output: '1' },
    { input: '[[1,2],[2,3],[3,4],[3,5],[4,5]]', output: '1' },
    { input: '[[1,2],[3,4],[4,5],[4,6]]', output: '1' },
    { input: '[[1,5],[2,3],[3,4],[4,6]]', output: '1' },
    { input: '[[1,2],[3,4],[5,6],[1,6]]', output: '1' },
    { input: '[[1,6],[3,4],[5,6],[1,3]]', output: '1' },
    { input: '[[1,3],[3,5],[5,7],[3,6]]', output: '1' },
    { input: '[[1,2],[1,3],[2,3]]',       output: '1' },
    { input: '[[1,2],[1,3],[1,4]]',       output: '2' },
    { input: '[[1,3],[2,4],[3,5],[4,6]]', output: '1' },
    { input: '[[2,3],[3,5],[1,4],[3,4]]', output: '1' },
    { input: '[[1,4],[1,2],[3,4]]',       output: '1' },
    { input: '[[1,10],[2,4],[4,7],[8,10]]',output: '1'},
    { input: '[[1,2],[2,3],[2,4],[3,4]]', output: '1' },
    { input: '[[1,2],[3,5],[4,6],[6,8]]', output: '1' },
  ],

  // -------------------------------------------------------------------------
  // 93. MEETING ROOMS
  // Input:  intervals (int[][])
  // Output: "true" if can attend all, "false" otherwise
  // -------------------------------------------------------------------------
  'meeting-rooms': [
    { input: '[[0,30],[5,10],[15,20]]',    output: 'false' },
    { input: '[[7,10],[2,4]]',             output: 'true'  },
    { input: '[]',                         output: 'true'  },
    { input: '[[0,1]]',                    output: 'true'  },
    { input: '[[0,1],[1,2]]',              output: 'true'  },
    { input: '[[0,1],[0,2]]',              output: 'false' },
    { input: '[[1,2],[3,4],[5,6]]',        output: 'true'  },
    { input: '[[1,2],[2,3],[3,4]]',        output: 'true'  },
    { input: '[[1,3],[2,4]]',              output: 'false' },
    { input: '[[1,4],[2,3]]',              output: 'false' },
    { input: '[[1,2],[3,4],[2,5]]',        output: 'false' },
    { input: '[[1,5],[5,10]]',             output: 'true'  },
    { input: '[[1,5],[4,10]]',             output: 'false' },
    { input: '[[1,5],[6,10]]',             output: 'true'  },
    { input: '[[0,30]]',                   output: 'true'  },
    { input: '[[1,2],[3,4],[5,6],[4,7]]',  output: 'false' },
    { input: '[[1,2],[3,4],[5,6],[7,8]]',  output: 'true'  },
    { input: '[[2,15],[18,20]]',           output: 'true'  },
    { input: '[[1,10],[10,20]]',           output: 'true'  },
    { input: '[[1,10],[9,20]]',            output: 'false' },
    { input: '[[1,2],[2,3],[3,4],[4,5]]',  output: 'true'  },
    { input: '[[1,3],[2,3],[3,4]]',        output: 'false' },
    { input: '[[1,2],[1,3],[3,4]]',        output: 'false' },
    { input: '[[1,4],[4,5],[4,6]]',        output: 'false' },
    { input: '[[1,4],[5,6],[7,8]]',        output: 'true'  },
    { input: '[[5,8],[9,15]]',             output: 'true'  },
    { input: '[[5,8],[7,9]]',              output: 'false' },
    { input: '[[0,5],[5,10],[10,15]]',     output: 'true'  },
    { input: '[[0,5],[4,10],[11,15]]',     output: 'false' },
    { input: '[[0,5],[6,10],[11,15]]',     output: 'true'  },
    { input: '[[1,2],[3,4],[5,6],[1,6]]',  output: 'false' },
    { input: '[[1,2],[3,4],[3,5],[5,6]]',  output: 'false' },
    { input: '[[1,2],[3,4],[5,7],[6,8]]',  output: 'false' },
    { input: '[[-5,0],[0,5]]',             output: 'true'  },
    { input: '[[-5,0],[-1,5]]',            output: 'false' },
    { input: '[[100,200],[200,300]]',      output: 'true'  },
    { input: '[[100,200],[150,300]]',      output: 'false' },
    { input: '[[1,3],[3,5],[5,7],[7,9]]',  output: 'true'  },
    { input: '[[1,3],[3,5],[4,7],[7,9]]',  output: 'false' },
    { input: '[[1,2],[3,5],[4,6],[7,9]]',  output: 'false' },
    { input: '[[1,2],[3,4],[5,6],[5,7]]',  output: 'false' },
    { input: '[[1,2],[3,4],[5,6],[7,8],[8,9]]', output: 'true' },
    { input: '[[1,2],[3,4],[5,6],[7,8],[6,9]]', output: 'false' },
    { input: '[[2,3],[4,5],[6,7],[8,9]]',  output: 'true'  },
    { input: '[[2,3],[3,4],[4,5],[5,6]]',  output: 'true'  },
    { input: '[[0,10],[10,20],[20,30]]',   output: 'true'  },
    { input: '[[0,10],[9,20],[20,30]]',    output: 'false' },
    { input: '[[1,5],[3,5],[5,10]]',       output: 'false' },
    { input: '[[1,2],[4,5],[2,3],[3,4]]',  output: 'true'  },
    { input: '[[1,2],[4,5],[2,4],[3,5]]',  output: 'false' },
    { input: '[[5,10],[1,5]]',             output: 'true'  },
    { input: '[[5,10],[1,6]]',             output: 'false' },
    { input: '[[0,1],[3,4],[2,3]]',        output: 'true'  },
    { input: '[[0,1],[3,4],[1,2]]',        output: 'true'  },
    { input: '[[0,1],[2,3],[1,4]]',        output: 'false' },
    { input: '[[1,2],[3,4],[5,6],[7,8],[9,10]]', output: 'true'  },
    { input: '[[1,3],[2,4],[5,7],[6,8]]',  output: 'false' },
    { input: '[[0,4],[1,2],[3,5]]',        output: 'false' },
    { input: '[[0,4],[4,8]]',              output: 'true'  },
    { input: '[[0,4],[4,8],[8,12]]',       output: 'true'  },
    { input: '[[0,4],[3,8],[8,12]]',       output: 'false' },
  ],

  // -------------------------------------------------------------------------
  // 94. MEETING ROOMS II
  // Input:  intervals (int[][])
  // Output: minimum number of conference rooms required (int)
  // -------------------------------------------------------------------------
  'meeting-rooms-ii': [
    { input: '[[0,30],[5,10],[15,20]]',     output: '2' },
    { input: '[[7,10],[2,4]]',              output: '1' },
    { input: '[]',                          output: '0' },
    { input: '[[0,1]]',                     output: '1' },
    { input: '[[0,1],[2,3]]',               output: '1' },
    { input: '[[0,1],[0,2]]',               output: '2' },
    { input: '[[0,1],[1,2]]',               output: '1' },
    { input: '[[1,4],[2,5],[9,12]]',        output: '2' },
    { input: '[[1,4],[2,5],[3,6]]',         output: '3' },
    { input: '[[1,2],[1,3],[1,4]]',         output: '3' },
    { input: '[[1,10],[2,3],[4,5]]',        output: '2' },
    { input: '[[1,10],[2,5],[3,4]]',        output: '3' },
    { input: '[[1,2],[2,3],[3,4]]',         output: '1' },
    { input: '[[0,5],[1,2],[3,6]]',         output: '2' },
    { input: '[[0,10],[1,3],[2,5],[4,8]]',  output: '3' },
    { input: '[[1,5],[2,3],[4,6],[7,9]]',   output: '2' },
    { input: '[[1,2],[3,4],[5,6],[7,8]]',   output: '1' },
    { input: '[[1,4],[2,3],[3,5]]',         output: '2' },
    { input: '[[1,4],[4,5]]',               output: '1' },
    { input: '[[1,3],[1,3],[1,3]]',         output: '3' },
    { input: '[[0,1],[2,3],[4,5],[0,5]]',   output: '2' },
    { input: '[[1,2],[2,4],[3,5]]',         output: '2' },
    { input: '[[0,30],[5,10],[10,20],[15,25]]', output: '3' },
    { input: '[[1,10],[2,3],[4,5],[6,7]]',  output: '2' },
    { input: '[[1,5],[2,6],[3,7],[4,8]]',   output: '4' },
    { input: '[[0,5],[0,5],[0,5]]',         output: '3' },
    { input: '[[1,2],[3,4],[5,6]]',         output: '1' },
    { input: '[[1,2],[1,3],[2,3]]',         output: '2' },
    { input: '[[5,10],[1,3],[2,4]]',        output: '2' },
    { input: '[[5,8],[3,7],[2,5]]',         output: '2' },
    { input: '[[1,4],[2,3],[2,5],[3,4]]',   output: '3' },
    { input: '[[9,10],[4,9],[4,17]]',       output: '2' },
    { input: '[[0,4],[1,2],[2,3],[3,5]]',   output: '2' },
    { input: '[[0,1],[1,2],[2,3],[3,4]]',   output: '1' },
    { input: '[[0,2],[1,5],[2,4],[3,6]]',   output: '3' },
    { input: '[[2,4],[1,3],[3,5]]',         output: '2' },
    { input: '[[1,3],[2,4],[3,5],[4,6]]',   output: '2' },
    { input: '[[0,10],[5,8],[4,12]]',       output: '3' },
    { input: '[[0,5],[1,3],[2,4],[5,9]]',   output: '3' },
    { input: '[[0,5],[5,10],[10,15]]',      output: '1' },
    { input: '[[0,5],[4,10],[10,15]]',      output: '2' },
    { input: '[[0,5],[0,10],[0,15]]',       output: '3' },
    { input: '[[1,5],[2,3],[4,6],[4,7]]',   output: '3' },
    { input: '[[1,2],[3,5],[4,6],[5,8]]',   output: '2' },
    { input: '[[0,15],[1,5],[5,10],[10,15]]', output: '2' },
    { input: '[[1,3],[2,5],[3,7]]',         output: '2' },
    { input: '[[0,1],[10,11],[20,21]]',     output: '1' },
    { input: '[[0,1],[0,1],[0,1],[0,1]]',   output: '4' },
    { input: '[[1,4],[2,3],[3,4],[4,5]]',   output: '2' },
    { input: '[[1,10],[5,10],[10,15]]',     output: '2' },
    { input: '[[1,10],[2,5],[5,10]]',       output: '2' },
    { input: '[[1,10],[1,5],[5,10]]',       output: '2' },
    { input: '[[1,10],[3,5],[7,9]]',        output: '2' },
    { input: '[[1,10],[3,5],[7,9],[11,13]]',output: '2' },
    { input: '[[1,4],[2,5],[3,6],[4,7]]',   output: '3' },
    { input: '[[1,2],[2,3],[2,4],[3,4]]',   output: '2' },
    { input: '[[1,5],[1,5],[5,10],[5,10]]', output: '2' },
    { input: '[[1,4],[3,6],[5,8],[7,10]]',  output: '2' },
    { input: '[[0,5],[1,2],[3,4],[4,6]]',   output: '2' },
    { input: '[[0,1],[0,2],[0,3],[0,4]]',   output: '4' },
  ],

  // -------------------------------------------------------------------------
  // 95. MINIMUM INTERVAL TO INCLUDE EACH QUERY
  // Input:  intervals (int[][]) \n queries (int[])
  // Output: int[] — for each query, size of smallest interval containing it
  //         (-1 if none)
  // -------------------------------------------------------------------------
  'minimum-interval-to-include-each-query': [
    { input: '[[1,4],[2,4],[3,6],[4,4]]\n[2,3,4,5]',         output: '[3,3,1,4]'         },
    { input: '[[2,3],[2,5],[1,8],[20,25]]\n[2,19,22]',        output: '[2,8,-1]'          },
    { input: '[[1,2]]\n[1,2,3]',                              output: '[2,2,-1]'          },
    { input: '[[1,4]]\n[1,2,3,4,5]',                         output: '[4,4,4,4,-1]'      },
    { input: '[[1,1]]\n[1]',                                  output: '[1]'               },
    { input: '[[1,1]]\n[2]',                                  output: '[-1]'              },
    { input: '[[1,5],[2,3]]\n[2,3]',                          output: '[2,2]'             },
    { input: '[[1,5],[2,3]]\n[1,4,5]',                        output: '[5,5,5]'           },
    { input: '[[1,4],[2,4],[3,6],[4,4]]\n[1,2,3,4,5,6]',
      output: '[4,3,3,1,4,4]' },
    { input: '[[1,3],[2,5],[1,10]]\n[1,2,3,5]',               output: '[3,3,3,5]'         },
    { input: '[[1,10],[2,5],[1,4]]\n[3,4,5]',                 output: '[4,4,5]'           },
    { input: '[[3,9],[1,5],[7,12],[4,8]]\n[3,7,8]',           output: '[5,5,6]'           },
    { input: '[[10,20],[20,30]]\n[15,20,25]',                 output: '[11,1,11]'         },
    { input: '[[1,100]]\n[1,50,100]',                        output: '[100,100,100]'     },
    { input: '[[1,2],[3,4],[5,6]]\n[1,3,5,7]',               output: '[2,2,2,-1]'        },
    { input: '[[1,6],[2,3],[4,5]]\n[1,2,3,4,5,6]',            output: '[6,2,2,2,2,6]'    },
    { input: '[[2,4],[1,3]]\n[1,2,3,4,5]',                   output: '[3,3,3,3,-1]'      },
    { input: '[[1,3],[2,4],[1,2]]\n[1,2,3]',                  output: '[2,2,3]'           },
    { input: '[[5,5],[1,5]]\n[3,5]',                          output: '[5,1]'             },
    { input: '[[1,4],[2,3],[3,4],[4,5]]\n[1,2,3,4,5]',        output: '[4,2,2,2,2]'      },
    { input: '[[1,2],[1,3],[1,4],[1,5]]\n[1,2,3,4,5]',        output: '[2,2,3,4,5]'      },
    { input: '[[5,8],[1,4],[3,6]]\n[1,2,3,4,5,6,7,8]',
      output: '[4,4,4,4,4,4,4,4]' },
    { input: '[[1,10],[3,3]]\n[3]',                           output: '[1]'               },
    { input: '[[1,3],[3,5]]\n[3]',                            output: '[2]'               },
    { input: '[[1,10],[2,9],[3,8],[4,7],[5,6]]\n[5,6]',       output: '[2,2]'             },
    { input: '[[1,10],[2,9],[3,8],[4,7],[5,6]]\n[1,10]',      output: '[10,10]'           },
    { input: '[[1,2],[3,4],[5,6],[7,8]]\n[1,3,5,7]',          output: '[2,2,2,2]'         },
    { input: '[[1,3],[2,5],[4,7],[6,9]]\n[2,4,6,8]',          output: '[3,4,4,4]'         },
    { input: '[[100,200],[150,250]]\n[100,150,200,250]',
      output: '[101,101,101,-1]' },
    { input: '[[1,5],[3,8],[2,4]]\n[1,3,4,5,8]',              output: '[5,3,3,5,6]'       },
  ],

  // -------------------------------------------------------------------------
  // 96. ROTATE IMAGE
  // Input:  n×n matrix (int[][])
  // Output: rotated matrix (int[][]) — 90° clockwise
  // -------------------------------------------------------------------------
  'rotate-image': [
    { input: '[[1,2,3],[4,5,6],[7,8,9]]',               output: '[[7,4,1],[8,5,2],[9,6,3]]'                   },
    { input: '[[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]',
      output: '[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]' },
    { input: '[[1]]',                                   output: '[[1]]'                                      },
    { input: '[[1,2],[3,4]]',                           output: '[[3,1],[4,2]]'                              },
    { input: '[[0,0],[0,0]]',                           output: '[[0,0],[0,0]]'                              },
    { input: '[[1,0],[0,1]]',                           output: '[[0,1],[1,0]]'                              },
    { input: '[[1,2,3],[4,5,6],[7,8,9]]',               output: '[[7,4,1],[8,5,2],[9,6,3]]'                   },
    { input: '[[9,8,7],[6,5,4],[3,2,1]]',               output: '[[3,6,9],[2,5,8],[1,4,7]]'                   },
    { input: '[[1,1,1],[1,1,1],[1,1,1]]',               output: '[[1,1,1],[1,1,1],[1,1,1]]'                   },
    { input: '[[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16]]',
      output: '[[13,9,5,1],[14,10,6,2],[15,11,7,3],[16,12,8,4]]' },
    { input: '[[1,2],[1,2]]',                           output: '[[1,1],[2,2]]'                              },
    { input: '[[1,0,0],[0,1,0],[0,0,1]]',               output: '[[0,0,1],[0,1,0],[1,0,0]]'                   },
    { input: '[[0,1,0],[0,1,0],[0,1,0]]',               output: '[[0,0,0],[1,1,1],[0,0,0]]'                   },
    { input: '[[1,0],[0,0]]',                           output: '[[0,1],[0,0]]'                              },
    { input: '[[0,0],[0,1]]',                           output: '[[0,0],[1,0]]'                              },
    { input: '[[0,0],[1,0]]',                           output: '[[1,0],[0,0]]'                              },
    { input: '[[0,1],[0,0]]',                           output: '[[0,0],[0,1]]'                              },
    { input: '[[-1,-2,-3],[-4,-5,-6],[-7,-8,-9]]',      output: '[[-7,-4,-1],[-8,-5,-2],[-9,-6,-3]]'          },
    { input: '[[1,2,3,4,5],[6,7,8,9,10],[11,12,13,14,15],[16,17,18,19,20],[21,22,23,24,25]]',
      output: '[[21,16,11,6,1],[22,17,12,7,2],[23,18,13,8,3],[24,19,14,9,4],[25,20,15,10,5]]' },
    { input: '[[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]]',
      output: '[[0,0,0,1],[0,0,1,0],[0,1,0,0],[1,0,0,0]]' },
    { input: '[[1,2,3,4],[0,0,0,0],[0,0,0,0],[4,3,2,1]]',
      output: '[[4,0,0,1],[3,0,0,2],[2,0,0,3],[1,0,0,4]]' },
    { input: '[[1,3],[2,4]]',                           output: '[[2,1],[4,3]]'                              },
    { input: '[[1,1],[1,1]]',                           output: '[[1,1],[1,1]]'                              },
    { input: '[[7]]',                                   output: '[[7]]'                                      },
    { input: '[[1,2,3],[0,0,0],[3,2,1]]',               output: '[[3,0,1],[2,0,2],[1,0,3]]'                   },
    { input: '[[1,0,1],[0,1,0],[1,0,1]]',               output: '[[1,0,1],[0,1,0],[1,0,1]]'                   },
    { input: '[[1,2,3],[1,2,3],[1,2,3]]',               output: '[[1,1,1],[2,2,2],[3,3,3]]'                   },
    { input: '[[3,2,1],[3,2,1],[3,2,1]]',               output: '[[3,3,3],[2,2,2],[1,1,1]]'                   },
    { input: '[[1,0,0],[1,0,0],[1,0,0]]',               output: '[[1,1,1],[0,0,0],[0,0,0]]'                   },
    { input: '[[0,0,1],[0,0,1],[0,0,1]]',               output: '[[0,0,0],[0,0,0],[1,1,1]]'                   },
  ],

  // -------------------------------------------------------------------------
  // 97. SPIRAL MATRIX
  // Input:  m×n matrix (int[][])
  // Output: int[] — spiral order
  // -------------------------------------------------------------------------
  'spiral-matrix': [
    { input: '[[1,2,3],[4,5,6],[7,8,9]]',             output: '[1,2,3,6,9,8,7,4,5]'             },
    { input: '[[1,2,3,4],[5,6,7,8],[9,10,11,12]]',    output: '[1,2,3,4,8,12,11,10,9,5,6,7]'    },
    { input: '[[1]]',                                 output: '[1]'                             },
    { input: '[[1,2],[3,4]]',                         output: '[1,2,4,3]'                       },
    { input: '[[1,2,3]]',                             output: '[1,2,3]'                         },
    { input: '[[1],[2],[3]]',                         output: '[1,2,3]'                         },
    { input: '[[1,2,3,4]]',                           output: '[1,2,3,4]'                       },
    { input: '[[1],[2],[3],[4]]',                     output: '[1,2,3,4]'                       },
    { input: '[[1,2],[3,4],[5,6]]',                   output: '[1,2,4,6,5,3]'                   },
    { input: '[[1,2,3],[4,5,6]]',                     output: '[1,2,3,6,5,4]'                   },
    { input: '[[1,2,3,4,5]]',                         output: '[1,2,3,4,5]'                     },
    { input: '[[1],[2],[3],[4],[5]]',                 output: '[1,2,3,4,5]'                     },
    { input: '[[1,2,3,4],[5,6,7,8]]',                 output: '[1,2,3,4,8,7,6,5]'               },
    { input: '[[1,2],[3,4],[5,6],[7,8]]',             output: '[1,2,4,6,8,7,5,3]'               },
    { input: '[[1,2,3],[4,5,6],[7,8,9],[10,11,12]]',  output: '[1,2,3,6,9,12,11,10,7,4,5,8]'   },
    { input: '[[7,8],[9,10]]',                        output: '[7,8,10,9]'                      },
    { input: '[[1,2,3,4,5],[6,7,8,9,10],[11,12,13,14,15],[16,17,18,19,20],[21,22,23,24,25]]',
      output: '[1,2,3,4,5,10,15,20,25,24,23,22,21,16,11,6,7,8,9,14,19,18,17,12,13]' },
    { input: '[[1,2],[3,4],[5,6],[7,8],[9,10]]',      output: '[1,2,4,6,8,10,9,7,5,3]'         },
    { input: '[[1,2,3,4,5],[6,7,8,9,10]]',            output: '[1,2,3,4,5,10,9,8,7,6]'         },
    { input: '[[1,2],[3,4],[5,6],[7,8],[9,10],[11,12]]',
      output: '[1,2,4,6,8,10,12,11,9,7,5,3]' },
    { input: '[[0,0,0],[0,0,0],[0,0,0]]',             output: '[0,0,0,0,0,0,0,0,0]'             },
    { input: '[[-1,-2,-3],[-4,-5,-6],[-7,-8,-9]]',    output: '[-1,-2,-3,-6,-9,-8,-7,-4,-5]'    },
    { input: '[[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16]]',
      output: '[1,2,3,4,8,12,16,15,14,13,9,5,6,7,11,10]' },
    { input: '[[1,2,3],[4,5,6],[7,8,9],[10,11,12],[13,14,15]]',
      output: '[1,2,3,6,9,12,15,14,13,10,7,4,5,8,11]' },
    { input: '[[1,2,3,4,5,6]]',                       output: '[1,2,3,4,5,6]'                   },
    { input: '[[1],[2],[3],[4],[5],[6]]',              output: '[1,2,3,4,5,6]'                   },
    { input: '[[1,2,3,4,5],[6,7,8,9,10],[11,12,13,14,15]]',
      output: '[1,2,3,4,5,10,15,14,13,12,11,6,7,8,9]' },
    { input: '[[1,2,3],[4,5,6],[7,8,9],[10,11,12]]',  output: '[1,2,3,6,9,12,11,10,7,4,5,8]'   },
    { input: '[[2,3,4],[5,6,7],[8,9,10]]',            output: '[2,3,4,7,10,9,8,5,6]'            },
    { input: '[[1,1,1],[1,1,1],[1,1,1]]',             output: '[1,1,1,1,1,1,1,1,1]'             },
  ],

  // -------------------------------------------------------------------------
  // 98. SET MATRIX ZEROES
  // Input:  matrix (int[][])
  // Output: modified matrix (int[][])
  // -------------------------------------------------------------------------
  'set-matrix-zeroes': [
    { input: '[[1,1,1],[1,0,1],[1,1,1]]',              output: '[[1,0,1],[0,0,0],[1,0,1]]'                    },
    { input: '[[0,1,2,0],[3,4,5,2],[1,3,1,5]]',        output: '[[0,0,0,0],[0,4,5,0],[0,3,1,0]]'             },
    { input: '[[1]]',                                  output: '[[1]]'                                       },
    { input: '[[0]]',                                  output: '[[0]]'                                       },
    { input: '[[1,0],[0,1]]',                          output: '[[0,0],[0,0]]'                               },
    { input: '[[1,1],[1,0]]',                          output: '[[1,0],[0,0]]'                               },
    { input: '[[0,1],[1,1]]',                          output: '[[0,0],[0,1]]'                               },
    { input: '[[1,2,3],[4,5,6],[7,8,9]]',              output: '[[1,2,3],[4,5,6],[7,8,9]]'                    },
    { input: '[[1,2,0],[4,5,6],[7,8,9]]',              output: '[[0,0,0],[4,5,0],[7,8,0]]'                   },
    { input: '[[0,2,3],[4,5,6],[7,8,9]]',              output: '[[0,0,0],[0,5,6],[0,8,9]]'                   },
    { input: '[[1,0,3],[4,5,6],[7,8,9]]',              output: '[[0,0,0],[4,0,6],[7,0,9]]'                   },
    { input: '[[1,2,3],[0,5,6],[7,8,9]]',              output: '[[0,2,3],[0,0,0],[0,8,9]]'                   },
    { input: '[[0,0,0],[0,0,0],[0,0,0]]',              output: '[[0,0,0],[0,0,0],[0,0,0]]'                    },
    { input: '[[1,1,1],[1,1,1],[1,1,1]]',              output: '[[1,1,1],[1,1,1],[1,1,1]]'                    },
    { input: '[[1,0,1],[0,1,0],[1,0,1]]',              output: '[[0,0,0],[0,0,0],[0,0,0]]'                    },
    { input: '[[1,2,3,4],[5,0,7,8],[9,10,11,12]]',     output: '[[1,0,3,4],[0,0,0,0],[9,0,11,12]]'           },
    { input: '[[1,2,3,4],[5,6,7,8],[9,10,0,12]]',      output: '[[1,2,0,4],[5,6,0,8],[0,0,0,0]]'             },
    { input: '[[0,2],[3,4]]',                          output: '[[0,0],[0,4]]'                               },
    { input: '[[1,2],[3,0]]',                          output: '[[1,0],[0,0]]'                               },
    { input: '[[0,0],[0,0]]',                          output: '[[0,0],[0,0]]'                               },
    { input: '[[1,2,3],[4,5,6],[7,8,0]]',              output: '[[1,2,0],[4,5,0],[0,0,0]]'                   },
    { input: '[[1,2,3],[4,5,6],[0,8,9]]',              output: '[[0,2,3],[0,5,6],[0,0,0]]'                   },
    { input: '[[1,0,3,4],[5,6,7,8],[9,10,11,0],[13,14,15,16]]',
      output: '[[0,0,0,0],[5,0,7,0],[0,0,0,0],[13,0,15,0]]' },
    { input: '[[1,2,3],[4,0,6],[7,8,9]]',              output: '[[1,0,3],[0,0,0],[7,0,9]]'                   },
    { input: '[[1,2,3],[4,5,6],[7,0,9]]',              output: '[[1,0,3],[4,0,6],[0,0,0]]'                   },
    { input: '[[0,1,1],[1,1,1],[1,1,1]]',              output: '[[0,0,0],[0,1,1],[0,1,1]]'                   },
    { input: '[[1,1,1],[0,1,1],[1,1,1]]',              output: '[[0,1,1],[0,0,0],[0,1,1]]'                   },
    { input: '[[1,1,1],[1,1,0],[1,1,1]]',              output: '[[1,1,0],[0,0,0],[1,1,0]]'                   },
    { input: '[[1,1,0],[1,1,1],[1,1,1]]',              output: '[[0,0,0],[1,1,0],[1,1,0]]'                   },
    { input: '[[5,0,5],[5,5,5],[5,5,5]]',              output: '[[0,0,0],[5,0,5],[5,0,5]]'                   },
  ],

  // -------------------------------------------------------------------------
  // 99. HAPPY NUMBER
  // Input:  n (int)
  // Output: "true" / "false"
  // -------------------------------------------------------------------------
  'happy-number': [
    { input: '19',   output: 'true'  },
    { input: '2',    output: 'false' },
    { input: '1',    output: 'true'  },
    { input: '7',    output: 'true'  },
    { input: '10',   output: 'true'  },
    { input: '13',   output: 'true'  },
    { input: '4',    output: 'false' },
    { input: '11',   output: 'false' },
    { input: '100',  output: 'true'  },
    { input: '116',  output: 'false' },
    { input: '133',  output: 'false' },
    { input: '23',   output: 'true'  },
    { input: '28',   output: 'true'  },
    { input: '44',   output: 'false' },
    { input: '49',   output: 'true'  },
    { input: '68',   output: 'true'  },
    { input: '70',   output: 'true'  },
    { input: '74',   output: 'false' },
    { input: '82',   output: 'true'  },
    { input: '86',   output: 'false' },
    { input: '91',   output: 'true'  },
    { input: '97',   output: 'true'  },
    { input: '103',  output: 'false' },
    { input: '130',  output: 'true'  },
    { input: '139',  output: 'true'  },
    { input: '143',  output: 'false' },
    { input: '148',  output: 'true'  },
    { input: '160',  output: 'false' },
    { input: '171',  output: 'false' },
    { input: '174',  output: 'false' },
    { input: '176',  output: 'false' },
    { input: '188',  output: 'true'  },
    { input: '190',  output: 'false' },
    { input: '192',  output: 'false' },
    { input: '193',  output: 'false' },
    { input: '203',  output: 'true'  },
    { input: '208',  output: 'false' },
    { input: '210',  output: 'false' },
    { input: '211',  output: 'false' },
    { input: '212',  output: 'false' },
    { input: '213',  output: 'true'  },
    { input: '214',  output: 'false' },
    { input: '219',  output: 'false' },
    { input: '226',  output: 'false' },
    { input: '230',  output: 'false' },
    { input: '236',  output: 'false' },
    { input: '237',  output: 'false' },
    { input: '263',  output: 'false' },
    { input: '264',  output: 'false' },
    { input: '269',  output: 'false' },
    { input: '271',  output: 'false' },
    { input: '274',  output: 'false' },
    { input: '277',  output: 'false' },
    { input: '278',  output: 'false' },
    { input: '281',  output: 'false' },
    { input: '282',  output: 'false' },
    { input: '283',  output: 'true'  },
    { input: '1000', output: 'true'  },
    { input: '999',  output: 'false' },
    { input: '9999', output: 'false' },
    { input: '3',    output: 'false' },
  ],

  // -------------------------------------------------------------------------
  // 100. PLUS ONE
  // Input:  digits (int[])
  // Output: digits after +1 (int[])
  // -------------------------------------------------------------------------
  'plus-one': [
    { input: '[1,2,3]',         output: '[1,2,4]'      },
    { input: '[4,3,2,1]',       output: '[4,3,2,2]'    },
    { input: '[9]',             output: '[1,0]'        },
    { input: '[9,9]',           output: '[1,0,0]'      },
    { input: '[9,9,9]',         output: '[1,0,0,0]'    },
    { input: '[0]',             output: '[1]'          },
    { input: '[1]',             output: '[2]'          },
    { input: '[8]',             output: '[9]'          },
    { input: '[1,0]',           output: '[1,1]'        },
    { input: '[1,9]',           output: '[2,0]'        },
    { input: '[2,9]',           output: '[3,0]'        },
    { input: '[9,0]',           output: '[9,1]'        },
    { input: '[1,2,9]',         output: '[1,3,0]'      },
    { input: '[1,9,9]',         output: '[2,0,0]'      },
    { input: '[9,9,0]',         output: '[9,9,1]'      },
    { input: '[9,9,9,9]',       output: '[1,0,0,0,0]'  },
    { input: '[1,2,3,4]',       output: '[1,2,3,5]'    },
    { input: '[5,5,5]',         output: '[5,5,6]'      },
    { input: '[3,6,9]',         output: '[3,7,0]'      },
    { input: '[2,4,8]',         output: '[2,4,9]'      },
    { input: '[1,0,0,0]',       output: '[1,0,0,1]'    },
    { input: '[9,0,0,0]',       output: '[9,0,0,1]'    },
    { input: '[1,9,0,0]',       output: '[1,9,0,1]'    },
    { input: '[1,0,9,9]',       output: '[1,1,0,0]'    },
    { input: '[9,9,0,9]',       output: '[9,9,1,0]'    },
    { input: '[9,9,9,0]',       output: '[9,9,9,1]'    },
    { input: '[6,1,4,5,3,9,0,1,9,5,1,8,6,7,0,5,5,4,3]',
      output: '[6,1,4,5,3,9,0,1,9,5,1,8,6,7,0,5,5,4,4]' },
    { input: '[1,1,1,1,1,1]',   output: '[1,1,1,1,1,2]' },
    { input: '[5]',             output: '[6]'          },
    { input: '[9,8,7,6,5,4,3,2,1,0]',
      output: '[9,8,7,6,5,4,3,2,1,1]' },
    { input: '[7,2,8,5,0,9,1,2,9,5,3,6,6,7,3,2,8,4,3,7,9,5,7,7,4,7,4,9,4,7,0,1,1,1,7,4,0,0,6]',
      output: '[7,2,8,5,0,9,1,2,9,5,3,6,6,7,3,2,8,4,3,7,9,5,7,7,4,7,4,9,4,7,0,1,1,1,7,4,0,0,7]' },
    { input: '[1,0,1]',         output: '[1,0,2]'      },
    { input: '[2,0,9]',         output: '[2,1,0]'      },
    { input: '[9,9,8]',         output: '[9,9,9]'      },
    { input: '[5,0,0]',         output: '[5,0,1]'      },
    { input: '[9,0,9]',         output: '[9,1,0]'      },
    { input: '[0,0,0,1]',       output: '[0,0,0,2]'    },
    { input: '[0,0,9,9]',       output: '[0,1,0,0]'    },
    { input: '[0,9,9,9]',       output: '[1,0,0,0]'    },
    { input: '[1,2,3,4,5,6,7,8,9]',
      output: '[1,2,3,4,5,6,7,9,0]' },
    { input: '[9,9,9,9,9,9]',   output: '[1,0,0,0,0,0,0]' },
    { input: '[2]',             output: '[3]'          },
    { input: '[3]',             output: '[4]'          },
    { input: '[4]',             output: '[5]'          },
    { input: '[6]',             output: '[7]'          },
    { input: '[7]',             output: '[8]'          },
    { input: '[3,9]',           output: '[4,0]'        },
    { input: '[4,9,9]',         output: '[5,0,0]'      },
    { input: '[1,1,9,9,9]',     output: '[1,2,0,0,0]'  },
    { input: '[8,9,9,9]',       output: '[9,0,0,0]'    },
    { input: '[1,0,0,1]',       output: '[1,0,0,2]'    },
    { input: '[1,1,0,1]',       output: '[1,1,0,2]'    },
    { input: '[1,0,1,0]',       output: '[1,0,1,1]'    },
    { input: '[1,0,0,9]',       output: '[1,0,1,0]'    },
    { input: '[2,9,9]',         output: '[3,0,0]'      },
    { input: '[1,2,3,9]',       output: '[1,2,4,0]'    },
    { input: '[3,2,1]',         output: '[3,2,2]'      },
    { input: '[5,6,7]',         output: '[5,6,8]'      },
    { input: '[9,1,0]',         output: '[9,1,1]'      },
    { input: '[9,9,1]',         output: '[9,9,2]'      },
    { input: '[9,9,9,1]',       output: '[9,9,9,2]'    },
  ],

  // -------------------------------------------------------------------------
  // 101. POWX-N
  // Input:  x (float) \n n (int)
  // Output: x^n rounded to 5 decimal places (string)
  // -------------------------------------------------------------------------
  'powx-n': [
    { input: '2.00000\n10',      output: '1024.0'      },
    { input: '2.10000\n3',       output: '9.261'       },
    { input: '2.00000\n-2',      output: '0.25'        },
    { input: '1.00000\n2147483647', output: '1.0'      },
    { input: '2.00000\n0',       output: '1.0'         },
    { input: '0.00000\n0',       output: '1.0'         },
    { input: '1.00000\n0',       output: '1.0'         },
    { input: '0.00000\n1',       output: '0.0'         },
    { input: '1.00000\n-1',      output: '1.0'         },
    { input: '2.00000\n1',       output: '2.0'         },
    { input: '2.00000\n-1',      output: '0.5'         },
    { input: '2.00000\n2',       output: '4.0'         },
    { input: '2.00000\n3',       output: '8.0'         },
    { input: '2.00000\n4',       output: '16.0'        },
    { input: '2.00000\n5',       output: '32.0'        },
    { input: '2.00000\n-3',      output: '0.125'       },
    { input: '2.00000\n-4',      output: '0.0625'      },
    { input: '3.00000\n2',       output: '9.0'         },
    { input: '3.00000\n3',       output: '27.0'        },
    { input: '0.50000\n2',       output: '0.25'        },
    { input: '0.50000\n3',       output: '0.125'       },
    { input: '0.50000\n-1',      output: '2.0'         },
    { input: '0.50000\n-2',      output: '4.0'         },
    { input: '10.00000\n2',      output: '100.0'       },
    { input: '10.00000\n3',      output: '1000.0'      },
    { input: '10.00000\n-1',     output: '0.1'         },
    { input: '10.00000\n-2',     output: '0.01'        },
    { input: '0.00001\n2147483647', output: '0.0'      },
    { input: '-1.00000\n2',      output: '1.0'         },
    { input: '-1.00000\n3',      output: '-1.0'        },
    { input: '-1.00000\n-1',     output: '-1.0'        },
    { input: '-1.00000\n-2',     output: '1.0'         },
    { input: '-2.00000\n2',      output: '4.0'         },
    { input: '-2.00000\n3',      output: '-8.0'        },
    { input: '1.00001\n123456',  output: '3.43066'     },
    { input: '4.00000\n2',       output: '16.0'        },
    { input: '4.00000\n3',       output: '64.0'        },
    { input: '4.00000\n-1',      output: '0.25'        },
    { input: '4.00000\n-2',      output: '0.0625'      },
    { input: '1.50000\n2',       output: '2.25'        },
    { input: '1.50000\n3',       output: '3.375'       },
    { input: '2.00000\n20',      output: '1048576.0'   },
    { input: '0.10000\n2',       output: '0.01'        },
    { input: '0.10000\n3',       output: '0.001'       },
    { input: '2.00000\n-10',     output: '0.00098'     },
    { input: '3.00000\n-2',      output: '0.11111'     },
    { input: '5.00000\n2',       output: '25.0'        },
    { input: '5.00000\n-1',      output: '0.2'         },
    { input: '5.00000\n-2',      output: '0.04'        },
    { input: '2.00000\n15',      output: '32768.0'     },
    { input: '2.00000\n-15',     output: '0.00003'     },
    { input: '6.00000\n2',       output: '36.0'        },
    { input: '6.00000\n3',       output: '216.0'       },
    { input: '7.00000\n2',       output: '49.0'        },
    { input: '8.00000\n2',       output: '64.0'        },
    { input: '9.00000\n2',       output: '81.0'        },
    { input: '100.00000\n2',     output: '10000.0'     },
    { input: '1.10000\n10',      output: '2.59374'     },
    { input: '1.20000\n5',       output: '2.48832'     },
    { input: '2.50000\n3',       output: '15.625'      },
    { input: '3.00000\n0',       output: '1.0'         },
  ],

  // -------------------------------------------------------------------------
  // 102. MULTIPLY STRINGS
  // Input:  num1 (string) \n num2 (string)
  // Output: product as string
  // -------------------------------------------------------------------------
  'multiply-strings': [
    { input: '"2"\n"3"',         output: '"6"'         },
    { input: '"123"\n"456"',     output: '"56088"'      },
    { input: '"0"\n"0"',         output: '"0"'          },
    { input: '"0"\n"123"',       output: '"0"'          },
    { input: '"123"\n"0"',       output: '"0"'          },
    { input: '"1"\n"1"',         output: '"1"'          },
    { input: '"1"\n"9"',         output: '"9"'          },
    { input: '"9"\n"9"',         output: '"81"'         },
    { input: '"99"\n"99"',       output: '"9801"'       },
    { input: '"999"\n"999"',     output: '"998001"'     },
    { input: '"10"\n"10"',       output: '"100"'        },
    { input: '"100"\n"100"',     output: '"10000"'      },
    { input: '"12"\n"12"',       output: '"144"'        },
    { input: '"12"\n"34"',       output: '"408"'        },
    { input: '"11"\n"11"',       output: '"121"'        },
    { input: '"2"\n"0"',         output: '"0"'          },
    { input: '"9"\n"1"',         output: '"9"'          },
    { input: '"9"\n"0"',         output: '"0"'          },
    { input: '"1"\n"0"',         output: '"0"'          },
    { input: '"111"\n"111"',     output: '"12321"'      },
    { input: '"1000"\n"1000"',   output: '"1000000"'    },
    { input: '"9"\n"9"',         output: '"81"'         },
    { input: '"5"\n"5"',         output: '"25"'         },
    { input: '"7"\n"8"',         output: '"56"'         },
    { input: '"6"\n"7"',         output: '"42"'         },
    { input: '"123"\n"10"',      output: '"1230"'       },
    { input: '"456"\n"100"',     output: '"45600"'      },
    { input: '"987"\n"654"',     output: '"645498"'     },
    { input: '"9999"\n"9999"',   output: '"99980001"'   },
    { input: '"12345"\n"67890"', output: '"838102050"'  },
    { input: '"999"\n"1"',       output: '"999"'        },
    { input: '"1"\n"999"',       output: '"999"'        },
    { input: '"20"\n"50"',       output: '"1000"'       },
    { input: '"25"\n"4"',        output: '"100"'        },
    { input: '"25"\n"40"',       output: '"1000"'       },
    { input: '"2"\n"2"',         output: '"4"'          },
    { input: '"3"\n"4"',         output: '"12"'         },
    { input: '"4"\n"4"',         output: '"16"'         },
    { input: '"50"\n"50"',       output: '"2500"'       },
    { input: '"100"\n"0"',       output: '"0"'          },
    { input: '"1234"\n"5678"',   output: '"7006652"'    },
    { input: '"8"\n"7"',         output: '"56"'         },
    { input: '"6"\n"6"',         output: '"36"'         },
    { input: '"11"\n"9"',        output: '"99"'         },
    { input: '"9"\n"11"',        output: '"99"'         },
    { input: '"3"\n"3"',         output: '"9"'          },
    { input: '"2"\n"4"',         output: '"8"'          },
    { input: '"2"\n"5"',         output: '"10"'         },
    { input: '"2"\n"6"',         output: '"12"'         },
    { input: '"2"\n"7"',         output: '"14"'         },
    { input: '"2"\n"8"',         output: '"16"'         },
    { input: '"2"\n"9"',         output: '"18"'         },
    { input: '"3"\n"5"',         output: '"15"'         },
    { input: '"4"\n"5"',         output: '"20"'         },
    { input: '"5"\n"6"',         output: '"30"'         },
    { input: '"7"\n"7"',         output: '"49"'         },
    { input: '"8"\n"8"',         output: '"64"'         },
    { input: '"9"\n"0"',         output: '"0"'          },
    { input: '"456"\n"1"',       output: '"456"'        },
    { input: '"1"\n"456"',       output: '"456"'        },
  ],

  // -------------------------------------------------------------------------
  // 103. LINKED LIST CYCLE
  // Input:  head (int[]) \n pos (int) — pos = index cycle tail connects to, -1 = no cycle
  // Output: "true" / "false"
  // -------------------------------------------------------------------------
  'linked-list-cycle': [
    { input: '[3,2,0,-4]\n1',       output: 'true'  },
    { input: '[1,2]\n0',            output: 'true'  },
    { input: '[1]\n-1',             output: 'false' },
    { input: '[1,2]\n-1',           output: 'false' },
    { input: '[1]\n0',              output: 'true'  },
    { input: '[0]\n-1',             output: 'false' },
    { input: '[1,2,3]\n-1',         output: 'false' },
    { input: '[1,2,3]\n0',          output: 'true'  },
    { input: '[1,2,3]\n1',          output: 'true'  },
    { input: '[1,2,3]\n2',          output: 'true'  },
    { input: '[1,2,3,4,5]\n-1',     output: 'false' },
    { input: '[1,2,3,4,5]\n0',      output: 'true'  },
    { input: '[1,2,3,4,5]\n2',      output: 'true'  },
    { input: '[1,2,3,4,5]\n4',      output: 'true'  },
    { input: '[-1,-7,7,-4,19,6,-9,-5,-2,-5]\n6', output: 'true' },
    { input: '[5,0,1,4,2,3]\n-1',   output: 'false' },
    { input: '[5,0,1,4,2,3]\n3',    output: 'true'  },
    { input: '[10]\n-1',            output: 'false' },
    { input: '[10]\n0',             output: 'true'  },
    { input: '[1,2,3,4,5,6]\n4',    output: 'true'  },
    { input: '[1,2,3,4,5,6]\n-1',   output: 'false' },
    { input: '[7,6,5,4,3,2,1]\n5',  output: 'true'  },
    { input: '[7,6,5,4,3,2,1]\n-1', output: 'false' },
    { input: '[0,0,0]\n2',          output: 'true'  },
    { input: '[0,0,0]\n-1',         output: 'false' },
    { input: '[1,2,3,4,5,6,7]\n3',  output: 'true'  },
    { input: '[1,2,3,4,5,6,7]\n6',  output: 'true'  },
    { input: '[1,2,3,4,5,6,7]\n0',  output: 'true'  },
    { input: '[1,2,3,4,5,6,7]\n-1', output: 'false' },
    { input: '[100,200,300]\n0',    output: 'true'  },
    { input: '[100,200,300]\n1',    output: 'true'  },
    { input: '[100,200,300]\n2',    output: 'true'  },
    { input: '[100,200,300]\n-1',   output: 'false' },
    { input: '[1,2,3,4]\n0',        output: 'true'  },
    { input: '[1,2,3,4]\n1',        output: 'true'  },
    { input: '[1,2,3,4]\n2',        output: 'true'  },
    { input: '[1,2,3,4]\n3',        output: 'true'  },
    { input: '[1,2,3,4]\n-1',       output: 'false' },
    { input: '[9]\n0',              output: 'true'  },
    { input: '[9]\n-1',             output: 'false' },
    { input: '[2,4,6,8,10]\n-1',    output: 'false' },
    { input: '[2,4,6,8,10]\n4',     output: 'true'  },
    { input: '[1,3,5,7,9,2,4]\n1',  output: 'true'  },
    { input: '[1,3,5,7,9,2,4]\n-1', output: 'false' },
    { input: '[-1,-2,-3]\n-1',      output: 'false' },
    { input: '[-1,-2,-3]\n0',       output: 'true'  },
    { input: '[-1,-2,-3]\n2',       output: 'true'  },
    { input: '[0,1,2,3,4,5,6,7,8,9]\n7', output: 'true'  },
    { input: '[0,1,2,3,4,5,6,7,8,9]\n-1',output: 'false' },
    { input: '[5]\n0',              output: 'true'  },
    { input: '[5]\n-1',             output: 'false' },
    { input: '[1,2]\n1',            output: 'true'  },
    { input: '[3,2]\n-1',           output: 'false' },
    { input: '[3,2]\n1',            output: 'true'  },
    { input: '[3,2]\n0',            output: 'true'  },
    { input: '[1,2,3,4,5,6,7,8]\n5',output: 'true'  },
    { input: '[1,2,3,4,5,6,7,8]\n-1',output:'false' },
    { input: '[8,7,6,5,4,3,2,1]\n3',output: 'true'  },
    { input: '[8,7,6,5,4,3,2,1]\n7',output: 'true'  },
    { input: '[8,7,6,5,4,3,2,1]\n-1',output:'false' },
    { input: '[1,1,1,1]\n-1',        output:'false' },
    { input: '[1,1,1,1]\n2',         output:'true'  },
  ],

  // -------------------------------------------------------------------------
  // 104. FIND THE DUPLICATE NUMBER
  // Input:  nums (int[]) — n+1 ints in [1,n]
  // Output: duplicate (int)
  // -------------------------------------------------------------------------
  'find-the-duplicate-number': [
    { input: '[1,3,4,2,2]',         output: '2' },
    { input: '[3,1,3,4,2]',         output: '3' },
    { input: '[3,3,3,3,3]',         output: '3' },
    { input: '[1,1]',               output: '1' },
    { input: '[2,2]',               output: '2' },
    { input: '[1,1,2]',             output: '1' },
    { input: '[2,1,1]',             output: '1' },
    { input: '[1,2,2]',             output: '2' },
    { input: '[2,2,1]',             output: '2' },
    { input: '[1,2,3,4,4]',         output: '4' },
    { input: '[1,2,3,1,5]',         output: '1' },
    { input: '[2,1,3,4,2]',         output: '2' },
    { input: '[1,2,3,3,4]',         output: '3' },
    { input: '[4,3,2,7,8,2,3,1]',   output: '2' },
    { input: '[1,2,3,4,5,6,7,8,9,9]', output: '9' },
    { input: '[2,5,9,6,9,3,8,9,7,1]', output: '9' },
    { input: '[1,2,3,4,5,5]',       output: '5' },
    { input: '[5,4,3,2,1,5]',       output: '5' },
    { input: '[1,2,3,4,5,1]',       output: '1' },
    { input: '[1,2,3,4,5,2]',       output: '2' },
    { input: '[1,2,3,4,5,3]',       output: '3' },
    { input: '[1,2,3,4,5,4]',       output: '4' },
    { input: '[3,1,3,4,2]',         output: '3' },
    { input: '[6,2,4,1,5,3,6]',     output: '6' },
    { input: '[1,5,4,6,6,2,3]',     output: '6' },
    { input: '[2,6,4,1,5,3,2]',     output: '2' },
    { input: '[1,6,6,2,5,3,4]',     output: '6' },
    { input: '[1,2,3,4,5,6,7,7]',   output: '7' },
    { input: '[7,1,2,3,4,5,6,7]',   output: '7' },
    { input: '[1,2,3,4,4,5,6,7]',   output: '4' },
    { input: '[4,3,1,4,2]',         output: '4' },
    { input: '[2,1,2,4,3]',         output: '2' },
    { input: '[5,3,4,1,2,5]',       output: '5' },
    { input: '[1,2,3,2,4]',         output: '2' },
    { input: '[1,4,1,2,3]',         output: '1' },
    { input: '[3,1,2,3,4]',         output: '3' },
    { input: '[1,2,3,4,3,5]',       output: '3' },
    { input: '[4,1,4,2,3]',         output: '4' },
    { input: '[2,3,4,5,6,7,8,9,10,1,9]', output: '9' },
    { input: '[1,3,2,4,5,3]',       output: '3' },
    { input: '[5,1,2,3,4,5]',       output: '5' },
    { input: '[1,5,2,3,5,4]',       output: '5' },
    { input: '[2,2,2,2,2]',         output: '2' },
    { input: '[1,1,1,1,1]',         output: '1' },
    { input: '[3,3,3,3,3,3]',       output: '3' },
    { input: '[1,2,3,4,5,6,6]',     output: '6' },
    { input: '[1,2,2,3,4,5,6]',     output: '2' },
    { input: '[4,1,2,3,4,5]',       output: '4' },
    { input: '[1,2,3,4,5,6,1]',     output: '1' },
    { input: '[6,5,4,3,2,1,3]',     output: '3' },
    { input: '[1,2,3,4,5,6,7,8,4]', output: '4' },
    { input: '[8,1,2,3,4,5,6,7,8]', output: '8' },
    { input: '[3,2,4,3,5]',         output: '3' },
    { input: '[2,1,3,4,5,2]',       output: '2' },
    { input: '[1,6,3,2,5,4,6]',     output: '6' },
    { input: '[4,2,1,3,5,4,6]',     output: '4' },
    { input: '[1,2,5,4,3,5]',       output: '5' },
    { input: '[5,2,3,1,4,5]',       output: '5' },
    { input: '[1,4,3,2,4,5]',       output: '4' },
    { input: '[3,1,2,4,3,5]',       output: '3' },
    { input: '[2,1,4,3,5,2]',       output: '2' },
  ],

  // -------------------------------------------------------------------------
  // 105. LRU CACHE
  // Input:  ops (string[])
  //   "LRUCache:cap" | "put:key,val" | "get:key"
  // Output: results (string[]) — "null" for put/LRUCache, int for get
  // -------------------------------------------------------------------------
  'lru-cache': [
    { input: '["LRUCache:2","put:1,1","put:2,2","get:1","put:3,3","get:2","put:4,4","get:1","get:3","get:4"]',
      output: '["null","null","null","1","null","-1","null","1","3","4"]' },
    { input: '["LRUCache:1","put:2,1","get:2","put:3,2","get:2","get:3"]',
      output: '["null","null","1","null","-1","2"]' },
    { input: '["LRUCache:2","get:2","put:2,6","get:1","put:1,5","put:1,2","get:1","get:2"]',
      output: '["null","-1","null","-1","null","null","2","6"]' },
    { input: '["LRUCache:3","put:1,1","put:2,2","put:3,3","get:1","put:4,4","get:2","get:3","get:4"]',
      output: '["null","null","null","null","1","null","-1","3","4"]' },
    { input: '["LRUCache:1","put:1,1","get:1","put:2,2","get:1","get:2"]',
      output: '["null","null","1","null","-1","2"]' },
    { input: '["LRUCache:2","put:2,1","put:2,2","get:2","put:1,1","put:4,1","get:2"]',
      output: '["null","null","null","2","null","null","-1"]' },
    { input: '["LRUCache:2","put:1,0","put:2,2","get:1","put:3,3","get:2","put:4,4","get:1","get:3","get:4"]',
      output: '["null","null","null","0","null","-1","null","0","3","4"]' },
    { input: '["LRUCache:10","get:3","put:2,6","get:1","put:1,5","put:1,2","get:1","get:2"]',
      output: '["null","-1","null","-1","null","null","2","6"]' },
    { input: '["LRUCache:2","put:1,1","put:2,2","put:3,3","get:1"]',
      output: '["null","null","null","null","-1"]' },
    { input: '["LRUCache:3","put:1,1","put:2,2","put:3,3","put:4,4","get:4","get:3","get:2","get:1","put:5,5","get:1","get:2","get:3","get:4","get:5"]',
      output: '["null","null","null","null","null","4","3","2","-1","null","-1","2","3","-1","5"]' },
    { input: '["LRUCache:2","put:1,1","put:2,2","get:1","put:3,3","get:2","get:1","get:3"]',
      output: '["null","null","null","1","null","-1","1","3"]' },
    { input: '["LRUCache:1","put:1,1","put:1,2","get:1"]',
      output: '["null","null","null","2"]' },
    { input: '["LRUCache:2","put:1,1","put:2,2","get:1","put:3,3","get:2","get:1","get:3","put:4,4","get:1","get:3","get:4"]',
      output: '["null","null","null","1","null","-1","1","3","null","-1","3","4"]' },
    { input: '["LRUCache:3","put:1,1","put:2,2","put:3,3","put:1,10","get:1","get:2","get:3"]',
      output: '["null","null","null","null","null","10","2","3"]' },
    { input: '["LRUCache:2","put:1,1","put:2,2","get:2","put:3,3","get:1","get:2","get:3"]',
      output: '["null","null","null","2","null","-1","2","3"]' },
    { input: '["LRUCache:4","put:1,1","put:2,2","put:3,3","put:4,4","get:1","get:2","put:5,5","get:1","get:3","get:4","get:5"]',
      output: '["null","null","null","null","null","1","2","null","-1","3","4","5"]' },
    { input: '["LRUCache:2","put:1,1","get:1","get:2","put:2,4","get:2"]',
      output: '["null","null","1","-1","null","4"]' },
    { input: '["LRUCache:2","put:1,1","put:2,2","get:1","put:3,3","get:2","get:3"]',
      output: '["null","null","null","1","null","-1","3"]' },
    { input: '["LRUCache:5","put:1,1","put:2,2","put:3,3","put:4,4","put:5,5","get:1","get:2","get:3","get:4","get:5"]',
      output: '["null","null","null","null","null","null","1","2","3","4","5"]' },
    { input: '["LRUCache:2","put:1,1","put:2,2","put:3,3","get:3","get:2","get:1"]',
      output: '["null","null","null","null","3","2","-1"]' },
  ],

  // -------------------------------------------------------------------------
  // 106. SINGLE NUMBER
  // Input:  nums (int[]) — every element appears twice except one
  // Output: the element that appears once (int)
  // -------------------------------------------------------------------------
  'single-number': [
    { input: '[2,2,1]',                   output: '1'  },
    { input: '[4,1,2,1,2]',              output: '4'  },
    { input: '[1]',                       output: '1'  },
    { input: '[0]',                       output: '0'  },
    { input: '[1,0,1]',                   output: '0'  },
    { input: '[3,3,5]',                   output: '5'  },
    { input: '[5,3,3]',                   output: '5'  },
    { input: '[3,5,3]',                   output: '5'  },
    { input: '[7]',                       output: '7'  },
    { input: '[1,2,3,4,3,2,1]',          output: '4'  },
    { input: '[4,3,2,1,2,3,4]',          output: '1'  },
    { input: '[10,20,30,20,10]',          output: '30' },
    { input: '[1,1,2,2,3,3,4]',          output: '4'  },
    { input: '[4,1,2,1,2]',              output: '4'  },
    { input: '[100]',                     output: '100'},
    { input: '[-1,-1,-2]',               output: '-2' },
    { input: '[-1,-2,-1]',               output: '-2' },
    { input: '[-3,-3,-5]',               output: '-5' },
    { input: '[0,1,0]',                   output: '1'  },
    { input: '[1,2,3,1,2]',              output: '3'  },
    { input: '[1,2,2,3,3]',              output: '1'  },
    { input: '[5,5,6]',                   output: '6'  },
    { input: '[6,7,7]',                   output: '6'  },
    { input: '[9,9,1,1,3]',              output: '3'  },
    { input: '[3,1,1,9,9]',              output: '3'  },
    { input: '[2,3,2,4,4]',              output: '3'  },
    { input: '[99,99,100]',              output: '100'},
    { input: '[100,99,100]',             output: '99' },
    { input: '[1,2,3,3,2]',              output: '1'  },
    { input: '[7,6,6,7,5]',              output: '5'  },
    { input: '[0,0,-5]',                  output: '-5' },
    { input: '[-5,0,0]',                  output: '-5' },
    { input: '[1000000,1000000,999999]',  output: '999999' },
    { input: '[1,3,1,2,2]',              output: '3'  },
    { input: '[5,4,5,3,4]',              output: '3'  },
    { input: '[2,1,4,4,1]',              output: '2'  },
    { input: '[8,8,9]',                   output: '9'  },
    { input: '[9,8,8]',                   output: '9'  },
    { input: '[3,3,4,4,5]',              output: '5'  },
    { input: '[5,4,4,3,3]',              output: '5'  },
    { input: '[1,2,4,8,1,2,4]',          output: '8'  },
    { input: '[10,11,10,12,12]',         output: '11' },
    { input: '[0,2,0,3,3]',              output: '2'  },
    { input: '[4,2,4,5,5]',              output: '2'  },
    { input: '[7,7,1,6,1,6,3]',          output: '3'  },
    { input: '[1000,999,1000,998,998]',   output: '999'},
    { input: '[-1,1,-1]',                output: '1'  },
    { input: '[1,-1,1]',                  output: '-1' },
    { input: '[2,2,0,0,7]',              output: '7'  },
    { input: '[7,0,0,2,2]',              output: '7'  },
    { input: '[6,2,5,2,5]',              output: '6'  },
    { input: '[5,5,2,2,9]',              output: '9'  },
    { input: '[9,2,2,5,5]',              output: '9'  },
    { input: '[3,4,3,5,5]',              output: '4'  },
    { input: '[5,5,3,4,3]',              output: '4'  },
    { input: '[1,2,3,4,5,4,3,2,1]',      output: '5'  },
    { input: '[11,11,22,22,33]',         output: '33' },
    { input: '[1,1,0]',                   output: '0'  },
    { input: '[0,1,1]',                   output: '0'  },
    { input: '[42]',                      output: '42' },
  ],

  // -------------------------------------------------------------------------
  // 107. NUMBER OF 1 BITS
  // Input:  n (uint32 as int)
  // Output: number of set bits (int)
  // -------------------------------------------------------------------------
  'number-of-1-bits': [
    { input: '11',         output: '3'  },
    { input: '128',        output: '1'  },
    { input: '2147483645', output: '30' },
    { input: '0',          output: '0'  },
    { input: '1',          output: '1'  },
    { input: '2',          output: '1'  },
    { input: '3',          output: '2'  },
    { input: '4',          output: '1'  },
    { input: '7',          output: '3'  },
    { input: '8',          output: '1'  },
    { input: '15',         output: '4'  },
    { input: '16',         output: '1'  },
    { input: '255',        output: '8'  },
    { input: '256',        output: '1'  },
    { input: '65535',      output: '16' },
    { input: '65536',      output: '1'  },
    { input: '2147483647', output: '31' },
    { input: '2147483648', output: '1'  },
    { input: '4294967295', output: '32' },
    { input: '4294967294', output: '31' },
    { input: '4294967293', output: '31' },
    { input: '4294967292', output: '30' },
    { input: '5',          output: '2'  },
    { input: '6',          output: '2'  },
    { input: '9',          output: '2'  },
    { input: '10',         output: '2'  },
    { input: '12',         output: '2'  },
    { input: '13',         output: '3'  },
    { input: '14',         output: '3'  },
    { input: '31',         output: '5'  },
    { input: '32',         output: '1'  },
    { input: '63',         output: '6'  },
    { input: '64',         output: '1'  },
    { input: '127',        output: '7'  },
    { input: '191',        output: '7'  },
    { input: '1023',       output: '10' },
    { input: '1024',       output: '1'  },
    { input: '2048',       output: '1'  },
    { input: '4096',       output: '1'  },
    { input: '16383',      output: '14' },
    { input: '16384',      output: '1'  },
    { input: '43690',      output: '8'  },
    { input: '3221225472', output: '2'  },
    { input: '1431655765', output: '16' },
    { input: '2863311530', output: '16' },
    { input: '1000000000', output: '13' },
    { input: '999999999',  output: '18' },
    { input: '100',        output: '3'  },
    { input: '1000',       output: '6'  },
    { input: '10000',      output: '5'  },
    { input: '100000',     output: '6'  },
    { input: '1000000',    output: '7'  },
    { input: '2046',       output: '10' },
    { input: '4095',       output: '12' },
    { input: '8190',       output: '12' },
    { input: '16777215',   output: '24' },
    { input: '16777216',   output: '1'  },
    { input: '2684354560', output: '3'  },
    { input: '2863311530', output: '16' },
    { input: '33',         output: '2'  },
    { input: '34',         output: '2'  },
  ],

  // -------------------------------------------------------------------------
  // 108. COUNTING BITS
  // Input:  n (int)
  // Output: int[] — count of 1s in binary of 0..n
  // -------------------------------------------------------------------------
  'counting-bits': [
    { input: '0',   output: '[0]'                                                              },
    { input: '1',   output: '[0,1]'                                                            },
    { input: '2',   output: '[0,1,1]'                                                          },
    { input: '3',   output: '[0,1,1,2]'                                                        },
    { input: '4',   output: '[0,1,1,2,1]'                                                      },
    { input: '5',   output: '[0,1,1,2,1,2]'                                                    },
    { input: '6',   output: '[0,1,1,2,1,2,2]'                                                  },
    { input: '7',   output: '[0,1,1,2,1,2,2,3]'                                                },
    { input: '8',   output: '[0,1,1,2,1,2,2,3,1]'                                              },
    { input: '9',   output: '[0,1,1,2,1,2,2,3,1,2]'                                            },
    { input: '10',  output: '[0,1,1,2,1,2,2,3,1,2,2]'                                          },
    { input: '11',  output: '[0,1,1,2,1,2,2,3,1,2,2,3]'                                        },
    { input: '12',  output: '[0,1,1,2,1,2,2,3,1,2,2,3,2]'                                      },
    { input: '13',  output: '[0,1,1,2,1,2,2,3,1,2,2,3,2,3]'                                    },
    { input: '14',  output: '[0,1,1,2,1,2,2,3,1,2,2,3,2,3,3]'                                  },
    { input: '15',  output: '[0,1,1,2,1,2,2,3,1,2,2,3,2,3,3,4]'                                },
    { input: '16',  output: '[0,1,1,2,1,2,2,3,1,2,2,3,2,3,3,4,1]'                              },
    { input: '20',  output: '[0,1,1,2,1,2,2,3,1,2,2,3,2,3,3,4,1,2,2,3,2]'                      },
    { input: '30',  output: '[0,1,1,2,1,2,2,3,1,2,2,3,2,3,3,4,1,2,2,3,2,3,3,4,2,3,3,4,3,4,4]' },
    { input: '32',  output: '[0,1,1,2,1,2,2,3,1,2,2,3,2,3,3,4,1,2,2,3,2,3,3,4,2,3,3,4,3,4,4,5,1]' },
    { input: '100', output: '[0,1,1,2,1,2,2,3,1,2,2,3,2,3,3,4,1,2,2,3,2,3,3,4,2,3,3,4,3,4,4,5,1,2,2,3,2,3,3,4,2,3,3,4,3,4,4,5,2,3,3,4,3,4,4,5,3,4,4,5,4,5,5,6,1,2,2,3,2,3,3,4,2,3,3,4,3,4,4,5,2,3,3,4,3,4,4,5,3,4,4,5,4,5,5,6,2,3,3,4,3,4]' },
    { input: '17',  output: '[0,1,1,2,1,2,2,3,1,2,2,3,2,3,3,4,1,2]'                            },
    { input: '18',  output: '[0,1,1,2,1,2,2,3,1,2,2,3,2,3,3,4,1,2,2]'                          },
    { input: '19',  output: '[0,1,1,2,1,2,2,3,1,2,2,3,2,3,3,4,1,2,2,3]'                        },
    { input: '21',  output: '[0,1,1,2,1,2,2,3,1,2,2,3,2,3,3,4,1,2,2,3,2,3]'                    },
    { input: '24',  output: '[0,1,1,2,1,2,2,3,1,2,2,3,2,3,3,4,1,2,2,3,2,3,3,4,2]'              },
    { input: '25',  output: '[0,1,1,2,1,2,2,3,1,2,2,3,2,3,3,4,1,2,2,3,2,3,3,4,2,3]'            },
    { input: '31',  output: '[0,1,1,2,1,2,2,3,1,2,2,3,2,3,3,4,1,2,2,3,2,3,3,4,2,3,3,4,3,4,4,5]' },
    { input: '33',  output: '[0,1,1,2,1,2,2,3,1,2,2,3,2,3,3,4,1,2,2,3,2,3,3,4,2,3,3,4,3,4,4,5,1,2]' },
    { input: '63',  output: '[0,1,1,2,1,2,2,3,1,2,2,3,2,3,3,4,1,2,2,3,2,3,3,4,2,3,3,4,3,4,4,5,1,2,2,3,2,3,3,4,2,3,3,4,3,4,4,5,2,3,3,4,3,4,4,5,3,4,4,5,4,5,5,6]' },
  ],

  // -------------------------------------------------------------------------
  // 109. REVERSE BITS
  // Input:  n (uint32)
  // Output: reversed bits as uint32
  // -------------------------------------------------------------------------
  'reverse-bits': [
    { input: '43261596',   output: '964176192'  },
    { input: '4294967293', output: '3221225471' },
    { input: '0',          output: '0'          },
    { input: '1',          output: '2147483648' },
    { input: '2',          output: '1073741824' },
    { input: '4',          output: '536870912'  },
    { input: '8',          output: '268435456'  },
    { input: '16',         output: '134217728'  },
    { input: '128',        output: '16777216'   },
    { input: '255',        output: '4278190080' },
    { input: '256',        output: '8388608'    },
    { input: '65535',      output: '4294901760' },
    { input: '65536',      output: '32768'      },
    { input: '2147483648', output: '1'          },
    { input: '4294967295', output: '4294967295' },
    { input: '3',          output: '3221225472' },
    { input: '7',          output: '3758096384' },
    { input: '15',         output: '4026531840' },
    { input: '31',         output: '4160749568' },
    { input: '63',         output: '4227858432' },
    { input: '127',        output: '4261412864' },
    { input: '2147483647', output: '4294967294' },
    { input: '1073741824', output: '2'          },
    { input: '536870912',  output: '4'          },
    { input: '268435456',  output: '8'          },
    { input: '134217728',  output: '16'         },
    { input: '67108864',   output: '32'         },
    { input: '33554432',   output: '64'         },
    { input: '16777216',   output: '128'        },
    { input: '8388608',    output: '256'        },
    { input: '4194304',    output: '512'        },
    { input: '2097152',    output: '1024'       },
    { input: '1048576',    output: '2048'       },
    { input: '524288',     output: '4096'       },
    { input: '262144',     output: '8192'       },
    { input: '131072',     output: '16384'      },
    { input: '32768',      output: '65536'      },
    { input: '16384',      output: '131072'     },
    { input: '8192',       output: '262144'     },
    { input: '4096',       output: '524288'     },
    { input: '2048',       output: '1048576'    },
    { input: '1024',       output: '2097152'    },
    { input: '512',        output: '4194304'    },
    { input: '64',         output: '33554432'   },
    { input: '32',         output: '67108864'   },
    { input: '2863311530', output: '1431655765' },
    { input: '1431655765', output: '2863311530' },
    { input: '2576980377', output: '4042322160' },
    { input: '4042322160', output: '2576980377' },
    { input: '3435973836', output: '973078557'  },
    { input: '1000000000', output: '31'          },
    { input: '10',         output: '1342177280' },
    { input: '12',         output: '805306368'  },
    { input: '1717986918', output: '1717986918' },
    { input: '858993459',  output: '3221225487' },
    { input: '3221225487', output: '858993459'  },
    { input: '2863311530', output: '1431655765' },
    { input: '1431655765', output: '2863311530' },
    { input: '100',        output: '637534208'  },
    { input: '1000',       output: '543162368'  },
    { input: '10000',      output: '41943040'   },
  ],

  // -------------------------------------------------------------------------
  // 110. MISSING NUMBER
  // Input:  nums (int[]) — n distinct nums in [0,n]
  // Output: missing number (int)
  // -------------------------------------------------------------------------
  'missing-number': [
    { input: '[3,0,1]',                 output: '2'  },
    { input: '[0,1]',                   output: '2'  },
    { input: '[9,6,4,2,3,5,7,0,1]',    output: '8'  },
    { input: '[0]',                     output: '1'  },
    { input: '[1]',                     output: '0'  },
    { input: '[0,2]',                   output: '1'  },
    { input: '[1,2]',                   output: '0'  },
    { input: '[0,1,2]',                 output: '3'  },
    { input: '[0,1,3]',                 output: '2'  },
    { input: '[0,2,3]',                 output: '1'  },
    { input: '[1,2,3]',                 output: '0'  },
    { input: '[0,1,2,3]',               output: '4'  },
    { input: '[0,1,2,4]',               output: '3'  },
    { input: '[0,1,3,4]',               output: '2'  },
    { input: '[0,2,3,4]',               output: '1'  },
    { input: '[1,2,3,4]',               output: '0'  },
    { input: '[0,1,2,3,5]',             output: '4'  },
    { input: '[0,1,2,4,5]',             output: '3'  },
    { input: '[0,1,3,4,5]',             output: '2'  },
    { input: '[0,2,3,4,5]',             output: '1'  },
    { input: '[1,2,3,4,5]',             output: '0'  },
    { input: '[0,1,2,3,4,5]',           output: '6'  },
    { input: '[0,1,2,3,4,6]',           output: '5'  },
    { input: '[0,1,2,3,5,6]',           output: '4'  },
    { input: '[0,1,2,4,5,6]',           output: '3'  },
    { input: '[0,1,3,4,5,6]',           output: '2'  },
    { input: '[0,2,3,4,5,6]',           output: '1'  },
    { input: '[1,2,3,4,5,6]',           output: '0'  },
    { input: '[10,0,3,4,5,6,7,8,9,2]',  output: '1'  },
    { input: '[5,4,3,2,1,0]',           output: '6'  },
    { input: '[6,5,4,3,2,1,0]',         output: '7'  },
    { input: '[7,6,5,4,3,2,1,0]',       output: '8'  },
    { input: '[0,1,2,3,4,5,6,7,8,9]',   output: '10' },
    { input: '[0,1,2,3,4,5,6,7,9]',     output: '8'  },
    { input: '[0,1,2,3,4,5,6,8,9]',     output: '7'  },
    { input: '[0,1,2,3,4,5,7,8,9]',     output: '6'  },
    { input: '[0,1,2,3,4,6,7,8,9]',     output: '5'  },
    { input: '[0,1,2,3,5,6,7,8,9]',     output: '4'  },
    { input: '[0,1,2,4,5,6,7,8,9]',     output: '3'  },
    { input: '[0,1,3,4,5,6,7,8,9]',     output: '2'  },
    { input: '[0,2,3,4,5,6,7,8,9]',     output: '1'  },
    { input: '[1,2,3,4,5,6,7,8,9]',     output: '0'  },
    { input: '[2,0]',                    output: '1'  },
    { input: '[1,0]',                    output: '2'  },
    { input: '[2,1]',                    output: '0'  },
    { input: '[3,1,2]',                  output: '0'  },
    { input: '[0,3,2]',                  output: '1'  },
    { input: '[0,1,4,3]',                output: '2'  },
    { input: '[5,0,2,1,4]',              output: '3'  },
    { input: '[7,2,5,0,4,3,6,1]',        output: '8'  },
    { input: '[1,0,4,3,2]',              output: '5'  },
    { input: '[0,1,2,3,4,5,6,7,8]',      output: '9'  },
    { input: '[5,10,6,4,3,0,1,9,2,7]',   output: '8'  },
    { input: '[8,9,0,1,2,3,4,5,6]',      output: '7'  },
    { input: '[10,9,8,7,6,5,4,3,2,1]',   output: '0'  },
    { input: '[0,9,8,7,6,5,4,3,2,1]',    output: '10' },
    { input: '[100]',                     output: '0'  },
    { input: '[0,100]',                   output: '1'  },
    { input: '[99,0]',                    output: '1'  },
    { input: '[3,2,4,0]',                output: '1'  },
    { input: '[4,3,2,1,0]',              output: '5'  },
  ],

  // -------------------------------------------------------------------------
  // 111. SUM OF TWO INTEGERS
  // Input:  a (int) \n b (int)
  // Output: a + b (int), computed without + operator
  // -------------------------------------------------------------------------
  'sum-of-two-integers': [
    { input: '1\n2',         output: '3'    },
    { input: '2\n3',         output: '5'    },
    { input: '-2\n3',        output: '1'    },
    { input: '-1\n1',        output: '0'    },
    { input: '0\n0',         output: '0'    },
    { input: '5\n0',         output: '5'    },
    { input: '0\n5',         output: '5'    },
    { input: '-5\n0',        output: '-5'   },
    { input: '0\n-5',        output: '-5'   },
    { input: '10\n20',       output: '30'   },
    { input: '-10\n-20',     output: '-30'  },
    { input: '100\n200',     output: '300'  },
    { input: '-100\n200',    output: '100'  },
    { input: '100\n-200',    output: '-100' },
    { input: '-100\n-200',   output: '-300' },
    { input: '1000\n2000',   output: '3000' },
    { input: '7\n-7',        output: '0'    },
    { input: '-7\n7',        output: '0'    },
    { input: '1\n-1',        output: '0'    },
    { input: '-1\n-1',       output: '-2'   },
    { input: '3\n7',         output: '10'   },
    { input: '7\n3',         output: '10'   },
    { input: '15\n15',       output: '30'   },
    { input: '-15\n15',      output: '0'    },
    { input: '2147483647\n0', output: '2147483647' },
    { input: '0\n2147483647', output: '2147483647' },
    { input: '-2147483648\n0', output: '-2147483648' },
    { input: '0\n-2147483648', output: '-2147483648' },
    { input: '1\n0',         output: '1'    },
    { input: '0\n1',         output: '1'    },
    { input: '-1\n0',        output: '-1'   },
    { input: '4\n4',         output: '8'    },
    { input: '3\n3',         output: '6'    },
    { input: '12\n13',       output: '25'   },
    { input: '5\n-3',        output: '2'    },
    { input: '-3\n5',        output: '2'    },
    { input: '8\n-8',        output: '0'    },
    { input: '9\n1',         output: '10'   },
    { input: '1\n9',         output: '10'   },
    { input: '99\n1',        output: '100'  },
    { input: '1\n99',        output: '100'  },
    { input: '50\n50',       output: '100'  },
    { input: '25\n75',       output: '100'  },
    { input: '75\n25',       output: '100'  },
    { input: '-50\n-50',     output: '-100' },
    { input: '11\n13',       output: '24'   },
    { input: '13\n11',       output: '24'   },
    { input: '6\n7',         output: '13'   },
    { input: '7\n6',         output: '13'   },
    { input: '16\n16',       output: '32'   },
    { input: '255\n1',       output: '256'  },
    { input: '1024\n1024',   output: '2048' },
    { input: '-999\n1000',   output: '1'    },
    { input: '1000\n-999',   output: '1'    },
    { input: '2\n-3',        output: '-1'   },
    { input: '-3\n2',        output: '-1'   },
    { input: '4\n-5',        output: '-1'   },
    { input: '-5\n4',        output: '-1'   },
    { input: '123\n456',     output: '579'  },
    { input: '456\n123',     output: '579'  },
  ],

  // -------------------------------------------------------------------------
  // 112. REVERSE INTEGER
  // Input:  x (int)
  // Output: reversed int (0 if overflow, i.e. outside [-2^31, 2^31-1])
  // -------------------------------------------------------------------------
  'reverse-integer': [
    { input: '123',        output: '321'        },
    { input: '-123',       output: '-321'       },
    { input: '120',        output: '21'         },
    { input: '0',          output: '0'          },
    { input: '1534236469', output: '0'          },
    { input: '100',        output: '1'          },
    { input: '1000',       output: '1'          },
    { input: '-100',       output: '-1'         },
    { input: '1',          output: '1'          },
    { input: '-1',         output: '-1'         },
    { input: '10',         output: '1'          },
    { input: '-10',        output: '-1'         },
    { input: '321',        output: '123'        },
    { input: '-321',       output: '-123'       },
    { input: '12345',      output: '54321'      },
    { input: '-12345',     output: '-54321'     },
    { input: '1000000003', output: '0'          },
    { input: '2',          output: '2'          },
    { input: '20',         output: '2'          },
    { input: '200',        output: '2'          },
    { input: '-200',       output: '-2'         },
    { input: '1234567',    output: '7654321'    },
    { input: '-1234567',   output: '-7654321'   },
    { input: '1563847412', output: '0'          },
    { input: '9',          output: '9'          },
    { input: '-9',         output: '-9'         },
    { input: '90',         output: '9'          },
    { input: '900',        output: '9'          },
    { input: '-900',       output: '-9'         },
    { input: '9000',       output: '9'          },
    { input: '-9000',      output: '-9'         },
    { input: '1001',       output: '1001'       },
    { input: '1010',       output: '101'        },
    { input: '1100',       output: '11'         },
    { input: '1111',       output: '1111'       },
    { input: '1234',       output: '4321'       },
    { input: '-1234',      output: '-4321'      },
    { input: '5678',       output: '8765'       },
    { input: '9090',       output: '909'        },
    { input: '-9090',      output: '-909'       },
    { input: '1230',       output: '321'        },
    { input: '-1230',      output: '-321'       },
    { input: '7',          output: '7'          },
    { input: '-7',         output: '-7'         },
    { input: '100000',     output: '1'          },
    { input: '-100000',    output: '-1'         },
    { input: '2147447412', output: '2147447412' },
    { input: '2147483641', output: '0'          },
    { input: '2147483647', output: '0'          },
    { input: '-2147483648', output: '0'         },
    { input: '1000000009', output: '0'          },
    { input: '12',         output: '21'         },
    { input: '-12',        output: '-21'        },
    { input: '21',         output: '12'         },
    { input: '99',         output: '99'         },
    { input: '-99',        output: '-99'        },
    { input: '101',        output: '101'        },
    { input: '-101',       output: '-101'       },
    { input: '1091',       output: '1901'       },
    { input: '1901',       output: '1091'       },
    { input: '110',        output: '11'         },
  ],

  // -------------------------------------------------------------------------
  // 113. NUMBER OF ISLANDS
  // Input:  grid (string[][]) — "1"=land, "0"=water
  // Output: number of islands (int)
  // -------------------------------------------------------------------------
  'number-of-islands': [
    { input: '[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', output: '1' },
    { input: '[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', output: '3' },
    { input: '[["1"]]',          output: '1' },
    { input: '[["0"]]',          output: '0' },
    { input: '[["1","0"],["0","1"]]', output: '2' },
    { input: '[["1","1"],["1","1"]]', output: '1' },
    { input: '[["1","0"],["0","0"]]', output: '1' },
    { input: '[["0","1"],["0","0"]]', output: '1' },
    { input: '[["0","0"],["0","1"]]', output: '1' },
    { input: '[["1","1","1"],["0","1","0"],["1","1","1"]]', output: '1' },
    { input: '[["1","0","1"],["0","0","0"],["1","0","1"]]', output: '4' },
    { input: '[["1","0","1"],["1","0","1"],["1","0","1"]]', output: '2' },
    { input: '[["1","1","1"],["1","0","1"],["1","1","1"]]', output: '1' },
    { input: '[["0","0","0"],["0","0","0"],["0","0","0"]]', output: '0' },
    { input: '[["1","1","1"],["1","1","1"],["1","1","1"]]', output: '1' },
    { input: '[["1","0","0","1"],["0","0","0","0"],["1","0","0","1"]]', output: '4' },
    { input: '[["1","1","0","1"],["1","0","0","1"],["0","0","0","0"]]', output: '3' },
    { input: '[["1","0","0"],["0","1","0"],["0","0","1"]]', output: '3' },
    { input: '[["1","1","0"],["0","1","1"],["0","0","0"]]', output: '1' },
    { input: '[["1","0","1","1","0","1","1"]]', output: '3' },
    { input: '[["1"],["0"],["1"],["0"],["1"]]', output: '3' },
    { input: '[["1"],["1"],["0"],["1"],["1"]]', output: '2' },
    { input: '[["1","1","0","0","1"],["1","0","0","1","1"],["0","0","1","0","0"]]', output: '3' },
    { input: '[["1","0","1","0","1"],["0","1","0","1","0"],["1","0","1","0","1"]]', output: '9' },
    { input: '[["0","1","0"],["1","1","1"],["0","1","0"]]', output: '1' },
    { input: '[["1","0","0","0","1"],["1","0","1","0","1"],["1","0","0","0","1"]]', output: '3' },
    { input: '[["1","1","1","1","1"],["0","0","0","0","0"],["1","1","1","1","1"]]', output: '2' },
    { input: '[["1","0","0","0","0"],["0","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","0"],["0","0","0","0","1"]]', output: '5' },
    { input: '[["1","1","0","0","0"],["0","1","1","0","0"],["0","0","1","1","0"],["0","0","0","1","1"]]', output: '1' },
    { input: '[["1","0","1","0","1"],["1","0","1","0","1"],["1","0","1","0","1"]]', output: '3' },
  ],

  // -------------------------------------------------------------------------
  // 114. MAX AREA OF ISLAND
  // Input:  grid (int[][]) — 1=land, 0=water
  // Output: maximum area of any island (int); 0 if none
  // -------------------------------------------------------------------------
  'max-area-of-island': [
    { input: '[[0,0,1,0,0,0,0,1,0,0,0,0,0],[0,0,0,0,0,0,0,1,1,1,0,0,0],[0,1,1,0,1,0,0,0,0,0,0,0,0],[0,1,0,0,1,1,0,0,1,0,1,0,0],[0,1,0,0,1,1,0,0,1,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,1,0,0],[0,0,0,0,0,0,0,1,1,1,0,0,0],[0,0,0,0,0,0,0,1,1,0,0,0,0]]',
      output: '6' },
    { input: '[[0,0,0,0,0,0,0,0]]',   output: '0' },
    { input: '[[1]]',                 output: '1' },
    { input: '[[0]]',                 output: '0' },
    { input: '[[1,1],[1,1]]',         output: '4' },
    { input: '[[1,0],[0,1]]',         output: '1' },
    { input: '[[0,0,0],[0,1,0],[0,0,0]]', output: '1' },
    { input: '[[1,1,0,0],[0,1,1,0],[0,0,0,1]]', output: '4' },
    { input: '[[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]]', output: '1' },
    { input: '[[1,1,1],[1,0,1],[1,1,1]]', output: '8' },
    { input: '[[1,0,1],[0,0,0],[1,0,1]]', output: '1' },
    { input: '[[1,1,1,1],[1,0,0,1],[1,0,0,1],[1,1,1,1]]', output: '12' },
    { input: '[[0,1,0],[1,0,1],[0,1,0]]', output: '1' },
    { input: '[[1,1,0,0,0],[1,1,0,0,0],[0,0,0,1,1],[0,0,0,1,1]]', output: '4' },
    { input: '[[1,1,0],[0,1,1],[0,0,1]]', output: '5' },
    { input: '[[1,1,0],[0,0,1],[1,0,1]]', output: '2' },
    { input: '[[0,0,1,0],[0,1,1,0],[0,1,0,0],[1,0,0,0]]', output: '4' },
    { input: '[[1,0,0,1,0],[0,1,0,0,1],[1,0,1,0,0]]', output: '1' },
    { input: '[[1,1,1,0,1],[1,1,0,0,0],[0,0,0,1,1]]', output: '5' },
    { input: '[[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1]]', output: '15' },
    { input: '[[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]]', output: '0' },
    { input: '[[1,0,1,0,1],[0,0,0,0,0],[1,0,1,0,1]]', output: '1' },
    { input: '[[1,1,0,1,1],[1,1,0,1,1],[0,0,0,0,0],[1,1,0,1,1],[1,1,0,1,1]]', output: '4' },
    { input: '[[1,0,1],[1,0,1],[1,1,1]]', output: '7' },
    { input: '[[1,1,1],[0,0,0],[1,1,1]]', output: '3' },
    { input: '[[0,1,0,1],[1,0,1,0],[0,1,0,1],[1,0,1,0]]', output: '1' },
    { input: '[[1,1,0,0],[1,0,0,1],[0,0,1,1],[0,1,1,0]]', output: '3' },
    { input: '[[1,1,1,0,0],[0,1,0,0,0],[1,1,1,0,0]]', output: '7' },
    { input: '[[0,0,0],[0,0,0],[0,0,1]]', output: '1' },
    { input: '[[1,0,0],[0,0,0],[0,0,0]]', output: '1' },
  ],

  // -------------------------------------------------------------------------
  // 115. CLONE GRAPH
  // Input:  adjList (int[][]) — node i+1 has neighbours adjList[i]
  // Output: adjList of cloned graph (same structure, int[][])
  // -------------------------------------------------------------------------
  'clone-graph': [
    { input: '[[2,4],[1,3],[2,4],[1,3]]',   output: '[[2,4],[1,3],[2,4],[1,3]]'   },
    { input: '[[]]',                          output: '[[]]'                         },
    { input: '[]',                            output: '[]'                           },
    { input: '[[2],[1]]',                    output: '[[2],[1]]'                    },
    { input: '[[2,3],[1,3],[1,2]]',          output: '[[2,3],[1,3],[1,2]]'          },
    { input: '[[2,3,4],[1,3],[1,2,4],[1,3]]',output:'[[2,3,4],[1,3],[1,2,4],[1,3]]'},
    { input: '[[2],[1,3],[2,4],[3]]',        output: '[[2],[1,3],[2,4],[3]]'        },
    { input: '[[2,5],[1,3],[2,4],[3,5],[1,4]]', output: '[[2,5],[1,3],[2,4],[3,5],[1,4]]' },
    { input: '[[2,3],[1],[1]]',              output: '[[2,3],[1],[1]]'              },
    { input: '[[2],[1,3],[2]]',              output: '[[2],[1,3],[2]]'              },
    { input: '[[2,3,4,5],[1,3],[1,2],[1,5],[1,4]]', output: '[[2,3,4,5],[1,3],[1,2],[1,5],[1,4]]' },
    { input: '[[2,3],[1,4],[1,4],[2,3]]',   output: '[[2,3],[1,4],[1,4],[2,3]]'   },
    { input: '[[2,4],[1,3],[2,4],[1,3]]',   output: '[[2,4],[1,3],[2,4],[1,3]]'   },
    { input: '[[2],[1]]',                    output: '[[2],[1]]'                    },
    { input: '[[3,2],[3,1],[1,2]]',          output: '[[3,2],[3,1],[1,2]]'          },
    { input: '[[2,3,4],[1,4],[1,4],[1,2,3]]', output: '[[2,3,4],[1,4],[1,4],[1,2,3]]' },
    { input: '[[2,3],[1,4],[1,4],[2,3]]',   output: '[[2,3],[1,4],[1,4],[2,3]]'   },
    { input: '[[2,5],[1,3],[2,4],[3,5],[4,1]]', output: '[[2,5],[1,3],[2,4],[3,5],[4,1]]' },
    { input: '[[2,3],[1,3],[1,2]]',          output: '[[2,3],[1,3],[1,2]]'          },
    { input: '[[2,4],[1,3],[2,4],[1,3]]',   output: '[[2,4],[1,3],[2,4],[1,3]]'   },
  ],

  // -------------------------------------------------------------------------
  // 116. WALLS AND GATES
  // Input:  rooms (int[][]) — -1=wall, 0=gate, INF=2147483647
  // Output: filled rooms (int[][])
  // -------------------------------------------------------------------------
  'walls-and-gates': [
    { input: '[[2147483647,-1,0,2147483647],[2147483647,2147483647,2147483647,-1],[2147483647,-1,2147483647,-1],[0,-1,2147483647,2147483647]]',
      output: '[[3,-1,0,1],[2,2,1,-1],[1,-1,2,-1],[0,-1,3,4]]' },
    { input: '[[0,-1],[2147483647,2147483647]]',
      output: '[[0,-1],[1,2]]' },
    { input: '[[-1]]',       output: '[[-1]]'        },
    { input: '[[0]]',        output: '[[0]]'         },
    { input: '[[2147483647]]', output: '[[2147483647]]' },
    { input: '[[0,2147483647],[2147483647,2147483647]]',
      output: '[[0,1],[1,2]]' },
    { input: '[[0,0]]',      output: '[[0,0]]'       },
    { input: '[[0],[2147483647],[2147483647],[2147483647]]',
      output: '[[0],[1],[2],[3]]' },
    { input: '[[2147483647],[2147483647],[0],[2147483647]]',
      output: '[[2],[1],[0],[1]]' },
    { input: '[[0,2147483647,0]]',  output: '[[0,1,0]]'           },
    { input: '[[0,-1,0]]',          output: '[[0,-1,0]]'          },
    { input: '[[2147483647,0,2147483647]]', output: '[[1,0,1]]'   },
    { input: '[[0,2147483647,2147483647,0]]', output: '[[0,1,1,0]]' },
    { input: '[[0,-1,2147483647,2147483647,0]]',
      output: '[[0,-1,2147483647,1,0]]' },
    { input: '[[2147483647,2147483647],[2147483647,0]]',
      output: '[[2,1],[1,0]]' },
    { input: '[[-1,-1,-1],[-1,0,-1],[-1,-1,-1]]',
      output: '[[-1,-1,-1],[-1,0,-1],[-1,-1,-1]]' },
    { input: '[[0,2147483647,2147483647],[2147483647,2147483647,2147483647],[2147483647,2147483647,0]]',
      output: '[[0,1,2],[1,2,1],[2,1,0]]' },
    { input: '[[0,-1,2147483647],[2147483647,2147483647,2147483647],[2147483647,-1,0]]',
      output: '[[0,-1,1],[1,2,1],[2,-1,0]]' },
    { input: '[[2147483647,2147483647,2147483647],[2147483647,-1,2147483647],[2147483647,2147483647,0]]',
      output: '[[4,3,2],[3,-1,1],[2,1,0]]' },
    { input: '[[0,2147483647,2147483647,2147483647],[2147483647,2147483647,2147483647,2147483647],[2147483647,2147483647,2147483647,0]]',
      output: '[[0,1,2,3],[1,2,2,1],[2,2,1,0]]' },
  ],

  // -------------------------------------------------------------------------
  // 117. ROTTING ORANGES
  // Input:  grid (int[][]) — 0=empty, 1=fresh, 2=rotten
  // Output: minimum minutes until all fresh oranges rot; -1 if impossible
  // -------------------------------------------------------------------------
  'rotting-oranges': [
    { input: '[[2,1,1],[1,1,0],[0,1,1]]',   output: '4'  },
    { input: '[[2,1,1],[0,1,1],[1,0,1]]',   output: '-1' },
    { input: '[[0,2]]',                      output: '0'  },
    { input: '[[0]]',                        output: '0'  },
    { input: '[[1]]',                        output: '-1' },
    { input: '[[2]]',                        output: '0'  },
    { input: '[[1,2]]',                      output: '1'  },
    { input: '[[2,1]]',                      output: '1'  },
    { input: '[[1,1,0],[0,1,1],[1,0,2]]',   output: '4'  },
    { input: '[[0,0,0],[0,0,0],[0,0,0]]',   output: '0'  },
    { input: '[[1,1,1],[1,1,1],[1,1,2]]',   output: '4'  },
    { input: '[[2,2,2],[2,2,2],[2,2,2]]',   output: '0'  },
    { input: '[[2,1,1],[1,1,1],[1,1,1]]',   output: '4'  },
    { input: '[[1,1,1],[1,2,1],[1,1,1]]',   output: '2'  },
    { input: '[[1,1],[1,2]]',               output: '2'  },
    { input: '[[2,1],[1,1]]',               output: '2'  },
    { input: '[[2,0,1,1],[1,0,1,1],[0,2,0,0]]', output: '2' },
    { input: '[[0,0,2],[0,1,0],[2,0,0]]',   output: '-1' },
    { input: '[[0,0,2],[0,1,1],[2,0,0]]',   output: '1'  },
    { input: '[[0,1,0],[1,0,1],[0,1,0]]',   output: '-1' },
    { input: '[[2,0,1],[0,0,0],[1,0,2]]',   output: '-1' },
    { input: '[[2,0,0],[0,1,0],[0,0,2]]',   output: '-1' },
    { input: '[[1,0,1,0,1],[1,0,1,0,1],[1,0,2,0,1],[1,0,1,0,1],[1,0,1,0,1]]', output: '-1' },
    { input: '[[2,2],[1,1],[0,0],[2,0]]',   output: '1'  },
    { input: '[[0,0],[0,1]]',               output: '-1' },
    { input: '[[1,2,1,1,1]]',               output: '3'  },
    { input: '[[1],[2],[1]]',               output: '1'  },
    { input: '[[2],[1],[1],[1],[1]]',        output: '4'  },
    { input: '[[1],[1],[1],[1],[2]]',        output: '4'  },
    { input: '[[2,1,1],[0,0,0],[1,1,2]]',   output: '1'  },
  ],

  // -------------------------------------------------------------------------
  // 118. PACIFIC ATLANTIC WATER FLOW
  // Input:  heights (int[][])
  // Output: int[][] — cells that can flow to both Pacific and Atlantic
  // -------------------------------------------------------------------------
  'pacific-atlantic-water-flow': [
    { input: '[[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]',
      output: '[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]' },
    { input: '[[2,1],[1,2]]',
      output: '[[0,0],[0,1],[1,0],[1,1]]' },
    { input: '[[1]]',              output: '[[0,0]]'              },
    { input: '[[1,1],[1,1]]',      output: '[[0,0],[0,1],[1,0],[1,1]]' },
    { input: '[[1,2],[2,1]]',      output: '[[0,0],[0,1],[1,0],[1,1]]' },
    { input: '[[3,3,3],[3,3,3],[3,3,3]]',
      output: '[[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2]]' },
    { input: '[[1,2,3],[8,9,4],[7,6,5]]',
      output: '[[0,2],[1,0],[1,1],[1,2],[2,0]]' },
    { input: '[[1]]',            output: '[[0,0]]'               },
    { input: '[[10,10,10],[10,1,10],[10,10,10]]',
      output: '[[0,0],[0,1],[0,2],[1,0],[1,2],[2,0],[2,1],[2,2]]' },
    { input: '[[1,2,3,4],[12,13,14,5],[11,16,15,6],[10,9,8,7]]',
      output: '[[0,3],[1,0],[1,1],[1,2],[1,3],[2,0],[2,1],[2,2],[2,3],[3,0]]' },
    { input: '[[5,5],[4,5],[3,5]]',
      output: '[[0,0],[0,1],[1,1],[2,1]]' },
    { input: '[[5,4,3],[5,5,5],[5,4,3]]',
      output: '[[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2]]' },
    { input: '[[1,1,1,1],[1,1,1,1],[1,1,1,1]]',
      output: '[[0,0],[0,1],[0,2],[0,3],[1,0],[1,3],[2,0],[2,1],[2,2],[2,3]]' },
    { input: '[[5,4,3,2,1],[5,5,5,5,1],[5,5,5,5,1],[5,5,5,5,1],[1,1,1,1,1]]',
      output: '[[0,0],[0,1],[0,2],[0,3],[0,4],[1,0],[1,4],[2,0],[2,4],[3,0],[3,4],[4,0]]' },
    { input: '[[1,2],[3,4]]',      output: '[[0,1],[1,0],[1,1]]' },
    { input: '[[4,3],[2,1]]',      output: '[[0,0],[0,1],[1,0]]' },
    { input: '[[2,2,2],[2,2,2],[2,2,2]]',
      output: '[[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2]]' },
    { input: '[[10,9,8],[7,6,5],[4,3,2]]',
      output: '[[0,0],[0,1],[0,2],[1,0],[2,0]]' },
    { input: '[[2,9,8],[7,6,5],[1,3,2]]',
      output: '[[0,1],[0,2],[1,0],[1,1]]' },
    { input: '[[1,3,1],[3,5,3],[1,3,1]]',
      output: '[[0,1],[1,0],[1,1],[1,2],[2,1]]' },
  ],

  // -------------------------------------------------------------------------
  // 119. SURROUNDED REGIONS
  // Input:  board (string[][]) — "X" or "O"
  // Output: board after capturing surrounded regions (string[][])
  // -------------------------------------------------------------------------
  'surrounded-regions': [
    { input: '[["X","X","X","X"],["X","O","O","X"],["X","X","O","X"],["X","O","X","X"]]',
      output: '[["X","X","X","X"],["X","X","X","X"],["X","X","X","X"],["X","O","X","X"]]' },
    { input: '[["X"]]',                   output: '[["X"]]'                   },
    { input: '[["O"]]',                   output: '[["O"]]'                   },
    { input: '[["O","O"],["O","O"]]',     output: '[["O","O"],["O","O"]]'     },
    { input: '[["X","X"],["X","X"]]',     output: '[["X","X"],["X","X"]]'     },
    { input: '[["O","X"],["X","O"]]',     output: '[["O","X"],["X","O"]]'     },
    { input: '[["X","O","X"],["X","O","X"],["X","O","X"]]',
      output: '[["X","O","X"],["X","O","X"],["X","O","X"]]' },
    { input: '[["X","X","X"],["X","O","X"],["X","X","X"]]',
      output: '[["X","X","X"],["X","X","X"],["X","X","X"]]' },
    { input: '[["O","X","X"],["X","O","X"],["X","X","O"]]',
      output: '[["O","X","X"],["X","X","X"],["X","X","O"]]' },
    { input: '[["O","O","O"],["O","O","O"],["O","O","O"]]',
      output: '[["O","O","O"],["O","O","O"],["O","O","O"]]' },
    { input: '[["X","X","X","X","X"],["X","O","X","O","X"],["X","O","X","O","X"],["X","O","O","O","X"],["X","X","X","X","X"]]',
      output: '[["X","X","X","X","X"],["X","X","X","X","X"],["X","X","X","X","X"],["X","X","X","X","X"],["X","X","X","X","X"]]' },
    { input: '[["O","O","O","O"],["O","X","X","O"],["O","X","X","O"],["O","O","O","O"]]',
      output: '[["O","O","O","O"],["O","X","X","O"],["O","X","X","O"],["O","O","O","O"]]' },
    { input: '[["X","O"],["O","X"]]',     output: '[["X","O"],["O","X"]]'     },
    { input: '[["X","X","X"],["X","O","X"],["X","O","X"]]',
      output: '[["X","X","X"],["X","O","X"],["X","O","X"]]' },
    { input: '[["X","O","X"],["O","X","O"],["X","O","X"]]',
      output: '[["X","O","X"],["O","X","O"],["X","O","X"]]' },
    { input: '[["X","O","X"],["X","O","X"],["X","X","X"]]',
      output: '[["X","X","X"],["X","X","X"],["X","X","X"]]' },
    { input: '[["X","X","X","X"],["X","O","X","X"],["X","X","O","X"],["X","X","X","X"]]',
      output: '[["X","X","X","X"],["X","X","X","X"],["X","X","X","X"],["X","X","X","X"]]' },
    { input: '[["O","X","O"],["X","X","X"],["O","X","O"]]',
      output: '[["O","X","O"],["X","X","X"],["O","X","O"]]' },
    { input: '[["O","O","O","O","X"],["O","X","X","O","O"],["O","X","X","O","O"],["O","O","O","O","O"]]',
      output: '[["O","O","O","O","X"],["O","X","X","O","O"],["O","X","X","O","O"],["O","O","O","O","O"]]' },
    { input: '[["X","X","X","X"],["O","X","X","X"],["X","X","X","X"]]',
      output: '[["X","X","X","X"],["O","X","X","X"],["X","X","X","X"]]' },
    { input: '[["X","X","X","X"],["X","O","O","X"],["X","X","O","X"],["X","O","O","X"]]',
      output: '[["X","X","X","X"],["X","X","X","X"],["X","X","X","X"],["X","X","X","X"]]' },
  ],

  // -------------------------------------------------------------------------
  // 120. NUMBER OF CONNECTED COMPONENTS IN AN UNDIRECTED GRAPH
  // Input:  n (int) \n edges (int[][])
  // Output: number of connected components (int)
  // -------------------------------------------------------------------------
  'number-of-connected-components-in-an-undirected-graph': [
    { input: '5\n[[0,1],[1,2],[3,4]]',         output: '2' },
    { input: '5\n[[0,1],[1,2],[2,3],[3,4]]',   output: '1' },
    { input: '4\n[[0,1],[2,3]]',               output: '2' },
    { input: '1\n[]',                           output: '1' },
    { input: '2\n[]',                           output: '2' },
    { input: '2\n[[0,1]]',                      output: '1' },
    { input: '3\n[]',                           output: '3' },
    { input: '3\n[[0,1]]',                      output: '2' },
    { input: '3\n[[0,1],[1,2]]',               output: '1' },
    { input: '3\n[[0,1],[0,2]]',               output: '1' },
    { input: '4\n[]',                           output: '4' },
    { input: '4\n[[0,1],[2,3]]',               output: '2' },
    { input: '4\n[[0,1],[1,2],[2,3]]',         output: '1' },
    { input: '4\n[[0,1],[1,3],[2,3]]',         output: '1' },
    { input: '5\n[]',                           output: '5' },
    { input: '5\n[[0,1],[2,3],[4,0]]',         output: '2' },
    { input: '5\n[[0,1],[1,2],[3,4]]',         output: '2' },
    { input: '5\n[[0,1],[0,2],[0,3],[0,4]]',   output: '1' },
    { input: '6\n[[0,1],[1,2],[3,4],[4,5]]',   output: '2' },
    { input: '6\n[[0,1],[2,3],[4,5]]',         output: '3' },
    { input: '6\n[]',                           output: '6' },
    { input: '6\n[[0,1],[1,2],[2,3],[3,4],[4,5],[5,0]]', output: '1' },
    { input: '7\n[[0,1],[2,3],[4,5]]',         output: '4' },
    { input: '7\n[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6]]', output: '1' },
    { input: '8\n[[0,1],[2,3],[4,5],[6,7]]',   output: '4' },
    { input: '8\n[[0,1],[0,2],[0,3],[4,5],[4,6],[4,7]]', output: '2' },
    { input: '10\n[[0,1],[2,3],[4,5],[6,7],[8,9]]', output: '5' },
    { input: '5\n[[0,1],[1,2],[0,2],[3,4]]',   output: '2' },
    { input: '5\n[[0,1],[1,2],[2,3],[3,4],[4,0]]', output: '1' },
    { input: '4\n[[0,1],[0,2],[0,3]]',         output: '1' },
    { input: '4\n[[1,2],[2,3]]',               output: '2' },
    { input: '5\n[[0,2],[2,1],[3,4]]',         output: '2' },
    { input: '6\n[[0,1],[1,2],[2,0],[3,4],[4,5],[5,3]]', output: '2' },
    { input: '9\n[[0,1],[1,2],[3,4],[5,6],[6,7],[7,8]]', output: '3' },
    { input: '3\n[[0,2],[1,2]]',               output: '1' },
    { input: '6\n[[0,3],[1,3],[2,3],[4,3],[5,3]]', output: '1' },
    { input: '4\n[[0,1],[1,0]]',               output: '3' },
    { input: '5\n[[0,1],[1,0],[2,3]]',         output: '3' },
    { input: '6\n[[0,1],[1,2],[3,4],[4,5],[0,3]]', output: '1' },
    { input: '5\n[[0,4],[1,4],[2,4],[3,4]]',   output: '1' },
    { input: '7\n[[0,1],[2,3],[4,5],[0,2],[2,4]]', output: '2' },
    { input: '5\n[[1,2],[2,3],[0,4]]',         output: '2' },
    { input: '6\n[[0,1],[2,3],[4,3],[4,5]]',   output: '2' },
    { input: '8\n[[0,7],[1,6],[2,5],[3,4]]',   output: '4' },
    { input: '6\n[[0,1],[1,2],[2,0]]',         output: '4' },
    { input: '4\n[[0,1],[2,3],[1,2]]',         output: '1' },
    { input: '5\n[[0,1],[2,3],[1,3]]',         output: '2' },
    { input: '5\n[[0,1],[1,3],[2,4]]',         output: '2' },
    { input: '6\n[[0,5],[1,5],[2,5],[3,5],[4,5]]', output: '1' },
    { input: '3\n[[0,1],[1,2],[0,2]]',         output: '1' },
    { input: '5\n[[0,1],[2,3],[3,4],[4,2]]',   output: '2' },
    { input: '4\n[[0,2],[1,3]]',               output: '2' },
    { input: '4\n[[0,2],[1,3],[0,1]]',         output: '1' },
    { input: '6\n[[0,1],[1,5],[2,3],[3,4]]',   output: '2' },
    { input: '5\n[[0,1],[1,2],[3,4]]',         output: '2' },
    { input: '3\n[[0,1],[1,0],[2,0]]',         output: '1' },
    { input: '6\n[[0,1],[2,3],[2,4],[3,5]]',   output: '2' },
    { input: '5\n[[0,1],[0,2],[1,2],[3,4]]',   output: '2' },
    { input: '4\n[[0,3],[1,3],[2,3]]',         output: '1' },
    { input: '7\n[[0,1],[2,3],[4,5]]',         output: '4' },
    { input: '5\n[[0,1],[2,4],[1,3]]',         output: '2' },
  ],

  // -------------------------------------------------------------------------
  // 121. GRAPH VALID TREE
  // Input:  n (int) \n edges (int[][])
  // Output: "true" if edges form a valid tree, "false" otherwise
  // -------------------------------------------------------------------------
  'graph-valid-tree': [
    { input: '5\n[[0,1],[0,2],[0,3],[1,4]]',   output: 'true'  },
    { input: '5\n[[0,1],[1,2],[2,3],[1,3],[1,4]]', output: 'false' },
    { input: '1\n[]',                           output: 'true'  },
    { input: '2\n[[0,1]]',                      output: 'true'  },
    { input: '2\n[]',                           output: 'false' },
    { input: '3\n[[0,1],[1,2]]',               output: 'true'  },
    { input: '3\n[[0,1],[1,2],[0,2]]',         output: 'false' },
    { input: '3\n[[0,1]]',                      output: 'false' },
    { input: '4\n[[0,1],[1,2],[2,3]]',         output: 'true'  },
    { input: '4\n[[0,1],[1,2],[2,3],[3,0]]',   output: 'false' },
    { input: '4\n[[0,1],[1,2],[2,3],[1,3]]',   output: 'false' },
    { input: '4\n[[0,1],[0,2],[0,3]]',         output: 'true'  },
    { input: '4\n[[0,1],[2,3]]',               output: 'false' },
    { input: '5\n[[0,1],[1,2],[2,3],[3,4]]',   output: 'true'  },
    { input: '5\n[[0,1],[1,2],[2,3],[3,4],[4,0]]', output: 'false' },
    { input: '5\n[[0,1],[0,2],[0,3],[0,4]]',   output: 'true'  },
    { input: '6\n[[0,1],[0,2],[0,3],[1,4],[2,5]]', output: 'true' },
    { input: '6\n[[0,1],[1,2],[2,3],[3,4],[4,5]]', output: 'true' },
    { input: '6\n[[0,1],[1,2],[2,3],[3,4],[4,5],[5,0]]', output: 'false' },
    { input: '6\n[[0,1],[0,2],[0,3],[3,4],[2,5],[1,4]]', output: 'false' },
    { input: '6\n[[0,1],[1,3],[2,3],[2,4],[3,5]]', output: 'true' },
    { input: '4\n[[0,1],[1,2],[3,2],[1,3]]',   output: 'false' },
    { input: '5\n[[0,1],[2,3]]',               output: 'false' },
    { input: '7\n[[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]]', output: 'true' },
    { input: '5\n[[0,1],[1,2],[2,4],[3,4]]',   output: 'true'  },
    { input: '5\n[[0,1],[1,2],[2,4],[3,4],[0,4]]', output: 'false' },
    { input: '3\n[]',                           output: 'false' },
    { input: '4\n[[0,1],[1,2]]',               output: 'false' },
    { input: '5\n[[0,2],[0,3],[1,4],[2,4]]',   output: 'false' },
    { input: '5\n[[0,2],[0,3],[0,4],[2,3]]',   output: 'false' },
    { input: '6\n[[0,1],[0,2],[1,3],[3,4],[4,5]]', output: 'true' },
    { input: '6\n[[0,1],[0,2],[1,3],[3,4],[4,5],[2,3]]', output: 'false' },
    { input: '7\n[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6]]', output: 'true' },
    { input: '7\n[[0,1],[1,2],[2,3],[3,4],[4,5],[5,0]]', output: 'false' },
    { input: '4\n[[0,3],[1,3],[2,3]]',         output: 'true'  },
    { input: '4\n[[0,1],[0,2],[3,1]]',         output: 'false' },
    { input: '5\n[[0,1],[1,2],[2,3],[0,4]]',   output: 'true'  },
    { input: '5\n[[0,1],[1,2],[3,4]]',         output: 'false' },
    { input: '8\n[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]', output: 'true' },
    { input: '8\n[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,0]]', output: 'false' },
    { input: '5\n[[0,1],[0,2],[1,3],[2,4]]',   output: 'true'  },
    { input: '6\n[[0,1],[0,3],[1,2],[2,3],[3,4],[4,5]]', output: 'false' },
    { input: '5\n[[0,1],[0,2],[3,4]]',         output: 'false' },
    { input: '6\n[[0,1],[1,2],[2,3],[0,4],[1,5]]', output: 'true' },
    { input: '5\n[[0,1],[1,3],[2,3],[3,4]]',   output: 'true'  },
    { input: '5\n[[0,1],[1,3],[2,3],[3,4],[0,3]]', output: 'false' },
    { input: '3\n[[0,1],[0,2]]',               output: 'true'  },
    { input: '3\n[[0,1],[1,0]]',               output: 'false' },
    { input: '4\n[[0,1],[1,2],[2,0]]',         output: 'false' },
    { input: '6\n[[0,1],[1,2],[3,4],[4,5],[0,3]]', output: 'true' },
    { input: '6\n[[0,1],[1,2],[3,4],[4,5],[0,3],[2,5]]', output: 'false' },
    { input: '5\n[[0,4],[1,4],[2,4],[3,4]]',   output: 'true'  },
    { input: '5\n[[0,4],[1,4],[2,4],[3,4],[0,1]]', output: 'false' },
    { input: '7\n[[0,1],[0,2],[3,4],[3,5],[3,6],[2,3]]', output: 'true'  },
    { input: '7\n[[0,1],[0,2],[3,4],[3,5],[3,6],[2,3],[1,5]]', output: 'false' },
    { input: '6\n[[0,1],[1,2],[2,3],[3,4],[4,5]]', output: 'true' },
    { input: '5\n[[0,1],[1,2],[2,3],[3,0],[4,0]]', output: 'false' },
    { input: '4\n[[0,1],[1,3],[0,3]]',         output: 'false' },
    { input: '5\n[[0,3],[1,3],[2,4],[3,4]]',   output: 'true'  },
    { input: '5\n[[0,1],[2,3],[3,4],[4,2]]',   output: 'false' },
    { input: '5\n[[0,1],[0,2],[1,2],[3,4]]',   output: 'false' },
  ],

  // -------------------------------------------------------------------------
  // 122. RECONSTRUCT ITINERARY
  // Input:  tickets (string[][]) — [from, to]
  // Output: itinerary (string[]) — lexicographically smallest valid path from JFK
  // -------------------------------------------------------------------------
  'reconstruct-itinerary': [
    { input: '[["MUC","LHR"],["JFK","MUC"],["SFO","SJC"],["LHR","SFO"]]',
      output: '["JFK","MUC","LHR","SFO","SJC"]' },
    { input: '[["JFK","SFO"],["JFK","ATL"],["SFO","ATL"],["ATL","JFK"],["ATL","SFO"]]',
      output: '["JFK","ATL","JFK","SFO","ATL","SFO"]' },
    { input: '[["JFK","KUL"],["JFK","NRT"],["NRT","JFK"]]',
      output: '["JFK","NRT","JFK","KUL"]' },
    { input: '[["JFK","ATL"],["ATL","JFK"]]',
      output: '["JFK","ATL","JFK"]' },
    { input: '[["JFK","A"],["A","B"],["B","JFK"]]',
      output: '["JFK","A","B","JFK"]' },
    { input: '[["JFK","SFO"]]',
      output: '["JFK","SFO"]' },
    { input: '[["JFK","A"],["JFK","B"],["A","JFK"]]',
      output: '["JFK","A","JFK","B"]' },
    { input: '[["JFK","B"],["JFK","A"],["B","JFK"]]',
      output: '["JFK","A"]' },
    { input: '[["JFK","C"],["JFK","B"],["B","JFK"],["C","JFK"],["JFK","A"]]',
      output: '["JFK","A"]' },
    { input: '[["JFK","SFO"],["SFO","JFK"],["JFK","ATL"],["ATL","JFK"]]',
      output: '["JFK","ATL","JFK","SFO","JFK"]' },
    { input: '[["JFK","A"],["A","C"],["C","B"],["B","A"],["A","JFK"]]',
      output: '["JFK","A","C","B","A","JFK"]' },
    { input: '[["JFK","B"],["B","C"],["C","JFK"],["JFK","A"],["A","JFK"]]',
      output: '["JFK","A","JFK","B","C","JFK"]' },
    { input: '[["JFK","A"],["A","B"],["B","JFK"],["JFK","C"],["C","JFK"]]',
      output: '["JFK","A","B","JFK","C","JFK"]' },
    { input: '[["JFK","A"],["A","JFK"],["JFK","A"],["A","B"]]',
      output: '["JFK","A","B"]' },
    { input: '[["EZE","AXA"],["TIA","ANU"],["ANU","JFK"],["JFK","ANU"],["ANU","EZE"],["TIA","ANU"],["AXA","TIA"],["TIA","ANU"],["ANU","TIA"],["JFK","TIA"]]',
      output: '["JFK","ANU","EZE","AXA","TIA","ANU","JFK","TIA","ANU","TIA","ANU"]' },
    { input: '[["JFK","A"],["A","B"],["B","C"],["C","D"],["D","JFK"]]',
      output: '["JFK","A","B","C","D","JFK"]' },
    { input: '[["JFK","A"],["A","B"],["B","JFK"],["JFK","B"],["B","A"],["A","JFK"]]',
      output: '["JFK","A","B","A","JFK","B","JFK"]' },
    { input: '[["JFK","SFO"],["JFK","ATL"],["ATL","SFO"],["SFO","ATL"]]',
      output: '["JFK","ATL","SFO","ATL"]' },
    { input: '[["JFK","A"],["JFK","A"],["A","JFK"]]',
      output: '["JFK","A","JFK","A"]' },
    { input: '[["JFK","A"],["A","JFK"],["JFK","B"],["B","JFK"],["JFK","C"]]',
      output: '["JFK","A","JFK","B","JFK","C"]' },
  ],

  // -------------------------------------------------------------------------
  // 123. MIN COST TO CONNECT ALL POINTS
  // Input:  points (int[][]) — [x, y]
  // Output: minimum cost (int) to connect all points (MST sum of Manhattan distances)
  // -------------------------------------------------------------------------
  'min-cost-to-connect-all-points': [
    { input: '[[0,0],[2,2],[3,10],[5,2],[7,0]]', output: '20'  },
    { input: '[[3,12],[-2,5],[-4,1]]',            output: '18'  },
    { input: '[[0,0],[1,1],[1,0],[-1,1]]',        output: '4'   },
    { input: '[[0,0]]',                           output: '0'   },
    { input: '[[0,0],[1,0]]',                     output: '1'   },
    { input: '[[0,0],[0,1]]',                     output: '1'   },
    { input: '[[0,0],[1,0],[2,0]]',               output: '2'   },
    { input: '[[0,0],[0,1],[0,2]]',               output: '2'   },
    { input: '[[0,0],[1,1]]',                     output: '2'   },
    { input: '[[0,0],[2,0],[0,2],[2,2]]',         output: '6'   },
    { input: '[[0,0],[0,0]]',                     output: '0'   },
    { input: '[[1,1],[3,4],[-1,0]]',              output: '7'   },
    { input: '[[-14,-14],[-18,5],[18,-10],[18,18],[10,-2]]', output: '92' },
    { input: '[[0,0],[10,0],[10,10],[0,10]]',     output: '30'  },
    { input: '[[0,0],[1,0],[2,0],[3,0],[4,0]]',   output: '4'   },
    { input: '[[0,0],[0,1],[0,2],[0,3],[0,4]]',   output: '4'   },
    { input: '[[0,0],[100,0]]',                   output: '100' },
    { input: '[[0,0],[0,100]]',                   output: '100' },
    { input: '[[5,5],[0,0],[10,0],[10,10],[0,10]]', output: '28' },
    { input: '[[0,0],[1,1],[2,2],[3,3]]',         output: '6'   },
    { input: '[[0,0],[-1,-1],[1,1],[-2,-2],[2,2]]', output: '8' },
    { input: '[[1,0],[0,1],[-1,0],[0,-1]]',       output: '4'   },
    { input: '[[0,0],[1,2],[3,1],[4,3],[5,0]]',   output: '9'   },
    { input: '[[0,0],[3,0],[0,4]]',               output: '7'   },
    { input: '[[2,0],[0,2],[-2,0],[0,-2]]',       output: '8'   },
    { input: '[[0,0],[1,0],[0,1],[1,1]]',         output: '3'   },
    { input: '[[0,0],[10,10]]',                   output: '20'  },
    { input: '[[0,0],[5,0],[5,5],[0,5],[2,3]]',   output: '17'  },
    { input: '[[0,0],[2,1],[4,0],[3,3],[1,4]]',   output: '8'   },
    { input: '[[0,0],[3,0],[6,0],[9,0]]',         output: '9'   },
  ],

  // -------------------------------------------------------------------------
  // 124. NETWORK DELAY TIME
  // Input:  times (int[][]) — [u, v, w] \n n (int) \n k (int)
  // Output: minimum time for all nodes to receive signal (-1 if impossible)
  // -------------------------------------------------------------------------
  'network-delay-time': [
    { input: '[[2,1,1],[2,3,1],[3,4,1]]\n4\n2',    output: '2'  },
    { input: '[[1,2,1]]\n2\n1',                     output: '1'  },
    { input: '[[1,2,1]]\n2\n2',                     output: '-1' },
    { input: '[[1,2,1],[2,3,2],[1,3,4]]\n3\n1',     output: '3'  },
    { input: '[[1,2,1],[2,3,7],[1,3,4],[2,1,2]]\n3\n1', output: '4' },
    { input: '[[1,2,1],[1,3,2],[1,4,3]]\n4\n1',     output: '3'  },
    { input: '[[1,2,1]]\n1\n1',                     output: '0'  },
    { input: '[[1,2,1],[2,3,2],[3,4,3],[4,5,4]]\n5\n1', output: '10' },
    { input: '[[1,2,1],[2,1,3]]\n2\n2',             output: '3'  },
    { input: '[[1,2,1],[2,3,1],[3,1,1]]\n3\n1',     output: '2'  },
    { input: '[[1,2,9],[1,3,3],[3,2,5]]\n3\n1',     output: '8'  },
    { input: '[[1,2,1],[1,3,1],[2,4,1],[3,4,1]]\n4\n1', output: '2' },
    { input: '[[1,2,5],[2,3,3],[1,3,10]]\n3\n1',    output: '8'  },
    { input: '[[1,2,1],[3,4,1]]\n4\n1',             output: '-1' },
    { input: '[[1,2,1],[1,3,2],[2,3,1]]\n3\n1',     output: '2'  },
    { input: '[[1,2,1],[2,3,1],[1,3,5]]\n3\n1',     output: '2'  },
    { input: '[[2,3,6],[1,3,5],[1,2,3]]\n3\n1',     output: '5'  },
    { input: '[[1,2,1],[2,3,1],[3,4,1],[4,5,1],[5,6,1]]\n6\n1', output: '5' },
    { input: '[[1,2,2],[1,3,4],[2,3,1]]\n3\n1',     output: '3'  },
    { input: '[[1,2,1],[1,3,100],[2,3,1]]\n3\n1',   output: '2'  },
    { input: '[[1,2,1],[2,1,1]]\n2\n1',             output: '1'  },
    { input: '[[4,2,76],[1,3,79],[3,1,81],[4,3,30],[2,1,47],[1,5,61],[1,4,99],[3,5,69],[4,1,sequence]]\n5\n3',
      output: '-1' },
    { input: '[[1,2,1],[1,3,1],[1,4,1],[1,5,1]]\n5\n1', output: '1' },
    { input: '[[1,2,1],[3,4,2],[5,6,3],[2,3,1],[4,5,1]]\n6\n1', output: '8' },
    { input: '[[1,2,3],[2,3,3],[3,4,3],[4,5,3]]\n5\n1', output: '12' },
    { input: '[[1,2,1],[2,3,2],[3,2,1]]\n3\n1',     output: '3'  },
    { input: '[[1,2,10],[2,3,10],[3,1,10]]\n3\n3',  output: '20' },
    { input: '[[1,2,1]]\n3\n1',                     output: '-1' },
    { input: '[[2,1,1],[2,3,1],[3,4,1]]\n4\n1',     output: '-1' },
    { input: '[[1,2,1],[1,3,1],[2,4,1],[3,4,2]]\n4\n1', output: '2' },
  ],

  // -------------------------------------------------------------------------
  // 125. SWIM IN RISING WATER
  // Input:  grid (int[][]) — n×n, grid[i][j] = elevation
  // Output: minimum time t such that a path exist from (0,0) to (n-1,n-1)
  // -------------------------------------------------------------------------
  'swim-in-rising-water': [
    { input: '[[0,2],[1,3]]',                       output: '3'  },
    { input: '[[0,1,2,3,4],[24,23,22,21,5],[12,13,14,20,6],[11,16,15,19,7],[10,17,18,9,8]]',
      output: '16' },
    { input: '[[0]]',                               output: '0'  },
    { input: '[[0,1],[1,0]]',                       output: '1'  },
    { input: '[[0,3],[2,1]]',                       output: '3'  },
    { input: '[[3,2],[0,1]]',                       output: '3'  },
    { input: '[[0,1,2],[3,4,5],[6,7,8]]',           output: '8'  },
    { input: '[[0,2,4],[6,1,5],[3,7,8]]',           output: '8'  },
    { input: '[[0,1],[3,2]]',                       output: '3'  },
    { input: '[[2,0],[1,3]]',                       output: '3'  },
    { input: '[[0,1,2,3],[4,5,6,7],[8,9,10,11],[12,13,14,15]]', output: '15' },
    { input: '[[0,3,1],[2,4,6],[5,7,8]]',           output: '8'  },
    { input: '[[0,1,4],[3,6,5],[2,7,8]]',           output: '8'  },
    { input: '[[4,0,3],[1,5,2],[8,6,7]]',           output: '8'  },
    { input: '[[0,1,3,5],[2,4,7,9],[6,8,11,13],[10,12,14,15]]', output: '15' },
    { input: '[[0,2,1,3],[4,6,5,7],[8,10,9,11],[12,14,13,15]]', output: '15' },
    { input: '[[3,1],[2,0]]',                       output: '3'  },
    { input: '[[1,0],[2,3]]',                       output: '3'  },
    { input: '[[0,4],[3,2],[1,5]]',                 output: '4'  },
    { input: '[[0,5,4,3],[1,6,7,2],[8,9,10,11],[15,14,13,12]]', output: '12' },
    { input: '[[0,2,1,6],[3,5,4,7],[8,10,9,11],[15,14,13,12]]', output: '12' },
    { input: '[[0,1,5],[2,3,4],[9,8,6],[10,11,7]]', output: '9'  },
    { input: '[[16,0,1],[2,3,4],[5,6,7]]',          output: '16' },
    { input: '[[0,8],[4,2]]',                       output: '8'  },
    { input: '[[2,1],[0,3]]',                       output: '3'  },
    { input: '[[0,1,2,3,4],[5,6,7,8,9],[10,11,12,13,14],[15,16,17,18,19],[20,21,22,23,24]]', output: '24' },
    { input: '[[0,2,1,6,3],[7,4,5,8,9],[14,10,11,12,13],[19,15,16,17,18],[24,20,21,22,23]]', output: '24' },
    { input: '[[0,1],[2,3]]',                       output: '3'  },
    { input: '[[3,0],[2,1]]',                       output: '3'  },
    { input: '[[0,3,2,1],[4,5,6,7],[8,9,10,11],[12,13,14,15]]', output: '15' },
  ],

  // -------------------------------------------------------------------------
  // 126. ALIEN DICTIONARY
  // Input:  words (string[]) — sorted in alien alphabet order
  // Output: alien alphabet order string (or "" if invalid / inconsistent)
  // -------------------------------------------------------------------------
  'alien-dictionary': [
    { input: '["wrt","wrf","er","ett","rftt"]',  output: '"wertf"' },
    { input: '["z","x"]',                         output: '"zx"'    },
    { input: '["z","x","z"]',                     output: '""'      },
    { input: '["abc","ab"]',                      output: '""'      },
    { input: '["a","b","ca","cb"]',               output: '"abc"'   },
    { input: '["a","b","c"]',                     output: '"abc"'   },
    { input: '["z"]',                             output: '"z"'     },
    { input: '["a"]',                             output: '"a"'     },
    { input: '["ab","adc"]',                      output: '"abdc"'  },
    { input: '["baa","abcd","abca","cab","cad"]', output: '"bdac"'  },
    { input: '["ab","ab"]',                       output: '"ab"'    },
    { input: '["ba","bc","ac","cab"]',            output: '"bac"'   },
    { input: '["z","z"]',                         output: '"z"'     },
    { input: '["zy","zx"]',                       output: '"zyx"'   },
    { input: '["abc","abd"]',                     output: '"abcd"'  },
    { input: '["ac","ab","b"]',                   output: '"acb"'   },
    { input: '["caa","aaa","aab"]',               output: '"cab"'   },
    { input: '["a","bc"]',                        output: '"abc"'   },
    { input: '["ca","cba","cbb","cb"]',           output: '""'      },
    { input: '["wrtkj","wrt"]',                   output: '""'      },
    { input: '["x","z","x"]',                     output: '""'      },
    { input: '["a","aa"]',                        output: '"a"'     },
    { input: '["wrt","wrf"]',                     output: '"wrtf"'  },
    { input: '["wr","wrf"]',                      output: '"wrf"'   },
    { input: '["abc","bcd","cde"]',               output: '"abcde"' },
    { input: '["aab","aac","ab"]',                output: '"abc"'   },
    { input: '["aac","ab","b"]',                  output: '"abc"'   },
    { input: '["b","a"]',                         output: '"ba"'    },
    { input: '["abc","abc"]',                     output: '"abc"'   },
    { input: '["apple","app"]',                   output: '""'      },
  ],

  // -------------------------------------------------------------------------
  // 127. CHEAPEST FLIGHTS WITHIN K STOPS
  // Input:  n (int) \n flights (int[][]) — [from,to,price] \n src (int) \n dst (int) \n k (int)
  // Output: cheapest price (-1 if impossible)
  // -------------------------------------------------------------------------
  'cheapest-flights-within-k-stops': [
    { input: '4\n[[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]]\n0\n3\n1',
      output: '700'  },
    { input: '3\n[[0,1,100],[1,2,100],[0,2,500]]\n0\n2\n1',
      output: '200'  },
    { input: '3\n[[0,1,100],[1,2,100],[0,2,500]]\n0\n2\n0',
      output: '500'  },
    { input: '1\n[]\n0\n0\n0',
      output: '0'    },
    { input: '2\n[[0,1,100]]\n0\n1\n0',
      output: '100'  },
    { input: '2\n[[0,1,100]]\n1\n0\n0',
      output: '-1'   },
    { input: '4\n[[0,1,1],[0,2,5],[1,2,1],[2,3,1]]\n0\n3\n1',
      output: '6'    },
    { input: '5\n[[1,2,10],[2,0,7],[1,3,8],[4,0,10],[3,4,2],[4,2,10],[0,3,3],[3,1,6],[2,4,5]]\n0\n4\n1',
      output: '5'    },
    { input: '3\n[[0,1,2],[1,2,1],[2,0,10]]\n1\n2\n1',
      output: '1'    },
    { input: '3\n[[0,1,5],[1,2,5],[0,2,2]]\n0\n2\n0',
      output: '2'    },
    { input: '3\n[[0,1,5],[1,2,5],[0,2,2]]\n0\n2\n1',
      output: '2'    },
    { input: '4\n[[0,1,1],[0,2,5],[1,3,1],[2,3,1]]\n0\n3\n1',
      output: '2'    },
    { input: '4\n[[0,1,100],[1,2,100],[2,3,100]]\n0\n3\n1',
      output: '-1'   },
    { input: '4\n[[0,1,100],[1,2,100],[2,3,100]]\n0\n3\n2',
      output: '300'  },
    { input: '5\n[[0,1,100],[1,2,100],[2,3,100],[3,4,100]]\n0\n4\n3',
      output: '400'  },
    { input: '5\n[[0,1,100],[0,2,500],[1,2,100],[2,3,100],[3,4,100]]\n0\n4\n2',
      output: '-1'   },
    { input: '5\n[[0,1,100],[0,2,500],[1,2,100],[2,3,100],[3,4,100]]\n0\n4\n3',
      output: '400'  },
    { input: '3\n[[0,1,100],[0,2,100],[1,2,1]]\n0\n2\n0',
      output: '100'  },
    { input: '3\n[[0,1,100],[0,2,100],[1,2,1]]\n0\n2\n1',
      output: '101'  },
    { input: '10\n[[3,4,4],[2,5,6],[4,7,10],[9,6,5],[7,4,4],[6,2,10],[6,8,6],[7,9,4],[1,9,5],[6,10,3]]\n6\n10\n4',
      output: '-1'   },
    { input: '4\n[[0,1,1],[0,2,5],[1,2,1],[2,3,1]]\n0\n3\n2',
      output: '3'    },
    { input: '4\n[[0,1,1],[1,2,1],[2,3,1]]\n0\n3\n0',
      output: '-1'   },
    { input: '4\n[[0,1,1],[1,2,1],[2,3,1]]\n0\n3\n2',
      output: '3'    },
    { input: '3\n[[0,1,1],[0,2,2],[1,2,1]]\n0\n2\n1',
      output: '2'    },
    { input: '2\n[[0,1,100],[1,0,100]]\n0\n1\n0',
      output: '100'  },
    { input: '2\n[[0,1,100],[1,0,100]]\n0\n1\n1',
      output: '100'  },
    { input: '4\n[[0,1,100],[1,2,200],[2,3,300],[0,3,700]]\n0\n3\n2',
      output: '600'  },
    { input: '5\n[[0,1,1],[0,2,5],[1,3,2],[2,3,1],[3,4,1]]\n0\n4\n2',
      output: '4'    },
    { input: '3\n[[0,1,1],[1,0,1],[0,2,10],[1,2,1]]\n0\n2\n1',
      output: '2'    },
    { input: '5\n[[0,1,5],[1,2,5],[0,3,2],[3,2,2]]\n0\n2\n1',
      output: '4'    },
  ],

  // -------------------------------------------------------------------------
  // 128. WORD LADDER
  // Input:  beginWord (string) \n endWord (string) \n wordList (string[])
  // Output: length of shortest transformation sequence (int); 0 if none
  // -------------------------------------------------------------------------
  'word-ladder': [
    { input: '"hit"\n"cog"\n["hot","dot","dog","lot","log","cog"]',  output: '5' },
    { input: '"hit"\n"cog"\n["hot","dot","dog","lot","log"]',        output: '0' },
    { input: '"a"\n"c"\n["a","b","c"]',                             output: '2' },
    { input: '"lost"\n"cost"\n["most","fist","lost","cost","fish"]', output: '2' },
    { input: '"hot"\n"dog"\n["hot","dog","dot"]',                   output: '3' },
    { input: '"hot"\n"dog"\n["dog"]',                               output: '0' },
    { input: '"hot"\n"hot"\n["hot"]',                               output: '1' },
    { input: '"ab"\n"cd"\n["ab","ac","ad","bc","bd","cd"]',         output: '3' },
    { input: '"ab"\n"cd"\n["ac","bd","bc","cd","ad","ab"]',         output: '3' },
    { input: '"cat"\n"dog"\n["cat","bat","bag","dag","dog"]',       output: '5' },
    { input: '"cat"\n"dog"\n["cat","bat","bag","dag"]',             output: '0' },
    { input: '"hit"\n"cog"\n["hot","dot","dog","lot","log","cog","hit"]', output: '5' },
    { input: '"abc"\n"xyz"\n["abc","xbc","xyc","xyz"]',             output: '4' },
    { input: '"abc"\n"xyz"\n["xbc","xyc","xyz"]',                   output: '0' },
    { input: '"cet"\n"ism"\n["kid","tag","pup","ail","tun","woo","erg","luz","brr","gay","sip","kay","per","val","mes","ohs","now","boa","cet","pal","bar","die","war","hay","eco","pub","lob","rue","fry","lit","rex","jan","cot","bid","ali","pay","col","gum","ger","row","won","dan","rum","fad","tut","sag","yip","sui","ark","has","zip","fez","own","ump","dis","ads","max","jaw","out","jaw","par","hag","lye","eve","net","ism"]',
      output: '0' },
    { input: '"dog"\n"log"\n["dog","log","lot","dot","hot"]',       output: '2' },
    { input: '"sand"\n"acne"\n["sand","mand","mane","cane","acne"]', output: '5' },
    { input: '"sand"\n"acne"\n["mand","mane","cane","acne"]',       output: '0' },
    { input: '"qa"\n"sq"\n["si","go","se","cm","so","ph","mt","db","mb","sb","kr","ln","tm","le","av","sm","ar","ci","ca","br","ti","ba","to","ra","fa","yo","ow","sn","ya","cr","po","fe","ho","ma","re","or","rn","au","ur","rh","sr","tc","lt","lo","as","fr","nb","yb","if","pb","ge","th","pm","rb","sh","co","ga","li","ha","hz","no","bi","di","hi","qa","pi","os","uh","wm","an","me","mo","na","la","st","er","sc","ne","mn","mi","am","ex","pt","io","be","fm","ta","tb","ni","mr","pa","he","lr","sq","ye"]',
      output: '5' },
    { input: '"toon"\n"plea"\n["poon","plee","same","poie","plea","pieg","asol"]',
      output: '7' },
    { input: '"leet"\n"code"\n["lest","leet","lose","code","lode","robe","lost"]',
      output: '6' },
  ],

  // -------------------------------------------------------------------------
  // 129. K CLOSEST POINTS TO ORIGIN
  // Input:  points (int[][]) \n k (int)
  // Output: k closest points (int[][]) — any order
  // -------------------------------------------------------------------------
  'k-closest-points-to-origin': [
    { input: '[[1,3],[-2,2]]\n1',       output: '[[-2,2]]'                                 },
    { input: '[[3,3],[5,-1],[-2,4]]\n2', output: '[[3,3],[-2,4]]'                          },
    { input: '[[0,0]]\n1',              output: '[[0,0]]'                                  },
    { input: '[[1,0],[0,1]]\n1',        output: '[[1,0]]'                                  },
    { input: '[[1,1],[2,2],[3,3]]\n1',  output: '[[1,1]]'                                  },
    { input: '[[1,1],[2,2],[3,3]]\n2',  output: '[[1,1],[2,2]]'                            },
    { input: '[[1,1],[2,2],[3,3]]\n3',  output: '[[1,1],[2,2],[3,3]]'                      },
    { input: '[[-1,-1],[2,2],[3,3]]\n1', output: '[[-1,-1]]'                               },
    { input: '[[0,1],[1,0]]\n2',        output: '[[0,1],[1,0]]'                            },
    { input: '[[0,2],[2,0],[2,2],[-2,0],[0,-2]]\n3', output: '[[0,2],[2,0],[-2,0]]'        },
    { input: '[[1,2],[2,1],[1,1],[2,2]]\n2', output: '[[1,2],[2,1]]'                       },
    { input: '[[4,4],[3,3],[1,1],[2,2]]\n2', output: '[[1,1],[2,2]]'                       },
    { input: '[[1,3],[-2,2],[5,8],[0,1]]\n2', output: '[[-2,2],[0,1]]'                     },
    { input: '[[0,0],[0,0]]\n2',        output: '[[0,0],[0,0]]'                            },
    { input: '[[1,0],[0,1],[-1,0],[0,-1]]\n2', output: '[[1,0],[0,1]]'                     },
    { input: '[[10,10],[5,5],[1,1],[2,2]]\n3', output: '[[1,1],[2,2],[5,5]]'               },
    { input: '[[-5,4],[3,-3],[0,0]]\n2', output: '[[0,0],[3,-3]]'                          },
    { input: '[[1,1],[1,1],[1,1]]\n2',  output: '[[1,1],[1,1]]'                            },
    { input: '[[2,0],[0,2],[1,1]]\n1',  output: '[[1,1]]'                                  },
    { input: '[[0,0],[1,0],[2,0],[3,0],[4,0]]\n3', output: '[[0,0],[1,0],[2,0]]'           },
    { input: '[[1,1],[2,2],[3,3],[4,4],[5,5]]\n2', output: '[[1,1],[2,2]]'                 },
    { input: '[[-4,-3],[3,4],[-3,4],[4,-3]]\n2', output: '[[-4,-3],[3,4]]'                 },
    { input: '[[1,2],[2,3],[3,4],[4,5]]\n1', output: '[[1,2]]'                             },
    { input: '[[100,100],[50,50],[10,10]]\n2', output: '[[10,10],[50,50]]'                 },
    { input: '[[3,0],[5,4],[-1,-2]]\n2', output: '[[3,0],[-1,-2]]'                         },
    { input: '[[0,1],[1,0],[2,0],[0,2]]\n2', output: '[[0,1],[1,0]]'                       },
    { input: '[[1,2],[3,0],[0,3]]\n1',  output: '[[1,2]]'                                  },
    { input: '[[1,0],[0,1],[2,0]]\n2',  output: '[[1,0],[0,1]]'                            },
    { input: '[[-2,-2],[2,2],[-1,-1],[1,1]]\n2', output: '[[-1,-1],[1,1]]'                 },
    { input: '[[1,3],[2,2],[3,1],[4,0]]\n2', output: '[[3,1],[4,0]]'                       },
  ],

  // -------------------------------------------------------------------------
  // 130. KTH LARGEST ELEMENT IN AN ARRAY
  // Input:  nums (int[]) \n k (int)
  // Output: kth largest element (int)
  // -------------------------------------------------------------------------
  'kth-largest-element-in-an-array': [
    { input: '[3,2,1,5,6,4]\n2',               output: '5'   },
    { input: '[3,2,3,1,2,4,5,5,6]\n4',         output: '4'   },
    { input: '[1]\n1',                          output: '1'   },
    { input: '[1,2]\n1',                        output: '2'   },
    { input: '[1,2]\n2',                        output: '1'   },
    { input: '[2,1]\n1',                        output: '2'   },
    { input: '[2,1]\n2',                        output: '1'   },
    { input: '[3,1,2]\n1',                      output: '3'   },
    { input: '[3,1,2]\n2',                      output: '2'   },
    { input: '[3,1,2]\n3',                      output: '1'   },
    { input: '[1,1,1,1,1]\n1',                  output: '1'   },
    { input: '[1,1,1,1,1]\n3',                  output: '1'   },
    { input: '[5,4,3,2,1]\n1',                  output: '5'   },
    { input: '[5,4,3,2,1]\n3',                  output: '3'   },
    { input: '[5,4,3,2,1]\n5',                  output: '1'   },
    { input: '[-1,-2,-3,-4,-5]\n1',             output: '-1'  },
    { input: '[-1,-2,-3,-4,-5]\n3',             output: '-3'  },
    { input: '[-1,-2,-3,-4,-5]\n5',             output: '-5'  },
    { input: '[1,1,2,2,3,3]\n1',                output: '3'   },
    { input: '[1,1,2,2,3,3]\n3',                output: '2'   },
    { input: '[1,1,2,2,3,3]\n5',                output: '1'   },
    { input: '[10,9,8,7,6,5,4,3,2,1]\n5',       output: '6'   },
    { input: '[10,9,8,7,6,5,4,3,2,1]\n1',       output: '10'  },
    { input: '[10,9,8,7,6,5,4,3,2,1]\n10',      output: '1'   },
    { input: '[7,10,4,3,20,15]\n3',             output: '10'  },
    { input: '[7,10,4,3,20,15]\n4',             output: '7'   },
    { input: '[99,99]\n1',                       output: '99'  },
    { input: '[0,0,0]\n2',                       output: '0'   },
    { input: '[2,2,2,2]\n1',                     output: '2'   },
    { input: '[6,5,4,3,2,1]\n2',                output: '5'   },
    { input: '[100,200,300,400,500]\n3',         output: '300' },
    { input: '[1,3,5,7,9]\n3',                   output: '5'   },
    { input: '[2,4,6,8,10]\n2',                  output: '8'   },
    { input: '[-10,0,10,-5,5]\n3',              output: '0'   },
    { input: '[1000,100,10,1]\n2',               output: '100' },
    { input: '[1,2,3,4,5,6,7,8,9,10]\n5',       output: '6'   },
    { input: '[1,2,3,4,5,6,7,8,9,10]\n1',       output: '10'  },
    { input: '[1,2,3,4,5,6,7,8,9,10]\n10',      output: '1'   },
    { input: '[5]\n1',                           output: '5'   },
    { input: '[1,2,3,4,5]\n1',                   output: '5'   },
    { input: '[1,2,3,4,5]\n5',                   output: '1'   },
    { input: '[4,1,5,2,3]\n2',                   output: '4'   },
    { input: '[-3,-2,-1]\n1',                   output: '-1'  },
    { input: '[-3,-2,-1]\n3',                   output: '-3'  },
    { input: '[0,1,-1]\n2',                      output: '0'   },
    { input: '[3,2,1,5,6,4]\n1',                output: '6'   },
    { input: '[3,2,1,5,6,4]\n6',                output: '1'   },
    { input: '[8,7,6,5,4,3,2,1]\n4',            output: '5'   },
    { input: '[1,2,3]\n1',                       output: '3'   },
    { input: '[1,2,3]\n2',                       output: '2'   },
    { input: '[1,2,3]\n3',                       output: '1'   },
    { input: '[5,2,4,1,3,6,0]\n4',              output: '3'   },
    { input: '[9,3,2,4,8]\n2',                   output: '8'   },
    { input: '[1,2,3,4,5]\n3',                   output: '3'   },
    { input: '[1,2,3,4,5]\n2',                   output: '4'   },
    { input: '[1,2,3,4,5]\n4',                   output: '2'   },
    { input: '[100,99]\n2',                      output: '99'  },
    { input: '[100,99]\n1',                      output: '100' },
    { input: '[1,3]\n1',                         output: '3'   },
    { input: '[1,3]\n2',                         output: '1'   },
    { input: '[5,5,5]\n2',                       output: '5'   },
    { input: '[6,3,5,1,2,4]\n3',                output: '4'   },
  ],

  // -------------------------------------------------------------------------
  // 131. TASK SCHEDULER
  // Input:  tasks (string) — each char a task type \n n (int) cooldown
  // Output: minimum intervals to finish all tasks
  // -------------------------------------------------------------------------
  'task-scheduler': [
    { input: '"AAABBB"\n2',    output: '8'  },
    { input: '"AAABBB"\n0',    output: '6'  },
    { input: '"AAAAAABBBBB"\n2',output:'12' },
    { input: '"A"\n0',         output: '1'  },
    { input: '"A"\n1',         output: '1'  },
    { input: '"A"\n10',        output: '1'  },
    { input: '"AA"\n0',        output: '2'  },
    { input: '"AA"\n1',        output: '3'  },
    { input: '"AA"\n2',        output: '4'  },
    { input: '"AB"\n0',        output: '2'  },
    { input: '"AB"\n1',        output: '2'  },
    { input: '"AB"\n2',        output: '2'  },
    { input: '"AAA"\n2',       output: '7'  },
    { input: '"AABB"\n2',      output: '5'  },
    { input: '"AABB"\n0',      output: '4'  },
    { input: '"AABBC"\n1',     output: '5'  },
    { input: '"AABBC"\n2',     output: '6'  },
    { input: '"AABBCDE"\n1',   output: '7'  },
    { input: '"AABBCDE"\n2',   output: '7'  },
    { input: '"AAAA"\n3',      output: '13' },
    { input: '"AAAA"\n2',      output: '10' },
    { input: '"AAAA"\n1',      output: '7'  },
    { input: '"AAAA"\n0',      output: '4'  },
    { input: '"AAAABBBB"\n2',  output: '10' },
    { input: '"AAABBBCCC"\n2', output: '9'  },
    { input: '"AAABBBCCC"\n1', output: '9'  },
    { input: '"AAABBBCCC"\n3', output: '12' },
    { input: '"ABCDE"\n4',     output: '5'  },
    { input: '"ABCDE"\n0',     output: '5'  },
    { input: '"AAAAABBBBBCCCCC"\n2', output: '15' },
    { input: '"AAAAABBBBBCCCCCDDDDD"\n1', output: '20' },
    { input: '"AAAAABBBBBCCCCCDDDDD"\n2', output: '20' },
    { input: '"AAAAABBBBBCCCCCDDDDD"\n4', output: '20' },
    { input: '"AAAAA"\n4',     output: '17' },
    { input: '"AAAAA"\n0',     output: '5'  },
    { input: '"AABB"\n3',      output: '7'  },
    { input: '"AABBB"\n2',     output: '8'  },
    { input: '"AABBB"\n0',     output: '5'  },
    { input: '"ABBCCD"\n2',    output: '7'  },
    { input: '"ABCABCABC"\n0', output: '9'  },
    { input: '"ABCABCABC"\n2', output: '9'  },
    { input: '"AABC"\n2',      output: '6'  },
    { input: '"AAAABC"\n2',    output: '10' },
    { input: '"AAAABC"\n0',    output: '6'  },
    { input: '"AAABBBCCCC"\n3',output: '13' },
    { input: '"G"\n2',         output: '1'  },
    { input: '"GG"\n2',        output: '4'  },
    { input: '"GGG"\n2',       output: '7'  },
    { input: '"AAABBB"\n3',    output: '10' },
    { input: '"AAABBBCCDD"\n2',output:'10'  },
    { input: '"ABCDE"\n3',     output: '5'  },
    { input: '"ABCDEF"\n2',    output: '6'  },
    { input: '"AAABBCC"\n1',   output: '7'  },
    { input: '"AAABBCC"\n2',   output: '8'  },
    { input: '"AAABBBCCC"\n4', output: '13' },
    { input: '"AAABBBCCC"\n0', output: '9'  },
    { input: '"AAABB"\n2',     output: '8'  },
    { input: '"AAABB"\n0',     output: '5'  },
    { input: '"AAABB"\n1',     output: '6'  },
    { input: '"AAAABC"\n3',    output: '11' },
    { input: '"ABCD"\n2',      output: '4'  },
  ],

  // -------------------------------------------------------------------------
  // 132. DESIGN TWITTER
  // Input:  ops (string[])
  //   "Twitter" | "postTweet:userId,tweetId" | "getNewsFeed:userId"
  //   | "follow:followerId,followeeId" | "unfollow:followerId,followeeId"
  // Output: results — "null" for non-query ops, int[] for getNewsFeed
  // -------------------------------------------------------------------------
  'design-twitter': [
    { input: '["Twitter","postTweet:1,5","getNewsFeed:1","follow:1,2","postTweet:2,6","getNewsFeed:1","unfollow:1,2","getNewsFeed:1"]',
      output: '["null","null","[5]","null","null","[6,5]","null","[5]"]' },
    { input: '["Twitter","postTweet:1,1","getNewsFeed:1"]',
      output: '["null","null","[1]"]' },
    { input: '["Twitter","postTweet:1,1","postTweet:2,2","follow:1,2","getNewsFeed:1"]',
      output: '["null","null","null","null","[2,1]"]' },
    { input: '["Twitter","postTweet:1,1","postTweet:1,2","getNewsFeed:1"]',
      output: '["null","null","null","[2,1]"]' },
    { input: '["Twitter","postTweet:1,1","follow:2,1","getNewsFeed:2"]',
      output: '["null","null","null","[1]"]' },
    { input: '["Twitter","follow:1,2","postTweet:2,1","getNewsFeed:1"]',
      output: '["null","null","null","[1]"]' },
    { input: '["Twitter","postTweet:1,1","follow:2,1","unfollow:2,1","getNewsFeed:2"]',
      output: '["null","null","null","null","[]"]' },
    { input: '["Twitter","postTweet:1,1","postTweet:1,2","postTweet:1,3","postTweet:1,4","postTweet:1,5","postTweet:1,6","postTweet:1,7","postTweet:1,8","postTweet:1,9","postTweet:1,10","postTweet:1,11","getNewsFeed:1"]',
      output: '["null","null","null","null","null","null","null","null","null","null","null","null","[11,10,9,8,7,6,5,4,3,2]"]' },
    { input: '["Twitter","getNewsFeed:1"]',
      output: '["null","[]"]' },
    { input: '["Twitter","postTweet:1,1","postTweet:2,2","postTweet:3,3","follow:1,2","follow:1,3","getNewsFeed:1"]',
      output: '["null","null","null","null","null","null","[3,2,1]"]' },
    { input: '["Twitter","postTweet:1,1","follow:1,1","getNewsFeed:1"]',
      output: '["null","null","null","[1]"]' },
    { input: '["Twitter","postTweet:2,5","follow:1,2","getNewsFeed:1","unfollow:1,2","getNewsFeed:1"]',
      output: '["null","null","null","[5]","null","[]"]' },
    { input: '["Twitter","postTweet:1,5","postTweet:1,3","getNewsFeed:1"]',
      output: '["null","null","null","[3,5]"]' },
    { input: '["Twitter","follow:1,2","follow:1,3","postTweet:2,10","postTweet:3,20","getNewsFeed:1"]',
      output: '["null","null","null","null","null","[20,10]"]' },
    { input: '["Twitter","postTweet:1,1","postTweet:2,2","follow:1,2","follow:2,1","getNewsFeed:1","getNewsFeed:2"]',
      output: '["null","null","null","null","null","[2,1]","[1,2]"]' },
    { input: '["Twitter","postTweet:1,2","postTweet:1,3","follow:2,1","getNewsFeed:2"]',
      output: '["null","null","null","null","[3,2]"]' },
    { input: '["Twitter","postTweet:1,1","postTweet:2,2","postTweet:1,3","follow:2,1","getNewsFeed:2"]',
      output: '["null","null","null","null","null","[3,2,1]"]' },
    { input: '["Twitter","postTweet:1,4","postTweet:2,5","follow:1,2","unfollow:1,2","getNewsFeed:1"]',
      output: '["null","null","null","null","null","[4]"]' },
    { input: '["Twitter","postTweet:1,4","postTweet:2,5","follow:1,2","postTweet:2,6","getNewsFeed:1"]',
      output: '["null","null","null","null","null","[6,5,4]"]' },
    { input: '["Twitter","postTweet:1,1","postTweet:1,2","postTweet:2,10","follow:1,2","getNewsFeed:1"]',
      output: '["null","null","null","null","null","[10,2,1]"]' },
  ],

  // -------------------------------------------------------------------------
  // 133. EDIT DISTANCE
  // Input:  word1 (string) \n word2 (string)
  // Output: minimum edit distance (int)
  // -------------------------------------------------------------------------
  'edit-distance': [
    { input: '"horse"\n"ros"',       output: '3' },
    { input: '"intention"\n"execution"', output: '5' },
    { input: '""\n""',               output: '0' },
    { input: '"a"\n""',              output: '1' },
    { input: '""\n"a"',              output: '1' },
    { input: '"a"\n"a"',             output: '0' },
    { input: '"a"\n"b"',             output: '1' },
    { input: '"ab"\n"a"',            output: '1' },
    { input: '"a"\n"ab"',            output: '1' },
    { input: '"abc"\n"abc"',         output: '0' },
    { input: '"abc"\n"abd"',         output: '1' },
    { input: '"abc"\n"ab"',          output: '1' },
    { input: '"abc"\n"ac"',          output: '1' },
    { input: '"abc"\n"bc"',          output: '1' },
    { input: '"abcde"\n"ace"',       output: '2' },
    { input: '"abc"\n"def"',         output: '3' },
    { input: '"abc"\n"cba"',         output: '2' },
    { input: '"kitten"\n"sitting"',  output: '3' },
    { input: '"sunday"\n"saturday"', output: '3' },
    { input: '"pneumonoultramicroscopicsilicovolcanoconiosis"\n"ultramicroscopically"',
      output: '27' },
    { input: '"ab"\n"ba"',           output: '2' },
    { input: '"abcdef"\n"azced"',    output: '3' },
    { input: '"sea"\n"eat"',         output: '2' },
    { input: '"leetcode"\n"etco"',   output: '4' },
    { input: '"word"\n"cord"',       output: '1' },
    { input: '"word"\n"wore"',       output: '1' },
    { input: '"word"\n"word"',       output: '0' },
    { input: '"word"\n"ord"',        output: '1' },
    { input: '"word"\n"wor"',        output: '1' },
    { input: '"abc"\n"a"',           output: '2' },
    { input: '"a"\n"abc"',           output: '2' },
    { input: '"abc"\n"c"',           output: '2' },
    { input: '"abc"\n"b"',           output: '2' },
    { input: '"aaa"\n"a"',           output: '2' },
    { input: '"a"\n"aaa"',           output: '2' },
    { input: '"abc"\n""',            output: '3' },
    { input: '""\n"abc"',            output: '3' },
    { input: '"zoo"\n"oo"',          output: '1' },
    { input: '"oo"\n"zoo"',          output: '1' },
    { input: '"abcd"\n"dcba"',       output: '4' },
    { input: '"abc"\n"bca"',         output: '2' },
    { input: '"bca"\n"abc"',         output: '2' },
    { input: '"distance"\n""',       output: '8' },
    { input: '""\n"distance"',       output: '8' },
    { input: '"abc"\n"aec"',         output: '1' },
    { input: '"aaa"\n"bbb"',         output: '3' },
    { input: '"a"\n"bbb"',           output: '3' },
    { input: '"bbb"\n"a"',           output: '3' },
    { input: '"ab"\n"dc"',           output: '2' },
    { input: '"dc"\n"ab"',           output: '2' },
    { input: '"ab"\n"cd"',           output: '2' },
    { input: '"abc"\n"ac"',          output: '1' },
    { input: '"abbc"\n"abc"',        output: '1' },
    { input: '"abc"\n"abbc"',        output: '1' },
    { input: '"abcde"\n"abfde"',     output: '1' },
    { input: '"plasma"\n"altruism"', output: '6' },
    { input: '"geek"\n"gesek"',      output: '1' },
    { input: '"gesek"\n"geek"',      output: '1' },
    { input: '"abcfgh"\n"abcgfh"',   output: '2' },
    { input: '"abcd"\n"abce"',       output: '1' },
    { input: '"abcd"\n"abc"',        output: '1' },
  ],

  // -------------------------------------------------------------------------
  // 134. BURST BALLOONS
  // Input:  nums (int[])
  // Output: maximum coins (int)
  // -------------------------------------------------------------------------
  'burst-balloons': [
    { input: '[3,1,5,8]',           output: '167' },
    { input: '[1,5]',               output: '10'  },
    { input: '[1]',                 output: '1'   },
    { input: '[2]',                 output: '2'   },
    { input: '[5]',                 output: '5'   },
    { input: '[1,2]',               output: '4'   },
    { input: '[2,1]',               output: '4'   },
    { input: '[1,2,3]',             output: '12'  },
    { input: '[3,2,1]',             output: '12'  },
    { input: '[3,1,5]',             output: '35'  },
    { input: '[0]',                 output: '0'   },
    { input: '[0,0]',               output: '0'   },
    { input: '[1,0,1]',             output: '2'   },
    { input: '[7,9,8,0,7,1,3,5,5,2,3]', output: '1654' },
    { input: '[9,76,64,21]',        output: '116640' },
    { input: '[1,1,1]',             output: '4'   },
    { input: '[2,2,2]',             output: '16'  },
    { input: '[5,5,5]',             output: '250' },
    { input: '[1,2,3,4]',           output: '40'  },
    { input: '[4,3,2,1]',           output: '40'  },
    { input: '[1,1,1,1]',           output: '8'   },
    { input: '[1,2,3,4,5]',         output: '110' },
    { input: '[5,4,3,2,1]',         output: '110' },
    { input: '[3,3,3]',             output: '54'  },
    { input: '[10,9,8]',            output: '1440'},
    { input: '[5,1,5]',             output: '55'  },
    { input: '[1,6,3,8]',           output: '162' },
    { input: '[2,4,6,8,2]',         output: '512' },
    { input: '[6,4,5]',             output: '180' },
    { input: '[3,5,2,8,1]',         output: '280' },
  ],

  // -------------------------------------------------------------------------
  // 135. REGULAR EXPRESSION MATCHING
  // Input:  s (string) \n p (string)
  // Output: "true" / "false"
  // -------------------------------------------------------------------------
  'regular-expression-matching': [
    { input: '"aa"\n"a"',           output: 'false' },
    { input: '"aa"\n"a*"',          output: 'true'  },
    { input: '"ab"\n".*"',          output: 'true'  },
    { input: '"aab"\n"c*a*b"',      output: 'true'  },
    { input: '"mississippi"\n"mis*is*p*."', output: 'false' },
    { input: '""\n""',              output: 'true'  },
    { input: '"a"\n"."',            output: 'true'  },
    { input: '"a"\n"a*"',           output: 'true'  },
    { input: '"a"\n".*"',           output: 'true'  },
    { input: '""\n"a*"',            output: 'true'  },
    { input: '""\n".*"',            output: 'true'  },
    { input: '"b"\n"a*b"',          output: 'true'  },
    { input: '"ab"\n"a*b"',         output: 'true'  },
    { input: '"aab"\n"a*b"',        output: 'true'  },
    { input: '"abc"\n"a.c"',        output: 'true'  },
    { input: '"abc"\n"a.d"',        output: 'false' },
    { input: '"a"\n"ab*"',          output: 'true'  },
    { input: '"a"\n"ab*a"',         output: 'false' },
    { input: '"aab"\n"a*ab"',       output: 'false' },
    { input: '"aab"\n"a*a*b"',      output: 'true'  },
    { input: '"abc"\n"abc"',        output: 'true'  },
    { input: '"abc"\n"ab."',        output: 'true'  },
    { input: '"abc"\n"a.*c"',       output: 'true'  },
    { input: '"abc"\n"a.*d"',       output: 'false' },
    { input: '"abc"\n".*c"',        output: 'true'  },
    { input: '"abc"\n".*d"',        output: 'false' },
    { input: '"bbbba"\n".*a*a"',    output: 'true'  },
    { input: '"a"\n"a"',            output: 'true'  },
    { input: '"a"\n"b"',            output: 'false' },
    { input: '"ab"\n"ab"',          output: 'true'  },
    { input: '"ab"\n".*"',          output: 'true'  },
    { input: '""\n"c*c*"',          output: 'true'  },
    { input: '"a"\n"c*a"',          output: 'true'  },
    { input: '"aaa"\n"a*a"',        output: 'true'  },
    { input: '"aaa"\n"aa"',         output: 'false' },
    { input: '"aaa"\n"a*"',         output: 'true'  },
    { input: '"ab"\n"a*b*"',        output: 'true'  },
    { input: '"b"\n"a*b*"',         output: 'true'  },
    { input: '"a"\n"a*b*"',         output: 'true'  },
    { input: '""\n"a*b*"',          output: 'true'  },
    { input: '"abc"\n"a*b*c*"',     output: 'true'  },
    { input: '"abbc"\n"ab*c"',      output: 'true'  },
    { input: '"abbc"\n"ab*bc"',     output: 'true'  },
    { input: '"abbc"\n"ab*bbc"',    output: 'false' },
    { input: '"abc"\n"a*abc"',      output: 'false' },
    { input: '"abc"\n"a*bc"',       output: 'false' },
    { input: '"ac"\n"ab*c"',        output: 'true'  },
    { input: '"adc"\n"ab*c"',       output: 'false' },
    { input: '"ab"\n"a*"',          output: 'false' },
    { input: '"abc"\n"a*b.c"',      output: 'false' },
    { input: '"abc"\n"a*.c"',       output: 'false' },
    { input: '"abc"\n"a.*"',        output: 'true'  },
    { input: '""\n"."',             output: 'false' },
    { input: '"c"\n"*.c"',          output: 'false' },
    { input: '"ab"\n"b*a*ab"',      output: 'true'  },
    { input: '"axyz"\n"a.*"',       output: 'true'  },
    { input: '"m"\n".*m"',          output: 'true'  },
    { input: '"abcm"\n".*m"',       output: 'true'  },
    { input: '"abcn"\n".*m"',       output: 'false' },
    { input: '"aaa"\n"a.a"',        output: 'true'  },
  ],

  // -------------------------------------------------------------------------
  // 136. LONGEST INCREASING PATH IN A MATRIX
  // Input:  matrix (int[][])
  // Output: length of longest increasing path (int)
  // -------------------------------------------------------------------------
  'longest-increasing-path-in-a-matrix': [
    { input: '[[9,9,4],[6,6,8],[2,1,1]]',     output: '4' },
    { input: '[[3,4,5],[3,2,6],[2,2,1]]',     output: '4' },
    { input: '[[1]]',                          output: '1' },
    { input: '[[1,2],[3,4]]',                 output: '3' },
    { input: '[[4,3],[2,1]]',                 output: '4' },
    { input: '[[1,2,3],[4,5,6],[7,8,9]]',     output: '5' },
    { input: '[[9,8,7],[6,5,4],[3,2,1]]',     output: '5' },
    { input: '[[1,1,1],[1,1,1],[1,1,1]]',     output: '1' },
    { input: '[[1,2,3,4,5]]',                 output: '5' },
    { input: '[[5,4,3,2,1]]',                 output: '5' },
    { input: '[[1],[2],[3],[4],[5]]',          output: '5' },
    { input: '[[5],[4],[3],[2],[1]]',          output: '5' },
    { input: '[[1,2],[4,3]]',                 output: '4' },
    { input: '[[0,1,2,3,4,5,6,7,8,9],[19,18,17,16,15,14,13,12,11,10],[20,21,22,23,24,25,26,27,28,29],[39,38,37,36,35,34,33,32,31,30]]',
      output: '40' },
    { input: '[[1,2,3],[6,5,4],[7,8,9]]',     output: '9' },
    { input: '[[3,4,5],[2,1,6],[1,2,3]]',     output: '5' },
    { input: '[[1,2],[2,1]]',                 output: '2' },
    { input: '[[7,7,5],[2,4,6],[8,2,0]]',     output: '4' },
    { input: '[[0,1,2,3],[3,2,1,4],[4,5,6,5]]', output: '8' },
    { input: '[[1,3,4]]',                     output: '3' },
    { input: '[[5,3,4]]',                     output: '2' },
    { input: '[[1,2,3],[4,5,6]]',             output: '4' },
    { input: '[[6,5,4],[3,2,1]]',             output: '6' },
    { input: '[[1,2,3,4],[8,7,6,5],[9,10,11,12]]', output: '12' },
    { input: '[[2,1],[3,4]]',                 output: '4' },
    { input: '[[1,0],[2,3]]',                 output: '4' },
    { input: '[[3,3],[3,3]]',                 output: '1' },
    { input: '[[5,6,7,8],[4,3,2,9],[1,1,1,10]]', output: '7' },
    { input: '[[1,2,3],[4,5,6],[9,8,7]]',     output: '5' },
    { input: '[[1,3],[4,2]]',                 output: '3' },
  ],

  // -------------------------------------------------------------------------
  // 137. DISTINCT SUBSEQUENCES
  // Input:  s (string) \n t (string)
  // Output: number of distinct subsequences (int)
  // -------------------------------------------------------------------------
  'distinct-subsequences': [
    { input: '"rabbbit"\n"rabbit"',  output: '3'    },
    { input: '"babgbag"\n"bag"',     output: '5'    },
    { input: '"a"\n"a"',             output: '1'    },
    { input: '"a"\n"b"',             output: '0'    },
    { input: '"aa"\n"a"',            output: '2'    },
    { input: '"aaa"\n"a"',           output: '3'    },
    { input: '"abc"\n"abc"',         output: '1'    },
    { input: '"abc"\n""',            output: '1'    },
    { input: '""\n""',               output: '1'    },
    { input: '""\n"a"',              output: '0'    },
    { input: '"ab"\n"a"',            output: '1'    },
    { input: '"ab"\n"b"',            output: '1'    },
    { input: '"ab"\n"ab"',           output: '1'    },
    { input: '"ab"\n"ba"',           output: '0'    },
    { input: '"aabb"\n"ab"',         output: '4'    },
    { input: '"aabb"\n"aa"',         output: '1'    },
    { input: '"aabb"\n"bb"',         output: '1'    },
    { input: '"abc"\n"ab"',          output: '1'    },
    { input: '"abc"\n"bc"',          output: '1'    },
    { input: '"abc"\n"ac"',          output: '1'    },
    { input: '"aaaa"\n"aa"',         output: '6'    },
    { input: '"aaaaa"\n"aa"',        output: '10'   },
    { input: '"aabbc"\n"abc"',       output: '4'    },
    { input: '"abcde"\n"ace"',       output: '1'    },
    { input: '"aaa"\n"aa"',          output: '3'    },
    { input: '"aaaa"\n"a"',          output: '4'    },
    { input: '"b"\n"b"',             output: '1'    },
    { input: '"bb"\n"b"',            output: '2'    },
    { input: '"bbb"\n"b"',           output: '3'    },
    { input: '"bbb"\n"bb"',          output: '3'    },
    { input: '"abab"\n"ab"',         output: '3'    },
    { input: '"abcabc"\n"abc"',      output: '6'    },
    { input: '"abba"\n"ab"',         output: '2'    },
    { input: '"abba"\n"ba"',         output: '2'    },
    { input: '"abc"\n"c"',           output: '1'    },
    { input: '"abc"\n"a"',           output: '1'    },
    { input: '"abcdef"\n"ace"',      output: '1'    },
    { input: '"abcabd"\n"abd"',      output: '2'    },
    { input: '"abcde"\n"a"',         output: '1'    },
    { input: '"abcde"\n"ab"',        output: '1'    },
    { input: '"abcde"\n"de"',        output: '1'    },
    { input: '"xxxxxaaaa"\n"aa"',    output: '6'    },
    { input: '"aabc"\n"abc"',        output: '2'    },
    { input: '"abbc"\n"abc"',        output: '2'    },
    { input: '"abcc"\n"abc"',        output: '2'    },
    { input: '"aba"\n"ab"',          output: '1'    },
    { input: '"aba"\n"a"',           output: '2'    },
    { input: '"aba"\n"aa"',          output: '1'    },
    { input: '"aba"\n"ba"',          output: '1'    },
    { input: '"aba"\n"aba"',         output: '1'    },
    { input: '"aab"\n"ab"',          output: '2'    },
    { input: '"abc"\n"b"',           output: '1'    },
    { input: '"ab"\n"a"',            output: '1'    },
    { input: '"ba"\n"a"',            output: '1'    },
    { input: '"ba"\n"b"',            output: '1'    },
    { input: '"ba"\n"ba"',           output: '1'    },
    { input: '"ba"\n"ab"',           output: '0'    },
    { input: '"cab"\n"ab"',          output: '1'    },
    { input: '"cba"\n"ba"',          output: '1'    },
    { input: '"cba"\n"ab"',          output: '0'    },
    { input: '"nugnuggu"\n"nugg"',   output: '5'    },
  ],

  // -------------------------------------------------------------------------
  // 138. FIND MEDIAN FROM DATA STREAM
  // Input:  ops (string[]) — "MedianFinder" | "addNum:X" | "findMedian"
  // Output: results (string[]) — "null" for non-query ops, decimal string for findMedian
  // -------------------------------------------------------------------------
  'find-median-from-data-stream': [
    { input: '["MedianFinder","addNum:1","addNum:2","findMedian","addNum:3","findMedian"]',
      output: '["null","null","null","1.50000","null","2.00000"]' },
    { input: '["MedianFinder","addNum:1","findMedian"]',
      output: '["null","null","1.00000"]' },
    { input: '["MedianFinder","addNum:1","addNum:3","findMedian"]',
      output: '["null","null","null","2.00000"]' },
    { input: '["MedianFinder","addNum:5","addNum:3","findMedian","addNum:8","addNum:6","findMedian"]',
      output: '["null","null","null","4.00000","null","null","5.50000"]' },
    { input: '["MedianFinder","addNum:1","addNum:2","addNum:3","findMedian"]',
      output: '["null","null","null","null","2.00000"]' },
    { input: '["MedianFinder","addNum:2","addNum:3","addNum:4","findMedian"]',
      output: '["null","null","null","null","3.00000"]' },
    { input: '["MedianFinder","addNum:1","addNum:1","findMedian"]',
      output: '["null","null","null","1.00000"]' },
    { input: '["MedianFinder","addNum:1","addNum:2","addNum:3","addNum:4","findMedian"]',
      output: '["null","null","null","null","null","2.50000"]' },
    { input: '["MedianFinder","addNum:6","addNum:1","addNum:5","findMedian","addNum:9","addNum:2","findMedian"]',
      output: '["null","null","null","null","5.00000","null","null","5.50000"]' },
    { input: '["MedianFinder","addNum:1","addNum:7","addNum:3","addNum:5","findMedian"]',
      output: '["null","null","null","null","null","4.00000"]' },
    { input: '["MedianFinder","addNum:10","addNum:10","addNum:10","findMedian"]',
      output: '["null","null","null","null","10.00000"]' },
    { input: '["MedianFinder","addNum:0","findMedian"]',
      output: '["null","null","0.00000"]' },
    { input: '["MedianFinder","addNum:-1","addNum:1","findMedian"]',
      output: '["null","null","null","0.00000"]' },
    { input: '["MedianFinder","addNum:1","findMedian","addNum:2","findMedian","addNum:3","findMedian","addNum:4","findMedian"]',
      output: '["null","null","1.00000","null","1.50000","null","2.00000","null","2.50000"]' },
    { input: '["MedianFinder","addNum:5","addNum:5","addNum:5","addNum:5","findMedian"]',
      output: '["null","null","null","null","null","5.00000"]' },
    { input: '["MedianFinder","addNum:2","addNum:4","addNum:6","addNum:8","findMedian"]',
      output: '["null","null","null","null","null","5.00000"]' },
    { input: '["MedianFinder","addNum:1","addNum:3","addNum:5","addNum:7","findMedian"]',
      output: '["null","null","null","null","null","4.00000"]' },
    { input: '["MedianFinder","addNum:100","addNum:200","findMedian","addNum:300","findMedian"]',
      output: '["null","null","null","150.00000","null","200.00000"]' },
    { input: '["MedianFinder","addNum:1","addNum:100","addNum:2","addNum:99","addNum:3","findMedian"]',
      output: '["null","null","null","null","null","null","2.50000"]' },
    { input: '["MedianFinder","addNum:1","addNum:2","findMedian","addNum:3","addNum:4","findMedian","addNum:5","findMedian"]',
      output: '["null","null","null","1.50000","null","null","2.50000","null","3.00000"]' },
  ],

  // -------------------------------------------------------------------------
  // 139. SLIDING WINDOW MAXIMUM
  // Input:  nums (int[]) \n k (int)
  // Output: int[] — max of each window of size k
  // -------------------------------------------------------------------------
  'sliding-window-maximum': [
    { input: '[1,3,-1,-3,5,3,6,7]\n3',   output: '[3,3,5,5,6,7]'       },
    { input: '[1]\n1',                    output: '[1]'                  },
    { input: '[1,-1]\n1',                 output: '[1,-1]'               },
    { input: '[9,11]\n2',                 output: '[11]'                 },
    { input: '[4,-2]\n2',                 output: '[4]'                  },
    { input: '[1,3,1,2,0,5]\n3',         output: '[3,3,2,5]'            },
    { input: '[1,2,3,4,5]\n1',           output: '[1,2,3,4,5]'          },
    { input: '[1,2,3,4,5]\n5',           output: '[5]'                  },
    { input: '[5,4,3,2,1]\n3',           output: '[5,4,3]'              },
    { input: '[1,1,1,1,1]\n3',           output: '[1,1,1]'              },
    { input: '[7,2,4]\n2',               output: '[7,4]'                },
    { input: '[2,0,6,6,4,2,7]\n4',       output: '[6,6,6,7]'            },
    { input: '[1,2,3,4,5,6,7,8]\n4',     output: '[4,5,6,7,8]'          },
    { input: '[8,7,6,5,4,3,2,1]\n4',     output: '[8,7,6,5]'            },
    { input: '[1,3,1,3,1,3]\n2',         output: '[3,3,3,3,3]'          },
    { input: '[3,3,3,3]\n2',             output: '[3,3,3]'              },
    { input: '[-7,-8,7,5,7,1,6,0]\n4',   output: '[7,7,7,7]'            },
    { input: '[2,1,5,3,2,4]\n3',         output: '[5,5,5,4]'            },
    { input: '[4,3,5,4,3,3,6,7]\n3',     output: '[5,5,5,4,6,7]'        },
    { input: '[1,2,1,0,4,2,6]\n3',       output: '[2,2,4,4,6]'          },
    { input: '[0,0,0]\n1',               output: '[0,0,0]'              },
    { input: '[-1,-3,-5,-2,-4]\n2',      output: '[-1,-3,-2,-2]'        },
    { input: '[1,2]\n2',                 output: '[2]'                  },
    { input: '[5,5,5]\n3',               output: '[5]'                  },
    { input: '[1,3,5,7,9,2,4,6,8,10]\n4', output: '[7,9,9,9,9,8,10]'   },
    { input: '[10,9,8,7,6,5,4,3,2,1]\n5', output: '[10,9,8,7,6]'        },
    { input: '[1,1,2,2,3,3]\n3',         output: '[2,2,3,3]'            },
    { input: '[4,5,6,7,8,9,1,2,3]\n3',   output: '[6,7,8,9,9,9]'        },
    { input: '[1,2,3,2,1]\n3',           output: '[3,3,3]'              },
    { input: '[6,5,4,3,2,1,7]\n3',       output: '[6,5,4,3,7]'          },
    { input: '[1,8,2,7,3,6,4,5]\n3',     output: '[8,8,7,7,6,6]'        },
    { input: '[1,5,2,5,3,5]\n2',         output: '[5,5,5,5,5]'          },
  ],

  // -------------------------------------------------------------------------
  // 140. KTH LARGEST ELEMENT IN A STREAM
  // Input:  k (int) \n initialNums (int[]) \n addNums (int[])
  // Output: int[] — result of each add() call in order
  // -------------------------------------------------------------------------
  'kth-largest-element-in-a-stream': [
    { input: '3\n[4,5,8,2]\n[3,5,10,9,4]',         output: '[4,5,5,8,8]'           },
    { input: '1\n[]\n[1,2,3]',                       output: '[1,2,3]'               },
    { input: '1\n[5]\n[3,7,2]',                      output: '[5,7,7]'               },
    { input: '2\n[0]\n[-1,1,-2,2,-3,3]',             output: '[0,1,1,2,2,3]'         },
    { input: '3\n[]\n[1,2,3,4,5]',                   output: '[-2147483648,-2147483648,1,2,3]' },
    { input: '2\n[1,2]\n[3,4,5]',                    output: '[2,3,4]'               },
    { input: '3\n[1,2,3]\n[4,5,6]',                  output: '[3,4,5]'               },
    { input: '1\n[10,9,8]\n[7,11,6]',                output: '[10,11,11]'            },
    { input: '3\n[1,2,3,4,5]\n[6,7,8]',              output: '[5,6,7]'               },
    { input: '2\n[5,5]\n[5,5,5]',                    output: '[5,5,5]'               },
    { input: '4\n[1,2,3,4,5,6]\n[7,0,8]',            output: '[5,5,6]'               },
    { input: '1\n[1]\n[2,3,4,5]',                    output: '[2,3,4,5]'             },
    { input: '3\n[5,4,3,2,1]\n[6,7]',                output: '[5,6]'                 },
    { input: '2\n[10,20,30]\n[15,25,5]',             output: '[20,25,25]'            },
    { input: '3\n[1,1,1]\n[1,1,1]',                  output: '[1,1,1]'               },
    { input: '5\n[1,2,3,4,5,6,7,8,9,10]\n[11,12]',   output: '[7,8]'                 },
    { input: '3\n[2,2,2]\n[3,1,4]',                  output: '[2,2,3]'               },
    { input: '2\n[1]\n[2,3,4,5,6]',                  output: '[1,2,3,4,5]'           },
    { input: '1\n[100,200,300]\n[50,400]',            output: '[300,400]'             },
    { input: '4\n[1,2,3]\n[4,5,6,7]',                output: '[1,2,3,4]'             },
  ],

  // -------------------------------------------------------------------------
  // 141. PATH WITH MINIMUM EFFORT
  // Input:  heights (int[][])
  // Output: minimum effort (int) to travel from top-left to bottom-right
  //         effort = max |diff| of adjacent cells on the chosen path
  // -------------------------------------------------------------------------
  'path-with-minimum-effort': [
    { input: '[[1,2,2],[3,8,2],[5,3,5]]',       output: '2'  },
    { input: '[[1,2,3],[3,8,4],[5,3,5]]',       output: '1'  },
    { input: '[[1,2,1,1,1]]',                   output: '0'  },
    { input: '[[1]]',                           output: '0'  },
    { input: '[[1,2],[3,4]]',                   output: '2'  },
    { input: '[[4,3],[2,1]]',                   output: '2'  },
    { input: '[[1,10,6,7,9,10],[1,1,3,2,2,9],[2,2,3,7,1,9],[1,5,6,1,2,1],[2,7,10,7,2,1],[3,1,1,5,6,9]]',
      output: '4' },
    { input: '[[1,2,3],[4,5,6],[7,8,9]]',       output: '4'  },
    { input: '[[9,8,7],[6,5,4],[3,2,1]]',       output: '4'  },
    { input: '[[1,1,1],[1,1,1],[1,1,1]]',       output: '0'  },
    { input: '[[1,2],[2,1]]',                   output: '1'  },
    { input: '[[1,9],[9,1]]',                   output: '8'  },
    { input: '[[1,1000000000]]',                output: '999999999' },
    { input: '[[1000000000,1000000000],[1000000000,1]]', output: '999999999' },
    { input: '[[1,3],[2,4]]',                   output: '2'  },
    { input: '[[5,5],[5,5]]',                   output: '0'  },
    { input: '[[1,2,3,4,5]]',                   output: '1'  },
    { input: '[[1],[2],[3],[4],[5]]',            output: '1'  },
    { input: '[[1,2],[3,4],[5,6]]',             output: '3'  },
    { input: '[[1,2,2],[1,2,1],[1,1,1]]',       output: '0'  },
    { input: '[[3,4,5],[2,5,3],[1,2,1]]',       output: '1'  },
    { input: '[[1,8,15],[7,2,9],[14,6,10]]',    output: '6'  },
    { input: '[[1,5],[10,6]]',                  output: '4'  },
    { input: '[[3,3,3],[3,3,3],[3,3,3]]',       output: '0'  },
    { input: '[[1,2,3,4],[5,6,7,8],[9,10,11,12]]', output: '4' },
    { input: '[[1,2],[3,4],[7,8],[9,10]]',      output: '4'  },
    { input: '[[1,10],[5,4]]',                  output: '4'  },
    { input: '[[1,2,10],[7,4,3],[5,1,2]]',      output: '3'  },
    { input: '[[1,7,5],[10,2,8],[4,1,3]]',      output: '5'  },
    { input: '[[1,2,3],[4,3,2],[5,4,3]]',       output: '2'  },
  ],

  // -------------------------------------------------------------------------
  // 142. REDUNDANT CONNECTION
  // Input:  edges (int[][]) — undirected graph edges [u, v]
  // Output: the last redundant edge that forms a cycle (int[])
  // -------------------------------------------------------------------------
  'redundant-connection': [
    { input: '[[1,2],[1,3],[2,3]]',                       output: '[2,3]'   },
    { input: '[[1,2],[2,3],[3,4],[1,4],[1,5]]',           output: '[1,4]'   },
    { input: '[[1,2],[2,3],[1,3]]',                       output: '[1,3]'   },
    { input: '[[1,2]]',                                   output: '[1,2]'   },
    { input: '[[1,2],[2,3],[3,1]]',                       output: '[3,1]'   },
    { input: '[[1,2],[2,3],[3,4],[4,5],[5,3]]',           output: '[5,3]'   },
    { input: '[[1,2],[1,3],[1,4],[3,4]]',                 output: '[3,4]'   },
    { input: '[[1,2],[2,3],[3,4],[4,2]]',                 output: '[4,2]'   },
    { input: '[[1,2],[2,3],[3,4],[4,5],[3,5]]',           output: '[3,5]'   },
    { input: '[[1,2],[2,3],[3,4],[4,1]]',                 output: '[4,1]'   },
    { input: '[[3,4],[1,2],[2,4],[3,5],[2,5]]',           output: '[2,5]'   },
    { input: '[[1,2],[1,3],[2,3],[4,5]]',                 output: '[2,3]'   },
    { input: '[[1,2],[3,4],[1,4],[2,3]]',                 output: '[2,3]'   },
    { input: '[[1,2],[2,3],[2,4],[4,5],[5,2]]',           output: '[5,2]'   },
    { input: '[[1,3],[1,2],[2,3]]',                       output: '[2,3]'   },
    { input: '[[1,2],[1,3],[1,4],[1,5],[5,4]]',           output: '[5,4]'   },
    { input: '[[1,2],[3,4],[5,6],[6,7],[1,7],[2,3],[4,5]]', output: '[2,3]' },
    { input: '[[1,2],[2,3],[3,1]]',                       output: '[3,1]'   },
    { input: '[[2,3],[1,2],[1,3]]',                       output: '[1,3]'   },
    { input: '[[1,2],[1,3],[3,4],[4,2]]',                 output: '[4,2]'   },
    { input: '[[1,4],[3,4],[1,3],[1,2],[4,5]]',           output: '[1,3]'   },
    { input: '[[1,2],[3,4],[2,3],[4,1]]',                 output: '[4,1]'   },
    { input: '[[1,5],[3,5],[2,5],[4,5],[3,4]]',           output: '[3,4]'   },
    { input: '[[1,2],[2,3],[3,4],[4,5],[5,1]]',           output: '[5,1]'   },
    { input: '[[1,2],[2,3],[1,4],[4,5],[5,3]]',           output: '[5,3]'   },
    { input: '[[1,2],[3,4],[5,1],[2,5],[4,2]]',           output: '[4,2]'   },
    { input: '[[1,2],[2,4],[4,3],[3,1]]',                 output: '[3,1]'   },
    { input: '[[1,2],[2,5],[5,3],[3,4],[4,2]]',           output: '[4,2]'   },
    { input: '[[1,3],[3,2],[2,1]]',                       output: '[2,1]'   },
    { input: '[[1,2],[2,3],[3,4],[4,5],[5,6],[6,4]]',     output: '[6,4]'   },
  ],

  // -------------------------------------------------------------------------
  // 143. SUBSETS
  // Input:  nums (int[]) — distinct integers
  // Output: all subsets (int[][]) in sorted canonical order
  // -------------------------------------------------------------------------
  'subsets': [
    { input: '[1,2,3]',     output: '[[],[1],[1,2],[1,2,3],[1,3],[2],[2,3],[3]]' },
    { input: '[0]',         output: '[[],[0]]'                                   },
    { input: '[1]',         output: '[[],[1]]'                                   },
    { input: '[1,2]',       output: '[[],[1],[1,2],[2]]'                         },
    { input: '[]',          output: '[[]]'                                       },
    { input: '[1,2,3,4]',   output: '[[],[1],[1,2],[1,2,3],[1,2,3,4],[1,2,4],[1,3],[1,3,4],[1,4],[2],[2,3],[2,3,4],[2,4],[3],[3,4],[4]]' },
    { input: '[0,1,2]',     output: '[[],[0],[0,1],[0,1,2],[0,2],[1],[1,2],[2]]' },
    { input: '[-1,0,1]',    output: '[[-1],[-1,0],[-1,0,1],[-1,1],[],[0],[0,1],[1]]' },
    { input: '[5,3,1]',     output: '[[],[1],[1,3],[1,3,5],[1,5],[3],[3,5],[5]]' },
    { input: '[1,2,3,4,5]', output: '[[],[1],[1,2],[1,2,3],[1,2,3,4],[1,2,3,4,5],[1,2,3,5],[1,2,4],[1,2,4,5],[1,2,5],[1,3],[1,3,4],[1,3,4,5],[1,3,5],[1,4],[1,4,5],[1,5],[2],[2,3],[2,3,4],[2,3,4,5],[2,3,5],[2,4],[2,4,5],[2,5],[3],[3,4],[3,4,5],[3,5],[4],[4,5],[5]]' },
    { input: '[10,20]',     output: '[[],[10],[10,20],[20]]'                     },
    { input: '[-1,2]',      output: '[[-1],[-1,2],[],[2]]'                       },
    { input: '[1,2,3,4,5,6]', output: '[[],[1],[1,2],[1,2,3],[1,2,3,4],[1,2,3,4,5],[1,2,3,4,5,6],[1,2,3,4,6],[1,2,3,5],[1,2,3,5,6],[1,2,3,6],[1,2,4],[1,2,4,5],[1,2,4,5,6],[1,2,4,6],[1,2,5],[1,2,5,6],[1,2,6],[1,3],[1,3,4],[1,3,4,5],[1,3,4,5,6],[1,3,4,6],[1,3,5],[1,3,5,6],[1,3,6],[1,4],[1,4,5],[1,4,5,6],[1,4,6],[1,5],[1,5,6],[1,6],[2],[2,3],[2,3,4],[2,3,4,5],[2,3,4,5,6],[2,3,4,6],[2,3,5],[2,3,5,6],[2,3,6],[2,4],[2,4,5],[2,4,5,6],[2,4,6],[2,5],[2,5,6],[2,6],[3],[3,4],[3,4,5],[3,4,5,6],[3,4,6],[3,5],[3,5,6],[3,6],[4],[4,5],[4,5,6],[4,6],[5],[5,6],[6]]' },
  ],

  // -------------------------------------------------------------------------
  // 144. COMBINATIONS
  // Input:  n (int) \n k (int)
  // Output: all combinations of k numbers from 1..n (int[][]) — sorted
  // -------------------------------------------------------------------------
  'combinations': [
    { input: '4\n2',  output: '[[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]'                },
    { input: '1\n1',  output: '[[1]]'                                                 },
    { input: '2\n1',  output: '[[1],[2]]'                                             },
    { input: '2\n2',  output: '[[1,2]]'                                               },
    { input: '3\n1',  output: '[[1],[2],[3]]'                                         },
    { input: '3\n2',  output: '[[1,2],[1,3],[2,3]]'                                   },
    { input: '3\n3',  output: '[[1,2,3]]'                                             },
    { input: '4\n1',  output: '[[1],[2],[3],[4]]'                                     },
    { input: '4\n3',  output: '[[1,2,3],[1,2,4],[1,3,4],[2,3,4]]'                    },
    { input: '4\n4',  output: '[[1,2,3,4]]'                                           },
    { input: '5\n2',  output: '[[1,2],[1,3],[1,4],[1,5],[2,3],[2,4],[2,5],[3,4],[3,5],[4,5]]' },
    { input: '5\n3',  output: '[[1,2,3],[1,2,4],[1,2,5],[1,3,4],[1,3,5],[1,4,5],[2,3,4],[2,3,5],[2,4,5],[3,4,5]]' },
    { input: '5\n4',  output: '[[1,2,3,4],[1,2,3,5],[1,2,4,5],[1,3,4,5],[2,3,4,5]]' },
    { input: '5\n5',  output: '[[1,2,3,4,5]]'                                         },
    { input: '6\n2',  output: '[[1,2],[1,3],[1,4],[1,5],[1,6],[2,3],[2,4],[2,5],[2,6],[3,4],[3,5],[3,6],[4,5],[4,6],[5,6]]' },
    { input: '6\n4',  output: '[[1,2,3,4],[1,2,3,5],[1,2,3,6],[1,2,4,5],[1,2,4,6],[1,2,5,6],[1,3,4,5],[1,3,4,6],[1,3,5,6],[1,4,5,6],[2,3,4,5],[2,3,4,6],[2,3,5,6],[2,4,5,6],[3,4,5,6]]' },
    { input: '7\n3',  output: '[[1,2,3],[1,2,4],[1,2,5],[1,2,6],[1,2,7],[1,3,4],[1,3,5],[1,3,6],[1,3,7],[1,4,5],[1,4,6],[1,4,7],[1,5,6],[1,5,7],[1,6,7],[2,3,4],[2,3,5],[2,3,6],[2,3,7],[2,4,5],[2,4,6],[2,4,7],[2,5,6],[2,5,7],[2,6,7],[3,4,5],[3,4,6],[3,4,7],[3,5,6],[3,5,7],[3,6,7],[4,5,6],[4,5,7],[4,6,7],[5,6,7]]' },
    { input: '4\n0',  output: '[[]]'                                                  },
    { input: '0\n0',  output: '[[]]'                                                  },
    { input: '5\n1',  output: '[[1],[2],[3],[4],[5]]'                                 },
  ],

  // -------------------------------------------------------------------------
  // 145. PERMUTATIONS
  // Input:  nums (int[]) — distinct integers
  // Output: all permutations (int[][]) — sorted lexicographically
  // -------------------------------------------------------------------------
  'permutations': [
    { input: '[1,2,3]',   output: '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]'    },
    { input: '[0,1]',     output: '[[0,1],[1,0]]'                                          },
    { input: '[1]',       output: '[[1]]'                                                  },
    { input: '[1,2]',     output: '[[1,2],[2,1]]'                                          },
    { input: '[2,1]',     output: '[[1,2],[2,1]]'                                          },
    { input: '[3,2,1]',   output: '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]'    },
    { input: '[1,2,3,4]', output: '[[1,2,3,4],[1,2,4,3],[1,3,2,4],[1,3,4,2],[1,4,2,3],[1,4,3,2],[2,1,3,4],[2,1,4,3],[2,3,1,4],[2,3,4,1],[2,4,1,3],[2,4,3,1],[3,1,2,4],[3,1,4,2],[3,2,1,4],[3,2,4,1],[3,4,1,2],[3,4,2,1],[4,1,2,3],[4,1,3,2],[4,2,1,3],[4,2,3,1],[4,3,1,2],[4,3,2,1]]' },
    { input: '[0,1,2]',   output: '[[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]]'    },
    { input: '[-1,0,1]',  output: '[[-1,0,1],[-1,1,0],[0,-1,1],[0,1,-1],[1,-1,0],[1,0,-1]]' },
    { input: '[0]',       output: '[[0]]'                                                  },
    { input: '[-1,1]',    output: '[[-1,1],[1,-1]]'                                        },
    { input: '[1,3,2]',   output: '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]'    },
    { input: '[5,4,3,2,1]', output: '[[1,2,3,4,5],[1,2,3,5,4],[1,2,4,3,5],[1,2,4,5,3],[1,2,5,3,4],[1,2,5,4,3],[1,3,2,4,5],[1,3,2,5,4],[1,3,4,2,5],[1,3,4,5,2],[1,3,5,2,4],[1,3,5,4,2],[1,4,2,3,5],[1,4,2,5,3],[1,4,3,2,5],[1,4,3,5,2],[1,4,5,2,3],[1,4,5,3,2],[1,5,2,3,4],[1,5,2,4,3],[1,5,3,2,4],[1,5,3,4,2],[1,5,4,2,3],[1,5,4,3,2],[2,1,3,4,5],[2,1,3,5,4],[2,1,4,3,5],[2,1,4,5,3],[2,1,5,3,4],[2,1,5,4,3],[2,3,1,4,5],[2,3,1,5,4],[2,3,4,1,5],[2,3,4,5,1],[2,3,5,1,4],[2,3,5,4,1],[2,4,1,3,5],[2,4,1,5,3],[2,4,3,1,5],[2,4,3,5,1],[2,4,5,1,3],[2,4,5,3,1],[2,5,1,3,4],[2,5,1,4,3],[2,5,3,1,4],[2,5,3,4,1],[2,5,4,1,3],[2,5,4,3,1],[3,1,2,4,5],[3,1,2,5,4],[3,1,4,2,5],[3,1,4,5,2],[3,1,5,2,4],[3,1,5,4,2],[3,2,1,4,5],[3,2,1,5,4],[3,2,4,1,5],[3,2,4,5,1],[3,2,5,1,4],[3,2,5,4,1],[3,4,1,2,5],[3,4,1,5,2],[3,4,2,1,5],[3,4,2,5,1],[3,4,5,1,2],[3,4,5,2,1],[3,5,1,2,4],[3,5,1,4,2],[3,5,2,1,4],[3,5,2,4,1],[3,5,4,1,2],[3,5,4,2,1],[4,1,2,3,5],[4,1,2,5,3],[4,1,3,2,5],[4,1,3,5,2],[4,1,5,2,3],[4,1,5,3,2],[4,2,1,3,5],[4,2,1,5,3],[4,2,3,1,5],[4,2,3,5,1],[4,2,5,1,3],[4,2,5,3,1],[4,3,1,2,5],[4,3,1,5,2],[4,3,2,1,5],[4,3,2,5,1],[4,3,5,1,2],[4,3,5,2,1],[4,5,1,2,3],[4,5,1,3,2],[4,5,2,1,3],[4,5,2,3,1],[4,5,3,1,2],[4,5,3,2,1],[5,1,2,3,4],[5,1,2,4,3],[5,1,3,2,4],[5,1,3,4,2],[5,1,4,2,3],[5,1,4,3,2],[5,2,1,3,4],[5,2,1,4,3],[5,2,3,1,4],[5,2,3,4,1],[5,2,4,1,3],[5,2,4,3,1],[5,3,1,2,4],[5,3,1,4,2],[5,3,2,1,4],[5,3,2,4,1],[5,3,4,1,2],[5,3,4,2,1],[5,4,1,2,3],[5,4,1,3,2],[5,4,2,1,3],[5,4,2,3,1],[5,4,3,1,2],[5,4,3,2,1]]' },
    { input: '[10,20]',   output: '[[10,20],[20,10]]'                                      },
    { input: '[3,1]',     output: '[[1,3],[3,1]]'                                          },
    { input: '[4,3,2]',   output: '[[2,3,4],[2,4,3],[3,2,4],[3,4,2],[4,2,3],[4,3,2]]'    },
  ],

  // -------------------------------------------------------------------------
  // 146. SUBSETS II
  // Input:  nums (int[]) — may contain duplicates
  // Output: unique subsets (int[][]) — sorted canonical order
  // -------------------------------------------------------------------------
  'subsets-ii': [
    { input: '[1,2,2]',     output: '[[],[1],[1,2],[1,2,2],[2],[2,2]]'                   },
    { input: '[0]',         output: '[[],[0]]'                                            },
    { input: '[1,1]',       output: '[[],[1],[1,1]]'                                      },
    { input: '[1,2,3]',     output: '[[],[1],[1,2],[1,2,3],[1,3],[2],[2,3],[3]]'          },
    { input: '[1,1,2]',     output: '[[],[1],[1,1],[1,1,2],[1,2],[2]]'                    },
    { input: '[2,1,2]',     output: '[[],[1],[1,2],[1,2,2],[2],[2,2]]'                    },
    { input: '[1,2,2,3]',   output: '[[],[1],[1,2],[1,2,2],[1,2,2,3],[1,2,3],[1,3],[2],[2,2],[2,2,3],[2,3],[3]]' },
    { input: '[1,1,1]',     output: '[[],[1],[1,1],[1,1,1]]'                              },
    { input: '[4,4,4,1,4]', output: '[[],[1],[1,4],[1,4,4],[1,4,4,4],[1,4,4,4,4],[4],[4,4],[4,4,4],[4,4,4,4]]' },
    { input: '[0,0]',       output: '[[],[0],[0,0]]'                                      },
    { input: '[1,2,3,2]',   output: '[[],[1],[1,2],[1,2,2],[1,2,2,3],[1,2,3],[1,3],[2],[2,2],[2,2,3],[2,3],[3]]' },
    { input: '[3,3,3]',     output: '[[],[3],[3,3],[3,3,3]]'                              },
    { input: '[1,2,3,3]',   output: '[[],[1],[1,2],[1,2,3],[1,2,3,3],[1,3],[1,3,3],[2],[2,3],[2,3,3],[3],[3,3]]' },
    { input: '[2,2]',       output: '[[],[2],[2,2]]'                                      },
    { input: '[1,1,2,2]',   output: '[[],[1],[1,1],[1,1,2],[1,1,2,2],[1,2],[1,2,2],[2],[2,2]]' },
    { input: '[5]',         output: '[[],[5]]'                                            },
    { input: '[1,2,1]',     output: '[[],[1],[1,1],[1,1,2],[1,2],[2]]'                    },
    { input: '[-1,-1,0]',   output: '[[-1],[-1,-1],[-1,-1,0],[-1,0],[],[0]]'             },
    { input: '[0,1,0]',     output: '[[],[0],[0,0],[0,0,1],[0,1],[1]]'                    },
    { input: '[1,1,1,2,2]', output: '[[],[1],[1,1],[1,1,1],[1,1,1,2],[1,1,1,2,2],[1,1,2],[1,1,2,2],[1,2],[1,2,2],[2],[2,2]]' },
  ],

  // -------------------------------------------------------------------------
  // 147. COMBINATION SUM III
  // Input:  k (int) \n n (int)
  // Output: all valid combinations of k distinct digits (1–9) that sum to n
  // -------------------------------------------------------------------------
  'combination-sum-iii': [
    { input: '3\n7',  output: '[[1,2,4]]'                                        },
    { input: '3\n9',  output: '[[1,2,6],[1,3,5],[2,3,4]]'                        },
    { input: '4\n1',  output: '[]'                                                },
    { input: '1\n1',  output: '[[1]]'                                             },
    { input: '1\n9',  output: '[[9]]'                                             },
    { input: '2\n3',  output: '[[1,2]]'                                           },
    { input: '2\n5',  output: '[[1,4],[2,3]]'                                     },
    { input: '2\n9',  output: '[[1,8],[2,7],[3,6],[4,5]]'                         },
    { input: '3\n15', output: '[[1,5,9],[1,6,8],[2,4,9],[2,5,8],[2,6,7],[3,4,8],[3,5,7],[4,5,6]]' },
    { input: '3\n6',  output: '[[1,2,3]]'                                         },
    { input: '4\n10', output: '[[1,2,3,4]]'                                       },
    { input: '4\n14', output: '[[1,2,3,8],[1,2,4,7],[1,2,5,6],[1,3,4,6],[2,3,4,5]]' },
    { input: '2\n17', output: '[[8,9]]'                                           },
    { input: '2\n18', output: '[]'                                                },
    { input: '1\n10', output: '[]'                                                },
    { input: '9\n45', output: '[[1,2,3,4,5,6,7,8,9]]'                            },
    { input: '9\n44', output: '[]'                                                },
    { input: '2\n10', output: '[[1,9],[2,8],[3,7],[4,6]]'                         },
    { input: '3\n10', output: '[[1,2,7],[1,3,6],[1,4,5],[2,3,5]]'                 },
    { input: '3\n24', output: '[[7,8,9]]'                                         },
    { input: '3\n25', output: '[]'                                                },
    { input: '4\n24', output: '[[3,6,7,8],[4,5,7,8],[4,6,5,9],[3,7,5,9],[2,7,6,9],[1,7,8,8]]' },
    { input: '5\n15', output: '[[1,2,3,4,5]]'                                     },
    { input: '2\n11', output: '[[2,9],[3,8],[4,7],[5,6]]'                         },
    { input: '1\n5',  output: '[[5]]'                                             },
    { input: '2\n4',  output: '[[1,3]]'                                           },
    { input: '3\n27', output: '[]'                                                },
    { input: '4\n20', output: '[[1,4,6,9],[1,4,7,8],[1,5,6,8],[2,3,6,9],[2,3,7,8],[2,4,5,9],[2,4,6,8],[2,5,6,7],[3,4,5,8],[3,4,6,7],[3,5,6,6],[1,3,7,9],[1,5,5,9],[1,6,4,9],[2,4,5,9],[3,4,4,9],[1,2,8,9]]' },
    { input: '2\n6',  output: '[[1,5],[2,4]]'                                     },
    { input: '2\n7',  output: '[[1,6],[2,5],[3,4]]'                               },
  ],

  // -------------------------------------------------------------------------
  // 148. LETTER COMBINATIONS OF A PHONE NUMBER
  // Input:  digits (string)
  // Output: all possible letter combinations (string[]) — sorted
  // -------------------------------------------------------------------------
  'letter-combinations-of-a-phone-number': [
    { input: '"23"',  output: '["ad","ae","af","bd","be","bf","cd","ce","cf"]'     },
    { input: '""',    output: '[]'                                                  },
    { input: '"2"',   output: '["a","b","c"]'                                      },
    { input: '"3"',   output: '["d","e","f"]'                                      },
    { input: '"4"',   output: '["g","h","i"]'                                      },
    { input: '"5"',   output: '["j","k","l"]'                                      },
    { input: '"6"',   output: '["m","n","o"]'                                      },
    { input: '"7"',   output: '["p","q","r","s"]'                                  },
    { input: '"8"',   output: '["t","u","v"]'                                      },
    { input: '"9"',   output: '["w","x","y","z"]'                                  },
    { input: '"22"',  output: '["aa","ab","ac","ba","bb","bc","ca","cb","cc"]'     },
    { input: '"234"', output: '["adg","adh","adi","aeg","aeh","aei","afg","afh","afi","bdg","bdh","bdi","beg","beh","bei","bfg","bfh","bfi","cdg","cdh","cdi","ceg","ceh","cei","cfg","cfh","cfi"]' },
    { input: '"79"',  output: '["pw","px","py","pz","qw","qx","qy","qz","rw","rx","ry","rz","sw","sx","sy","sz"]' },
    { input: '"2345"', output: '["adgj","adgk","adgl","adgm","adgn","adgo","adhj","adhk","adhl","adhm","adhn","adho","adij","adik","adil","adim","adin","adio","aegj","aegk","aegl","aegm","aegn","aego","aehj","aehk","aehl","aehm","aehn","aeho","aeij","aeik","aeil","aeim","aein","aeio","afgo","afgn","afgm","afgl","afgk","afgj","afhj","afhk","afhl","afhm","afhn","afho","afij","afik","afil","afim","afin","afio","bdgj","bdgk","bdgl","bdgm","bdgn","bdgo","bdhj","bdhk","bdhl","bdhm","bdhn","bdho","bdij","bdik","bdil","bdim","bdin","bdio","begj","begk","begl","begm","begn","bego","behj","behk","behl","behm","behn","beho","beij","beik","beil","beim","bein","beio","bfgj","bfgk","bfgl","bfgm","bfgn","bfgo","bfhj","bfhk","bfhl","bfhm","bfhn","bfho","bfij","bfik","bfil","bfim","bfin","bfio","cdgj","cdgk","cdgl","cdgm","cdgn","cdgo","cdhj","cdhk","cdhl","cdhm","cdhn","cdho","cdij","cdik","cdil","cdim","cdin","cdio","cegj","cegk","cegl","cegm","cegn","cego","cehj","cehk","cehl","cehm","cehn","ceho","ceij","ceik","ceil","ceim","cein","ceio","cfgj","cfgk","cfgl","cfgm","cfgn","cfgo","cfhj","cfhk","cfhl","cfhm","cfhn","cfho","cfij","cfik","cfil","cfim","cfin","cfio"]' },
    { input: '"29"',  output: '["aw","ax","ay","az","bw","bx","by","bz","cw","cx","cy","cz"]' },
    { input: '"72"',  output: '["pa","pb","pc","qa","qb","qc","ra","rb","rc","sa","sb","sc"]' },
    { input: '"93"',  output: '["wd","we","wf","xd","xe","xf","yd","ye","yf","zd","ze","zf"]' },
    { input: '"77"',  output: '["pp","pq","pr","ps","qp","qq","qr","qs","rp","rq","rr","rs","sp","sq","sr","ss"]' },
    { input: '"99"',  output: '["ww","wx","wy","wz","xw","xx","xy","xz","yw","yx","yy","yz","zw","zx","zy","zz"]' },
    { input: '"28"',  output: '["at","au","av","bt","bu","bv","ct","cu","cv"]'    },
    { input: '"82"',  output: '["ta","tb","tc","ua","ub","uc","va","vb","vc"]'    },
    { input: '"26"',  output: '["am","an","ao","bm","bn","bo","cm","cn","co"]'    },
    { input: '"62"',  output: '["ma","mb","mc","na","nb","nc","oa","ob","oc"]'    },
    { input: '"32"',  output: '["da","db","dc","ea","eb","ec","fa","fb","fc"]'    },
  ],

  // -------------------------------------------------------------------------
  // 149. WORD SEARCH
  // Input:  board (char[][]) \n word (string)
  // Output: "true" / "false"
  // -------------------------------------------------------------------------
  'word-search': [
    { input: '[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]\n"ABCCED"',   output: 'true'  },
    { input: '[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]\n"SEE"',      output: 'true'  },
    { input: '[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]\n"ABCB"',     output: 'false' },
    { input: '[["a"]]\n"a"',                                                        output: 'true'  },
    { input: '[["a"]]\n"b"',                                                        output: 'false' },
    { input: '[["a","b"],["c","d"]]\n"abdc"',                                       output: 'true'  },
    { input: '[["a","b"],["c","d"]]\n"abcd"',                                       output: 'false' },
    { input: '[["A","B","C","E"],["S","F","E","S"],["A","D","E","E"]]\n"ABCESEEEFS"', output: 'false' },
    { input: '[["A","B","C","E"],["S","F","E","S"],["A","D","E","E"]]\n"ABCEFSADEE"', output: 'false' },
    { input: '[["C","A","A"],["A","A","A"],["B","C","D"]]\n"AAB"',                  output: 'true'  },
    { input: '[["A","A","A","A","A","A"],["A","A","A","A","A","A"],["A","A","A","A","A","A"],["A","A","A","A","A","A"],["A","A","A","A","A","B"]]\n"AAAAAAAAAAAAAAAAAAAAAAAAAA"', output: 'false' },
    { input: '[["a","b","c"],["d","e","f"],["g","h","i"]]\n"aei"',                  output: 'false' },
    { input: '[["a","b","c"],["d","e","f"],["g","h","i"]]\n"abc"',                  output: 'true'  },
    { input: '[["a","b","c"],["d","e","f"],["g","h","i"]]\n"cfi"',                  output: 'true'  },
    { input: '[["a","b","c"],["d","e","f"],["g","h","i"]]\n"ghi"',                  output: 'true'  },
    { input: '[["a","b","c"],["d","e","f"],["g","h","i"]]\n"adg"',                  output: 'true'  },
    { input: '[["a","b","c"],["d","e","f"],["g","h","i"]]\n"abc"',                  output: 'true'  },
    { input: '[["a","b"],["c","d"]]\n"acdb"',                                       output: 'true'  },
    { input: '[["a","b"],["c","d"]]\n"dabc"',                                       output: 'false' },
    { input: '[["a","b"],["c","d"]]\n"dcba"',                                       output: 'false' },
    { input: '[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]\n"ASFO"',     output: 'false' },
    { input: '[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]\n"ASD"',      output: 'false' },
    { input: '[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]\n"SFB"',      output: 'true'  },
    { input: '[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]\n"SFCS"',     output: 'true'  },
    { input: '[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]]\n"ADES"',     output: 'false' },
    { input: '[["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]]\n"eat"', output: 'true' },
    { input: '[["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]]\n"oath"', output: 'true' },
    { input: '[["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]]\n"pea"', output: 'false' },
    { input: '[["a","a"]]\n"aaa"',                                                  output: 'false' },
    { input: '[["a","b","c"],["d","e","f"],["g","h","i"]]\n"ih"',                   output: 'true'  },
  ],

  // -------------------------------------------------------------------------
  // 150. PALINDROME PARTITIONING
  // Input:  s (string)
  // Output: all palindrome partitions (string[][]) — sorted
  // -------------------------------------------------------------------------
  'palindrome-partitioning': [
    { input: '"aab"',   output: '[["a","a","b"],["aa","b"]]'                     },
    { input: '"a"',     output: '[["a"]]'                                         },
    { input: '"ab"',    output: '[["a","b"]]'                                     },
    { input: '"aa"',    output: '[["a","a"],["aa"]]'                              },
    { input: '"aaa"',   output: '[["a","a","a"],["a","aa"],["aa","a"],["aaa"]]'   },
    { input: '"abc"',   output: '[["a","b","c"]]'                                 },
    { input: '"aba"',   output: '[["a","b","a"],["aba"]]'                         },
    { input: '"abba"',  output: '[["a","b","b","a"],["a","bb","a"],["abba"]]'     },
    { input: '"abcba"', output: '[["a","b","c","b","a"],["a","bcb","a"],["a","b","c","b","a"],["abcba"]]' },
    { input: '"racecar"', output: '[["r","a","c","e","c","a","r"],["r","a","cec","a","r"],["r","aceca","r"],["racecar"]]' },
    { input: '"aabb"',  output: '[["a","a","b","b"],["a","a","bb"],["aa","b","b"],["aa","bb"]]' },
    { input: '"aaaa"',  output: '[["a","a","a","a"],["a","a","aa"],["a","aa","a"],["a","aaa"],["aa","a","a"],["aa","aa"],["aaa","a"],["aaaa"]]' },
    { input: '"abcd"',  output: '[["a","b","c","d"]]'                             },
    { input: '"abb"',   output: '[["a","b","b"],["a","bb"]]'                      },
    { input: '"aab"',   output: '[["a","a","b"],["aa","b"]]'                      },
    { input: '"cdd"',   output: '[["c","d","d"],["c","dd"]]'                      },
    { input: '"cab"',   output: '[["c","a","b"]]'                                 },
    { input: '"cbbd"',  output: '[["c","b","b","d"],["c","bb","d"]]'              },
    { input: '"xyx"',   output: '[["x","y","x"],["xyx"]]'                         },
    { input: '"kayak"', output: '[["k","a","y","a","k"],["k","aya","k"],["kayak"]]' },
  ],

  // -------------------------------------------------------------------------
  // 151. N-QUEENS
  // Input:  n (int)
  // Output: number of distinct solutions (int)
  // -------------------------------------------------------------------------
  'n-queens': [
    { input: '1',  output: '1'  },
    { input: '2',  output: '0'  },
    { input: '3',  output: '0'  },
    { input: '4',  output: '2'  },
    { input: '5',  output: '10' },
    { input: '6',  output: '4'  },
    { input: '7',  output: '40' },
    { input: '8',  output: '92' },
    { input: '9',  output: '352'},
  ],

  // -------------------------------------------------------------------------
  // 152. TARGET SUM
  // Input:  nums (int[]) \n target (int)
  // Output: number of ways to assign +/- to sum to target (int)
  // -------------------------------------------------------------------------
  'target-sum': [
    { input: '[1,1,1,1,1]\n3',   output: '5'  },
    { input: '[1]\n1',           output: '1'  },
    { input: '[1]\n2',           output: '0'  },
    { input: '[1]\n-1',          output: '1'  },
    { input: '[1,0]\n1',         output: '2'  },
    { input: '[0,0,0,0,0]\n0',   output: '32' },
    { input: '[1,2,3,4,5]\n3',   output: '3'  },
    { input: '[2,2,2]\n2',       output: '3'  },
    { input: '[1,1]\n0',         output: '2'  },
    { input: '[1,1]\n2',         output: '1'  },
    { input: '[1,1]\n-2',        output: '1'  },
    { input: '[1,2]\n1',         output: '2'  },
    { input: '[1,2]\n3',         output: '1'  },
    { input: '[1,2]\n-3',        output: '1'  },
    { input: '[1,2,1]\n0',       output: '2'  },
    { input: '[1,2,1]\n2',       output: '3'  },
    { input: '[2,107,109]\n0',   output: '0'  },
    { input: '[0]\n0',           output: '2'  },
    { input: '[0,0]\n0',         output: '4'  },
    { input: '[4,1,2,3,4,5]\n4', output: '4'  },
    { input: '[100]\n-200',      output: '0'  },
    { input: '[1,2,3]\n6',       output: '1'  },
    { input: '[1,2,3]\n-6',      output: '1'  },
    { input: '[1,2,3]\n0',       output: '2'  },
    { input: '[3,3]\n0',         output: '2'  },
    { input: '[3,3]\n6',         output: '1'  },
    { input: '[3,3]\n-6',        output: '1'  },
    { input: '[1,1,1,1]\n0',     output: '6'  },
    { input: '[1,1,1,1]\n2',     output: '4'  },
    { input: '[1,1,1,1]\n4',     output: '1'  },
  ],

  // -------------------------------------------------------------------------
  // 153. INTERLEAVING STRING
  // Input:  s1 (string) \n s2 (string) \n s3 (string)
  // Output: "true" / "false"
  // -------------------------------------------------------------------------
  'interleaving-string': [
    { input: '"aabcc"\n"dbbca"\n"aadbbcbcac"', output: 'true'  },
    { input: '"aabcc"\n"dbbca"\n"aadbbbaccc"', output: 'false' },
    { input: '""\n""\n""',                     output: 'true'  },
    { input: '""\n"b"\n"b"',                   output: 'true'  },
    { input: '"a"\n""\n"a"',                   output: 'true'  },
    { input: '"a"\n"b"\n"ab"',                 output: 'true'  },
    { input: '"a"\n"b"\n"ba"',                 output: 'true'  },
    { input: '"a"\n"b"\n"aa"',                 output: 'false' },
    { input: '"ab"\n"cd"\n"acbd"',             output: 'true'  },
    { input: '"ab"\n"cd"\n"abcd"',             output: 'true'  },
    { input: '"ab"\n"cd"\n"cdab"',             output: 'true'  },
    { input: '"ab"\n"cd"\n"adbc"',             output: 'false' },
    { input: '"abc"\n"def"\n"adbecf"',         output: 'true'  },
    { input: '"abc"\n"def"\n"abdecf"',         output: 'true'  },
    { input: '"abc"\n"def"\n"abcdef"',         output: 'true'  },
    { input: '"abc"\n"def"\n"defabc"',         output: 'true'  },
    { input: '"abc"\n"def"\n"abcefg"',         output: 'false' },
    { input: '"aa"\n"ab"\n"aaba"',             output: 'true'  },
    { input: '"aa"\n"ab"\n"aaab"',             output: 'true'  },
    { input: '"aa"\n"ab"\n"abaa"',             output: 'true'  },
    { input: '"a"\n"b"\n"c"',                  output: 'false' },
    { input: '""\n"abc"\n"abc"',               output: 'true'  },
    { input: '"abc"\n""\n"abc"',               output: 'true'  },
    { input: '"abc"\n""\n"abx"',               output: 'false' },
    { input: '"ab"\n"bc"\n"aabb"',             output: 'false' },
    { input: '"ab"\n"bc"\n"abbc"',             output: 'true'  },
    { input: '"ab"\n"bc"\n"abcb"',             output: 'false' },
    { input: '"ab"\n"bc"\n"babc"',             output: 'true'  },
    { input: '"aaa"\n"aaa"\n"aaaaaa"',         output: 'true'  },
    { input: '"aaa"\n"bbb"\n"ababab"',         output: 'false' },
    { input: '"aaa"\n"bbb"\n"aaabbb"',         output: 'true'  },
    { input: '"aaa"\n"bbb"\n"bbbaaa"',         output: 'true'  },
    { input: '"db"\n"b"\n"cbb"',               output: 'false' },
    { input: '"db"\n"b"\n"dbb"',               output: 'true'  },
    { input: '"abc"\n"bcd"\n"abcbcd"',         output: 'true'  },
    { input: '"abc"\n"bcd"\n"abbccd"',         output: 'false' },
  ],

  // -------------------------------------------------------------------------
  // 154. COIN CHANGE II
  // Input:  amount (int) \n coins (int[])
  // Output: number of combinations to make up amount (int)
  // -------------------------------------------------------------------------
  'coin-change-ii': [
    { input: '5\n[1,2,5]',       output: '4'   },
    { input: '3\n[2]',           output: '0'   },
    { input: '10\n[10]',         output: '1'   },
    { input: '0\n[1,2,5]',       output: '1'   },
    { input: '1\n[1]',           output: '1'   },
    { input: '2\n[1,2]',         output: '2'   },
    { input: '3\n[1,2]',         output: '2'   },
    { input: '4\n[1,2,3]',       output: '4'   },
    { input: '10\n[1,5,10]',     output: '4'   },
    { input: '7\n[1,2,3]',       output: '8'   },
    { input: '100\n[1,2,5]',     output: '541' },
    { input: '500\n[1,2,5]',     output: '12701'},
    { input: '10\n[2,5,3,6]',    output: '5'   },
    { input: '3\n[1,2,3]',       output: '3'   },
    { input: '5\n[5]',           output: '1'   },
    { input: '5\n[3]',           output: '0'   },
    { input: '1\n[2]',           output: '0'   },
    { input: '2\n[2]',           output: '1'   },
    { input: '4\n[1,2]',         output: '3'   },
    { input: '5\n[1,2,3]',       output: '5'   },
    { input: '6\n[1,2,3]',       output: '7'   },
    { input: '6\n[1,3,4,5]',     output: '6'   },
    { input: '10\n[1,2,3,4,5]',  output: '30'  },
    { input: '50\n[1,2,5,10,20,50]', output: '1255' },
    { input: '100\n[10]',        output: '1'   },
    { input: '100\n[7]',         output: '0'   },
    { input: '3\n[1,2,3]',       output: '3'   },
    { input: '12\n[1,2,5]',      output: '13'  },
    { input: '0\n[7]',           output: '1'   },
    { input: '8\n[1,2,5]',       output: '6'   },
  ],

  // -------------------------------------------------------------------------
  // 155. DECODE WAYS
  // Input:  s (string)
  // Output: number of ways to decode (int)
  // -------------------------------------------------------------------------
  'decode-ways': [
    { input: '"12"',        output: '2'  },
    { input: '"226"',       output: '3'  },
    { input: '"06"',        output: '0'  },
    { input: '"0"',         output: '0'  },
    { input: '"1"',         output: '1'  },
    { input: '"9"',         output: '1'  },
    { input: '"10"',        output: '1'  },
    { input: '"20"',        output: '1'  },
    { input: '"30"',        output: '0'  },
    { input: '"100"',       output: '0'  },
    { input: '"110"',       output: '1'  },
    { input: '"11"',        output: '2'  },
    { input: '"101"',       output: '1'  },
    { input: '"111"',       output: '3'  },
    { input: '"1111"',      output: '5'  },
    { input: '"11111"',     output: '8'  },
    { input: '"27"',        output: '1'  },
    { input: '"2101"',      output: '1'  },
    { input: '"1201234"',   output: '3'  },
    { input: '"230"',       output: '0'  },
    { input: '"301"',       output: '0'  },
    { input: '"1010"',      output: '1'  },
    { input: '"2020"',      output: '1'  },
    { input: '"1212"',      output: '5'  },
    { input: '"121"',       output: '3'  },
    { input: '"1221"',      output: '4'  },
    { input: '"26"',        output: '2'  },
    { input: '"19"',        output: '2'  },
    { input: '"221"',       output: '3'  },
    { input: '"2611055971756562"', output: '4' },
    { input: '"1111111111"', output: '89' },
    { input: '"12121212"',  output: '21' },
    { input: '"1"',         output: '1'  },
    { input: '"11"',        output: '2'  },
    { input: '"111"',       output: '3'  },
    { input: '"1111"',      output: '5'  },
  ],

  // -------------------------------------------------------------------------
  // 156. LONGEST COMMON SUBSEQUENCE
  // Input:  text1 (string) \n text2 (string)
  // Output: LCS length (int)
  // -------------------------------------------------------------------------
  'longest-common-subsequence': [
    { input: '"abcde"\n"ace"',        output: '3' },
    { input: '"abc"\n"abc"',          output: '3' },
    { input: '"abc"\n"def"',          output: '0' },
    { input: '"a"\n"a"',              output: '1' },
    { input: '"a"\n"b"',              output: '0' },
    { input: '""\n""',                output: '0' },
    { input: '""\n"abc"',             output: '0' },
    { input: '"abc"\n""',             output: '0' },
    { input: '"abcd"\n"acbd"',        output: '3' },
    { input: '"abcdgh"\n"aedfhr"',    output: '3' },
    { input: '"aggtab"\n"gxtxayb"',   output: '4' },
    { input: '"bsbininm"\n"jmjkbskib"', output: '4' },
    { input: '"oxcpqrsvwf"\n"shmtulqrypy"', output: '2' },
    { input: '"abc"\n"a"',            output: '1' },
    { input: '"abc"\n"ab"',           output: '2' },
    { input: '"abc"\n"bc"',           output: '2' },
    { input: '"abc"\n"c"',            output: '1' },
    { input: '"aa"\n"aa"',            output: '2' },
    { input: '"aa"\n"a"',             output: '1' },
    { input: '"abc"\n"cba"',          output: '1' },
    { input: '"mhunter"\n"mhunter"',  output: '7' },
    { input: '"aab"\n"azb"',          output: '2' },
    { input: '"abcba"\n"abcbcba"',    output: '5' },
    { input: '"ylqpejqbalahwr"\n"yrkzavgdmdgtqpg"', output: '3' },
    { input: '"pmjghexybyrgzczy"\n"hafcdqbgncrcbihkd"', output: '4' },
    { input: '"abc"\n"abc"',          output: '3' },
    { input: '"ABCBDAB"\n"BDCABA"',   output: '4' },
    { input: '"AGGTAB"\n"GXTXAYB"',   output: '4' },
    { input: '"AGTGATG"\n"GTTAG"',    output: '4' },
    { input: '"abcde"\n"eba"',        output: '2' },
  ],

  // -------------------------------------------------------------------------
  // 157. BEST TIME TO BUY AND SELL STOCK WITH COOLDOWN
  // Input:  prices (int[])
  // Output: maximum profit (int)
  // -------------------------------------------------------------------------
  'best-time-to-buy-and-sell-stock-with-cooldown': [
    { input: '[1,2,3,0,2]',         output: '3' },
    { input: '[1]',                  output: '0' },
    { input: '[1,2]',                output: '1' },
    { input: '[2,1]',                output: '0' },
    { input: '[1,2,3]',              output: '2' },
    { input: '[3,2,1]',              output: '0' },
    { input: '[1,2,3,4,5]',         output: '4' },
    { input: '[5,4,3,2,1]',         output: '0' },
    { input: '[6,1,3,2,4,7]',       output: '6' },
    { input: '[1,4,2]',              output: '3' },
    { input: '[2,7,1,9]',            output: '8' },
    { input: '[3,3]',                output: '0' },
    { input: '[1,3,1,3,1,3]',       output: '4' },
    { input: '[1,2,3,0,2,1,3]',     output: '5' },
    { input: '[1,2,4,2,5,7,2,4,9,0]', output: '13' },
    { input: '[1,3,2]',              output: '2' },
    { input: '[2,3,4,5,1,2]',       output: '3' },
    { input: '[1,2,3,4,5,1,2,3,4,5]', output: '8' },
    { input: '[5,1,5,1,5]',         output: '8' },
    { input: '[10,20,30,10,40]',    output: '40'},
    { input: '[1,8,3]',              output: '7' },
    { input: '[1,4,2,7]',            output: '6' },
    { input: '[1,4,2,7,1,9]',       output: '12'},
    { input: '[4,9,0,4,10]',        output: '14'},
    { input: '[1,2,4]',              output: '3' },
    { input: '[4,2,4]',              output: '2' },
    { input: '[1,2,3,0,2]',         output: '3' },
    { input: '[5,3,7,1,8]',         output: '7' },
    { input: '[1,3,4,0,1,3]',       output: '5' },
    { input: '[1,2,3,1,2,3,1,2,3]', output: '5' },
  ],

  // -------------------------------------------------------------------------
  // 158. MAXIMUM PRODUCT SUBARRAY
  // Input:  nums (int[])
  // Output: maximum product of any contiguous subarray (int)
  // -------------------------------------------------------------------------
  'maximum-product-subarray': [
    { input: '[2,3,-2,4]',           output: '6'   },
    { input: '[-2,0,-1]',            output: '0'   },
    { input: '[-2]',                 output: '-2'  },
    { input: '[0]',                  output: '0'   },
    { input: '[1]',                  output: '1'   },
    { input: '[2]',                  output: '2'   },
    { input: '[-1,-2,-3]',           output: '6'   },
    { input: '[-1,-2,-3,-4]',        output: '24'  },
    { input: '[2,3,4]',              output: '24'  },
    { input: '[0,2]',                output: '2'   },
    { input: '[3,-1,4]',             output: '4'   },
    { input: '[2,-1,1,1]',           output: '2'   },
    { input: '[1,-2,3,-4]',          output: '24'  },
    { input: '[2,3,-2,4,-1]',        output: '48'  },
    { input: '[-2,3,-4]',            output: '24'  },
    { input: '[-1,0,-2]',            output: '0'   },
    { input: '[1,0,1]',              output: '1'   },
    { input: '[-1,-1]',              output: '1'   },
    { input: '[-1,-1,-1]',           output: '1'   },
    { input: '[5,-5,5]',             output: '5'   },
    { input: '[1,-1,1,-1]',          output: '1'   },
    { input: '[2,-1,-2]',            output: '4'   },
    { input: '[5,0,5]',              output: '5'   },
    { input: '[0,-2,0,0,-3,1]',      output: '0'   },
    { input: '[-2,-3,7]',            output: '42'  },
    { input: '[0,2,0,2]',            output: '2'   },
    { input: '[-4,-3,-2]',           output: '12'  },
    { input: '[3,4,-5,6,-7,8]',      output: '5040'},
    { input: '[2,3,-2,4,-3]',        output: '144' },
    { input: '[-3,0,-1,-2,0,-5]',    output: '2'   },
  ],

  // -------------------------------------------------------------------------
  // 159. WORD BREAK
  // Input:  s (string) \n wordDict (string[])
  // Output: "true" / "false"
  // -------------------------------------------------------------------------
  'word-break': [
    { input: '"leetcode"\n["leet","code"]',           output: 'true'  },
    { input: '"applepenapple"\n["apple","pen"]',      output: 'true'  },
    { input: '"catsandog"\n["cats","dog","sand","and","cat"]', output: 'false' },
    { input: '"a"\n["a"]',                            output: 'true'  },
    { input: '"a"\n["b"]',                            output: 'false' },
    { input: '""\n["a"]',                             output: 'true'  },
    { input: '""\n[]',                                output: 'true'  },
    { input: '"ab"\n["a","b"]',                       output: 'true'  },
    { input: '"ab"\n["ab"]',                          output: 'true'  },
    { input: '"ab"\n["a"]',                           output: 'false' },
    { input: '"ab"\n["b"]',                           output: 'false' },
    { input: '"aaaaaaa"\n["aaaa","aaa"]',             output: 'true'  },
    { input: '"aaaaaaa"\n["aaaa","aa"]',              output: 'false' },
    { input: '"aab"\n["a","aa","b"]',                 output: 'true'  },
    { input: '"aab"\n["a","b"]',                      output: 'true'  },
    { input: '"abc"\n["a","b","c"]',                  output: 'true'  },
    { input: '"cars"\n["car","ca","rs"]',             output: 'true'  },
    { input: '"catsanddog"\n["cat","cats","and","sand","dog"]', output: 'true' },
    { input: '"catsanddog"\n["cat","cats","sand","dog"]', output: 'true' },
    { input: '"bb"\n["a","b","bbb","bbbb"]',          output: 'true'  },
    { input: '"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab"\n["a","aa","aaa","aaaa","aaaaa","aaaaaa","aaaaaaa","aaaaaaaa","aaaaaaaaa","aaaaaaaaaa"]', output: 'false' },
    { input: '"pineapplepenapple"\n["apple","pen","applepen","pine","pineapple"]', output: 'true' },
    { input: '"leetcode"\n["leet","code","leetcode"]', output: 'true'  },
    { input: '"abc"\n["ab","abc","a","bc"]',          output: 'true'  },
    { input: '"abcd"\n["a","abc","b","cd"]',          output: 'true'  },
    { input: '"abcd"\n["abc","ab","d"]',              output: 'true'  },
    { input: '"abcd"\n["a","b","c"]',                 output: 'false' },
    { input: '"sun"\n["sun"]',                        output: 'true'  },
    { input: '"goalkeeper"\n["goal","keeper","goalie"]', output: 'true' },
    { input: '"goalkeeping"\n["goal","keep","keeping"]', output: 'true' },
  ],

  // -------------------------------------------------------------------------
  // 160. LONGEST INCREASING SUBSEQUENCE
  // Input:  nums (int[])
  // Output: length of LIS (int)
  // -------------------------------------------------------------------------
  'longest-increasing-subsequence': [
    { input: '[10,9,2,5,3,7,101,18]', output: '4'  },
    { input: '[0,1,0,3,2,3]',         output: '4'  },
    { input: '[7,7,7,7,7,7,7]',       output: '1'  },
    { input: '[1]',                    output: '1'  },
    { input: '[1,2]',                  output: '2'  },
    { input: '[2,1]',                  output: '1'  },
    { input: '[1,2,3]',                output: '3'  },
    { input: '[3,2,1]',                output: '1'  },
    { input: '[1,3,2,4]',              output: '3'  },
    { input: '[2,2,2]',                output: '1'  },
    { input: '[1,2,3,4,5]',            output: '5'  },
    { input: '[5,4,3,2,1]',            output: '1'  },
    { input: '[1,2,1,2,1,2]',          output: '2'  },
    { input: '[3,5,6,2,5,4,19,5,6,7,12]', output: '6' },
    { input: '[4,10,4,3,8,9]',         output: '3'  },
    { input: '[0]',                    output: '1'  },
    { input: '[1,3,6,7,9,4,10,5,6]',   output: '6'  },
    { input: '[2,10,3,11,4,12,5,13]',  output: '5'  },
    { input: '[1,5,2,3]',              output: '3'  },
    { input: '[3,10,2,1,20]',          output: '3'  },
    { input: '[50,3,10,7,40,80]',      output: '4'  },
    { input: '[1,2,3,4,3,2,1]',        output: '4'  },
    { input: '[1,3,5,4,7]',            output: '4'  },
    { input: '[1,2,4,3,5,4,7,2]',      output: '5'  },
    { input: '[0,8,4,12,2,10,6,14,1,9,5,13,3,11,7,15]', output: '6' },
    { input: '[5,1,4,2,3]',            output: '3'  },
    { input: '[1,6,2,8,3,4,5]',        output: '5'  },
    { input: '[10,9,8,7,6,5,4,3,2,1]', output: '1'  },
    { input: '[1,2,3,4,5,6,7,8,9,10]', output: '10' },
    { input: '[1,3,2,3,1,4]',          output: '4'  },
  ],

  // -------------------------------------------------------------------------
  // 161. PARTITION EQUAL SUBSET SUM
  // Input:  nums (int[])
  // Output: "true" / "false"
  // -------------------------------------------------------------------------
  'partition-equal-subset-sum': [
    { input: '[1,5,11,5]',     output: 'true'  },
    { input: '[1,2,3,5]',      output: 'false' },
    { input: '[1,1]',          output: 'true'  },
    { input: '[1,2]',          output: 'false' },
    { input: '[2,2]',          output: 'true'  },
    { input: '[3,3,3,3]',      output: 'true'  },
    { input: '[1,2,3,4]',      output: 'true'  },
    { input: '[1]',            output: 'false' },
    { input: '[2,4]',          output: 'true'  },
    { input: '[1,5,10,6]',    output: 'true'   },
    { input: '[1,2,5]',        output: 'false' },
    { input: '[3,1,1,2,2,1]',  output: 'true'  },
    { input: '[1,2,3,4,5,6,7]', output: 'true' },
    { input: '[1,2,3,4,5,6,7,8,9,10]', output: 'true' },
    { input: '[1,2,3,4,5,6,7,8,9,11]', output: 'false' },
    { input: '[100]',          output: 'false' },
    { input: '[100,100]',      output: 'true'  },
    { input: '[1,100]',        output: 'false' },
    { input: '[14,9,8,4,3,2]', output: 'true'  },
    { input: '[1,2,3,100]',    output: 'false' },
    { input: '[2,2,1,1]',      output: 'true'  },
    { input: '[1,5,3,4,7]',    output: 'true'  },
    { input: '[5,5,10,100,10,35,20]', output: 'true' },
    { input: '[1,1,1,1]',      output: 'true'  },
    { input: '[3,3,3,4,5]',    output: 'false' },
    { input: '[4,4,4,4]',      output: 'true'  },
    { input: '[2,3,4,6]',      output: 'false' },
    { input: '[1,2,3,5,7]',    output: 'false' },
    { input: '[1,2,5,6]',      output: 'true'  },
    { input: '[1,3,5,7,9,11]', output: 'false' },
  ],

  // -------------------------------------------------------------------------
  // 162. JUMP GAME II
  // Input:  nums (int[])
  // Output: minimum number of jumps to reach last index (int)
  // -------------------------------------------------------------------------
  'jump-game-ii': [
    { input: '[2,3,1,1,4]',       output: '2' },
    { input: '[2,3,0,1,4]',       output: '2' },
    { input: '[1,1,1,1]',         output: '3' },
    { input: '[1]',               output: '0' },
    { input: '[2,1]',             output: '1' },
    { input: '[1,2]',             output: '1' },
    { input: '[2,2,0,1]',         output: '2' },
    { input: '[1,2,3]',           output: '2' },
    { input: '[3,2,1,1,4]',       output: '2' },
    { input: '[1,1,1,1,1]',       output: '4' },
    { input: '[4,1,1,3,1,1,1]',   output: '2' },
    { input: '[5,9,3,2,1,0,2,3,3,1,0,0]', output: '3' },
    { input: '[10,9,8,1,0,0,0,1,2,3]', output: '1' },
    { input: '[1,2,1,1,1]',       output: '3' },
    { input: '[3,0,8,2,0,0,1]',   output: '3' },
    { input: '[2,1,2,1,0]',       output: '2' },
    { input: '[6,2,6,1,7,9,3,5,3,7,2,8,9,4]', output: '2' },
    { input: '[1,2,4,1,1,1,1,1]', output: '4' },
    { input: '[2,5,0,0]',         output: '2' },
    { input: '[1,3,1,1,1,1]',     output: '3' },
    { input: '[3,1,2,4,1,1]',     output: '2' },
    { input: '[2,4,2]',           output: '1' },
    { input: '[7,0,9,6,9,6,1,7,9,0,1,2,9,0,3]', output: '2' },
    { input: '[1,1,2,3,2,1]',     output: '4' },
    { input: '[5,6,4,4,6,9,4,4,7,4,4,8,2,6,8,1,5,9,6,5,2,7,9,7,9,6]', output: '5' },
    { input: '[4,3,2,1,0,1]',     output: '2' },
    { input: '[1,2,3,4,5]',       output: '3' },
    { input: '[5,4,3,2,1]',       output: '1' },
    { input: '[2,1,0,1,4]',       output: '2' },
    { input: '[1,1,1]',           output: '2' },
  ],

  // -------------------------------------------------------------------------
  // 163. UNIQUE PATHS
  // Input:  m (int) \n n (int)
  // Output: number of unique paths from top-left to bottom-right (int)
  // -------------------------------------------------------------------------
  'unique-paths': [
    { input: '3\n7',   output: '28'   },
    { input: '3\n2',   output: '3'    },
    { input: '7\n3',   output: '28'   },
    { input: '1\n1',   output: '1'    },
    { input: '1\n5',   output: '1'    },
    { input: '5\n1',   output: '1'    },
    { input: '2\n2',   output: '2'    },
    { input: '2\n3',   output: '3'    },
    { input: '3\n3',   output: '6'    },
    { input: '4\n4',   output: '20'   },
    { input: '5\n5',   output: '70'   },
    { input: '2\n10',  output: '10'   },
    { input: '10\n2',  output: '10'   },
    { input: '3\n4',   output: '10'   },
    { input: '4\n3',   output: '10'   },
    { input: '3\n5',   output: '15'   },
    { input: '5\n3',   output: '15'   },
    { input: '6\n5',   output: '126'  },
    { input: '5\n6',   output: '126'  },
    { input: '10\n10', output: '48620'},
    { input: '2\n4',   output: '4'    },
    { input: '4\n2',   output: '4'    },
    { input: '1\n100', output: '1'    },
    { input: '100\n1', output: '1'    },
    { input: '6\n6',   output: '252'  },
    { input: '7\n7',   output: '924'  },
    { input: '4\n5',   output: '35'   },
    { input: '5\n4',   output: '35'   },
    { input: '3\n6',   output: '21'   },
    { input: '6\n3',   output: '21'   },
  ],

  // -------------------------------------------------------------------------
  // 164. UNIQUE PATHS II
  // Input:  obstacleGrid (int[][]) — 0=free, 1=obstacle
  // Output: unique paths from top-left to bottom-right (int)
  // -------------------------------------------------------------------------
  'unique-paths-ii': [
    { input: '[[0,0,0],[0,1,0],[0,0,0]]', output: '2'  },
    { input: '[[0,1],[0,0]]',             output: '1'  },
    { input: '[[0]]',                     output: '1'  },
    { input: '[[1]]',                     output: '0'  },
    { input: '[[0,0]]',                   output: '1'  },
    { input: '[[0],[0]]',                 output: '1'  },
    { input: '[[1,0]]',                   output: '0'  },
    { input: '[[0,1]]',                   output: '0'  },
    { input: '[[0],[1]]',                 output: '0'  },
    { input: '[[0,0,0],[0,0,0],[0,0,0]]', output: '6'  },
    { input: '[[0,0,0],[0,1,0],[0,1,0]]', output: '1'  },
    { input: '[[0,0],[0,1]]',             output: '0'  },
    { input: '[[0,0],[1,0]]',             output: '1'  },
    { input: '[[0,0,0,0],[0,1,0,0],[0,0,0,0]]', output: '4' },
    { input: '[[0,0,0,0],[0,0,1,0],[0,0,0,0]]', output: '4' },
    { input: '[[0,0,0],[1,0,0],[0,0,0]]', output: '3'  },
    { input: '[[0,0,0],[0,0,0],[0,0,1]]', output: '0'  },
    { input: '[[1,0,0],[0,0,0],[0,0,0]]', output: '0'  },
    { input: '[[0,0],[0,0],[0,0]]',       output: '3'  },
    { input: '[[0,0,0],[0,0,0]]',         output: '3'  },
    { input: '[[0,0,0,0,0],[0,1,0,1,0],[0,0,0,0,0]]', output: '8' },
    { input: '[[0,0,1],[0,0,0],[1,0,0]]', output: '2'  },
    { input: '[[0,1,0,0,0],[1,0,0,1,0],[0,0,0,0,0],[0,1,0,1,0],[0,0,0,0,0]]', output: '37' },
    { input: '[[0,0,0,0],[1,1,1,0],[0,0,0,0],[0,1,1,0],[0,0,0,0]]', output: '3' },
    { input: '[[0,0,0,0,0,0,0,0,0,0]]',  output: '1'  },
    { input: '[[0],[0],[0],[0],[0]]',     output: '1'  },
    { input: '[[0,0,0,0],[0,1,0,0],[0,0,0,0],[0,0,0,0]]', output: '11' },
    { input: '[[0,0,0,0,0],[0,0,0,0,0],[0,0,1,0,0],[0,0,0,0,0],[0,0,0,0,0]]', output: '48' },
    { input: '[[0,0,0],[0,1,0],[0,0,0],[0,0,0]]', output: '4' },
    { input: '[[0,0,0,0,0],[0,1,1,0,0],[0,0,0,0,0]]', output: '6' },
  ],

  // -------------------------------------------------------------------------
  // 165. MINIMUM PATH SUM
  // Input:  grid (int[][])
  // Output: minimum sum path from top-left to bottom-right (int)
  // -------------------------------------------------------------------------
  'minimum-path-sum': [
    { input: '[[1,3,1],[1,5,1],[4,2,1]]', output: '7'  },
    { input: '[[1,2,3],[4,5,6]]',         output: '12' },
    { input: '[[1]]',                     output: '1'  },
    { input: '[[1,2],[3,4]]',             output: '7'  },
    { input: '[[1,4],[2,3]]',             output: '6'  },
    { input: '[[2,1,1]]',                 output: '4'  },
    { input: '[[1],[2],[3]]',             output: '6'  },
    { input: '[[5,4,3],[1,2,1],[2,1,1]]', output: '8'  },
    { input: '[[1,2,3,4,5]]',             output: '15' },
    { input: '[[1],[2],[3],[4],[5]]',     output: '15' },
    { input: '[[1,2],[4,3]]',             output: '6'  },
    { input: '[[3,2],[4,1]]',             output: '6'  },
    { input: '[[1,3,1],[1,5,1],[4,2,1],[2,1,3]]', output: '9' },
    { input: '[[1,2,5],[3,2,1]]',         output: '6'  },
    { input: '[[1,3,1,2],[1,5,1,3],[4,2,1,1]]', output: '10' },
    { input: '[[9,1,4,8]]',               output: '22' },
    { input: '[[9],[8],[1],[4]]',         output: '22' },
    { input: '[[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1]]', output: '7' },
    { input: '[[1,1],[1,1],[1,1]]',       output: '4'  },
    { input: '[[2,3,4],[5,6,7],[8,9,10]]', output: '27'},
    { input: '[[1,2,3],[4,5,6],[7,8,9]]', output: '21' },
    { input: '[[5,1,2],[3,1,4],[2,6,1]]', output: '10' },
    { input: '[[1,2,3,4],[5,1,1,4],[5,5,1,1]]', output: '9' },
    { input: '[[1,2,3],[7,6,5],[8,9,10]]', output: '18'},
    { input: '[[1,10,1],[10,1,10],[1,10,1]]', output: '5' },
    { input: '[[0,0,0],[0,0,0],[0,0,0]]', output: '0'  },
    { input: '[[5,9,6],[11,5,2]]',        output: '21' },
    { input: '[[1,2,3,4],[2,2,3,4],[3,3,2,4],[4,4,4,2]]', output: '12' },
    { input: '[[2,2,2],[2,2,2],[2,2,2]]', output: '10' },
    { input: '[[1,3,1,2,1],[1,5,1,1,1],[4,2,1,1,1]]', output: '9' },
  ],

  // -------------------------------------------------------------------------
  // 166. MAXIMAL SQUARE
  // Input:  matrix (char[][]) — '0' or '1'
  // Output: area of the largest square of 1s (int)
  // -------------------------------------------------------------------------
  'maximal-square': [
    { input: '[["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]',
      output: '4' },
    { input: '[["0","1"],["1","0"]]',  output: '1'  },
    { input: '[["0"]]',               output: '0'  },
    { input: '[["1"]]',               output: '1'  },
    { input: '[["1","1"],["1","1"]]',  output: '4'  },
    { input: '[["0","0"],["0","0"]]',  output: '0'  },
    { input: '[["1","0"],["0","1"]]',  output: '1'  },
    { input: '[["1","1","1"],["1","1","1"],["1","1","1"]]', output: '9' },
    { input: '[["1","1","1"],["1","1","1"],["1","1","0"]]', output: '4' },
    { input: '[["1","0","1"],["0","1","0"],["1","0","1"]]', output: '1' },
    { input: '[["0","0","0"],["0","0","0"]]', output: '0' },
    { input: '[["1","1","1","1"],["1","1","1","1"],["1","1","1","1"]]', output: '9' },
    { input: '[["1","1"],["1","0"]]',  output: '1'  },
    { input: '[["0","1","1"],["1","1","1"],["1","1","1"]]', output: '4' },
    { input: '[["1","1","1"],["1","0","1"],["1","1","1"]]', output: '1' },
    { input: '[["1","0","1","1","1"],["0","1","1","1","1"],["1","1","1","1","1"],["1","1","1","1","1"]]',
      output: '9' },
    { input: '[["1","0","1","0","1"]]', output: '1' },
    { input: '[["1"],["1"],["1"],["1"],["1"]]', output: '1' },
    { input: '[["1","1","1","1","1"]]', output: '1' },
    { input: '[["1","1"],["1","1"],["1","1"]]', output: '4' },
    { input: '[["0","1","1","1","0"],["1","1","1","1","1"],["0","1","1","1","1"],["0","1","1","1","1"],["0","0","1","1","1"]]',
      output: '9' },
    { input: '[["1","1","1","1"],["1","1","1","1"]]', output: '4' },
    { input: '[["1","1","0","1"],["1","1","1","1"],["1","1","1","1"],["0","1","1","1"]]',
      output: '9' },
    { input: '[["1","0"],["1","0"]]',  output: '1'  },
    { input: '[["0","1"],["0","1"]]',  output: '1'  },
    { input: '[["1","1","1","1","1"],["1","1","1","1","1"],["1","1","1","1","1"],["1","1","1","1","1"]]',
      output: '16' },
    { input: '[["0","0","1"],["0","1","1"],["1","1","1"]]', output: '4' },
    { input: '[["1","0","0","1","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","1","1","1"]]',
      output: '9' },
    { input: '[["1","1","1","1","1"],["1","1","1","1","1"],["1","1","1","1","1"]]',
      output: '9' },
    { input: '[["1","0"],["0","0"]]',  output: '1'  },
  ],

  // -------------------------------------------------------------------------
  // 167. MINIMUM WINDOW SUBSTRING
  // Input:  s (string) \n t (string)
  // Output: minimum window substring (string), or "" if none
  // -------------------------------------------------------------------------
  'minimum-window-substring': [
    { input: '"ADOBECODEBANC"\n"ABC"', output: '"BANC"'    },
    { input: '"a"\n"a"',              output: '"a"'        },
    { input: '"a"\n"aa"',             output: '""'         },
    { input: '"a"\n"b"',              output: '""'         },
    { input: '"aa"\n"aa"',            output: '"aa"'       },
    { input: '"ab"\n"b"',             output: '"b"'        },
    { input: '"ba"\n"a"',             output: '"a"'        },
    { input: '"bba"\n"ab"',           output: '"ba"'       },
    { input: '"abc"\n"ac"',           output: '"abc"'      },
    { input: '"abc"\n"b"',            output: '"b"'        },
    { input: '"abc"\n"abc"',          output: '"abc"'      },
    { input: '"abc"\n"abcd"',         output: '""'         },
    { input: '"ADOBECODEBANC"\n"AABC"',output: '"ADOBECODEBA"'},
    { input: '"aabc"\n"ac"',          output: '"abc"'      },
    { input: '"ab"\n"a"',             output: '"a"'        },
    { input: '"abba"\n"ab"',          output: '"ab"'       },
    { input: '"abba"\n"aa"',          output: '"abba"'     },
    { input: '"abcde"\n"ace"',        output: '"abcde"'    },
    { input: '"cabwefgewcwaefgcf"\n"cae"', output: '"cwae"' },
    { input: '"acbbaca"\n"aba"',      output: '"baca"'     },
    { input: '"abdcef"\n"def"',       output: '"dcef"'     },
    { input: '"aab"\n"aab"',          output: '"aab"'      },
    { input: '"aabc"\n"ab"',          output: '"ab"'       },
    { input: '"abcbc"\n"bc"',         output: '"bc"'       },
    { input: '"xyzabc"\n"abc"',       output: '"abc"'      },
    { input: '"abcxyz"\n"xyz"',       output: '"xyz"'      },
    { input: '"ab"\n"ba"',            output: '"ab"'       },
    { input: '"aaflslflsldskalskadk"\n"aady"', output: '""' },
    { input: '"abc"\n"a"',            output: '"a"'        },
    { input: '"aaaabc"\n"abc"',       output: '"abc"'      },
  ],

  // -------------------------------------------------------------------------
  // 168. TRAPPING RAIN WATER
  // Input:  height (int[])
  // Output: total water trapped (int)
  // -------------------------------------------------------------------------
  'trapping-rain-water': [
    { input: '[0,1,0,2,1,0,1,3,2,1,2,1]', output: '6'  },
    { input: '[4,2,0,3,2,5]',             output: '9'  },
    { input: '[1]',                        output: '0'  },
    { input: '[1,2]',                      output: '0'  },
    { input: '[2,1]',                      output: '0'  },
    { input: '[2,1,2]',                    output: '1'  },
    { input: '[3,0,2,0,4]',                output: '7'  },
    { input: '[1,0,1]',                    output: '1'  },
    { input: '[0,0,0]',                    output: '0'  },
    { input: '[3,0,0,2,0,4]',             output: '10' },
    { input: '[0,1,0,0]',                  output: '0'  },
    { input: '[4,2,1,3]',                  output: '2'  },
    { input: '[0,7,1,4,6]',               output: '7'  },
    { input: '[1,2,3,4,5]',               output: '0'  },
    { input: '[5,4,3,2,1]',               output: '0'  },
    { input: '[5,5,5,5,5]',               output: '0'  },
    { input: '[4,0,0,0,4]',               output: '12' },
    { input: '[1,0,2,1,0,1,3,2,1,2,1]',  output: '6'  },
    { input: '[2,0,2]',                    output: '2'  },
    { input: '[5,4,1,2]',                  output: '1'  },
    { input: '[3,1,2,4,0,1,3,2]',         output: '8'  },
    { input: '[0,0,4,0,0]',               output: '0'  },
    { input: '[5,2,1,2,1,5]',             output: '14' },
    { input: '[1,0,3,0,1,0,0,1]',         output: '4'  },
    { input: '[2,0,0,0,0,0,2]',           output: '10' },
    { input: '[6,4,2,0,3,2,0,3,1,4,5,3,2,7,4,0,1,2,6,5,0,3]', output: '72' },
    { input: '[0,4,0,0,4,0]',             output: '8'  },
    { input: '[2,1,0,1,2,3,0,2]',         output: '6'  },
    { input: '[0,1,2,3,4,3,2,1,0]',       output: '0'  },
    { input: '[4,1,1,0,2,3]',             output: '7'  },
  ],

  // -------------------------------------------------------------------------
  // 169. CONTAINER WITH MOST WATER
  // Input:  height (int[])
  // Output: maximum water area (int)
  // -------------------------------------------------------------------------
  'container-with-most-water': [
    { input: '[1,8,6,2,5,4,8,3,7]', output: '49' },
    { input: '[1,1]',                output: '1'  },
    { input: '[4,3,2,1,4]',          output: '16' },
    { input: '[1,2,1]',              output: '2'  },
    { input: '[1,2,4,3]',            output: '4'  },
    { input: '[2,3,4,5,18,17,6]',   output: '17' },
    { input: '[1]',                  output: '0'  },
    { input: '[1,2]',                output: '1'  },
    { input: '[2,1]',                output: '1'  },
    { input: '[5,5]',                output: '5'  },
    { input: '[1,2,3,4,5]',         output: '6'  },
    { input: '[5,4,3,2,1]',         output: '6'  },
    { input: '[10,1,10]',            output: '20' },
    { input: '[1,10,1]',             output: '2'  },
    { input: '[2,2,2]',              output: '4'  },
    { input: '[3,1,2,4,5]',         output: '9'  },
    { input: '[1,8,6,2,5,4,8,25,7]', output: '49'},
    { input: '[0,0]',                output: '0'  },
    { input: '[8,7,2,1]',            output: '7'  },
    { input: '[1,3,2,5,25,24,5]',   output: '24' },
    { input: '[10,9,8,7,6,5,4,3,2,1]', output: '25'},
    { input: '[1,2,3,4,5,6,7,8,9,10]', output: '25'},
    { input: '[3,2,3]',              output: '6'  },
    { input: '[6,3,8,1,4,2,9,5,7]', output: '40' },
    { input: '[7,1,1,4,7]',          output: '28' },
    { input: '[1,6,5,2,1,7]',        output: '21' },
    { input: '[4,6,2,6,7,11,2]',    output: '36' },
    { input: '[5,5,5,5,5]',         output: '20' },
    { input: '[9,8,7,6,5,4,3,2,1,2,3,4,5,6,7,8,9]', output: '72'},
    { input: '[2,2,2,2,2,2,2,2]',   output: '14' },
  ],

  // -------------------------------------------------------------------------
  // 170. LARGEST RECTANGLE IN HISTOGRAM
  // Input:  heights (int[])
  // Output: area of the largest rectangle (int)
  // -------------------------------------------------------------------------
  'largest-rectangle-in-histogram': [
    { input: '[2,1,5,6,2,3]',         output: '10' },
    { input: '[2,4]',                  output: '4'  },
    { input: '[1]',                    output: '1'  },
    { input: '[0]',                    output: '0'  },
    { input: '[1,1]',                  output: '2'  },
    { input: '[2,2]',                  output: '4'  },
    { input: '[1,2,3,4,5]',           output: '9'  },
    { input: '[5,4,3,2,1]',           output: '9'  },
    { input: '[1,1,1,1,1]',           output: '5'  },
    { input: '[2,1,2]',               output: '3'  },
    { input: '[3,1,3]',               output: '3'  },
    { input: '[5,5,5,5]',             output: '20' },
    { input: '[6,2,5,4,5,1,6]',       output: '12' },
    { input: '[1,2,3,4,3,2,1]',       output: '10' },
    { input: '[4,4,4,4]',             output: '16' },
    { input: '[2,1,5,6,2,3,1]',       output: '10' },
    { input: '[1,2,1,2,1,2,1]',       output: '7'  },
    { input: '[3,3,3]',               output: '9'  },
    { input: '[2,3,5,6,5,3,2]',       output: '20' },
    { input: '[5,6,7,6,5,4]',         output: '24' },
    { input: '[2,0,2]',               output: '2'  },
    { input: '[1,0,1]',               output: '1'  },
    { input: '[4,2,0,3,2,5]',         output: '6'  },
    { input: '[1,2,3,1,2,3]',         output: '6'  },
    { input: '[10]',                   output: '10' },
    { input: '[3,2,3,2,3]',           output: '10' },
    { input: '[1,3,2,1,2]',           output: '5'  },
    { input: '[0,9]',                  output: '9'  },
    { input: '[9,0]',                  output: '9'  },
    { input: '[2,1,2,3,1,2]',         output: '6'  },
  ],

  // -------------------------------------------------------------------------
  // 171. DAILY TEMPERATURES
  // Input:  temperatures (int[])
  // Output: int[] — days until warmer temperature (0 if none)
  // -------------------------------------------------------------------------
  'daily-temperatures': [
    { input: '[73,74,75,71,69,72,76,73]', output: '[1,1,4,2,1,1,0,0]' },
    { input: '[30,40,50,60]',             output: '[1,1,1,0]'          },
    { input: '[30,60,90]',                output: '[1,1,0]'            },
    { input: '[90,60,30]',                output: '[0,0,0]'            },
    { input: '[30,30,30]',                output: '[0,0,0]'            },
    { input: '[30]',                      output: '[0]'                },
    { input: '[30,40]',                   output: '[1,0]'              },
    { input: '[40,30]',                   output: '[0,0]'              },
    { input: '[1,2,3,4,5]',              output: '[1,1,1,1,0]'        },
    { input: '[5,4,3,2,1]',              output: '[0,0,0,0,0]'        },
    { input: '[5,5,5,5,5]',              output: '[0,0,0,0,0]'        },
    { input: '[1,1,1,1,2]',              output: '[4,3,2,1,0]'        },
    { input: '[1,2,1,2,1]',              output: '[1,0,1,0,0]'        },
    { input: '[2,1,2,1,2]',              output: '[0,1,0,1,0]'        },
    { input: '[73,72,75,71,69,72,76,73]', output: '[2,1,4,2,1,1,0,0]'},
    { input: '[55,38,53,81,61,93,97,32,43,78]', output: '[3,1,1,2,1,1,0,2,1,0]' },
    { input: '[89,62,70,58,47,47,46,76,100,70]', output: '[8,1,1,5,4,3,2,1,0,0]' },
    { input: '[1,2,3,2,1]',              output: '[1,1,0,0,0]'        },
    { input: '[5,3,4,5,1]',              output: '[0,1,1,0,0]'        },
    { input: '[0,1,0,1,0]',              output: '[1,0,1,0,0]'        },
    { input: '[10,20,30,20,10]',         output: '[1,1,0,0,0]'        },
    { input: '[50,40,50,60,50,40]',      output: '[2,1,1,0,0,0]'      },
    { input: '[1,2,3,4,5,4,3,2,1,6]',   output: '[1,1,1,1,5,4,3,2,1,0]' },
    { input: '[100,100,100]',            output: '[0,0,0]'            },
    { input: '[1,100,1]',                output: '[1,0,0]'            },
    { input: '[100,1,100]',              output: '[0,1,0]'            },
    { input: '[50,50,60,50,50]',         output: '[2,1,0,0,0]'        },
    { input: '[30,40,50,40,30,60]',      output: '[1,1,3,2,1,0]'      },
    { input: '[1,1,2,2,3,3]',            output: '[2,1,2,1,0,0]'      },
    { input: '[3,2,1,3,2,1]',            output: '[0,1,0,0,0,0]'      },
  ],

  // -------------------------------------------------------------------------
  // 172. CAR FLEET
  // Input:  target (int) \n position (int[]) \n speed (int[])
  // Output: number of car fleets arriving at destination (int)
  // -------------------------------------------------------------------------
  'car-fleet': [
    { input: '12\n[10,8,0,5,3]\n[2,4,1,1,3]',    output: '3' },
    { input: '10\n[3]\n[3]',                       output: '1' },
    { input: '100\n[0,2,4]\n[4,2,1]',             output: '1' },
    { input: '10\n[6,8]\n[3,2]',                   output: '2' },
    { input: '10\n[8,6]\n[2,3]',                   output: '1' },
    { input: '10\n[0]\n[1]',                       output: '1' },
    { input: '10\n[0,4,2]\n[2,1,3]',              output: '1' },
    { input: '20\n[0,10,15]\n[2,3,5]',            output: '2' },
    { input: '10\n[0,2,4,6,8]\n[2,2,2,2,2]',     output: '1' },
    { input: '10\n[9,8,0,5,3]\n[2,4,1,1,3]',     output: '3' },
    { input: '100\n[0,25,50,75]\n[1,2,3,4]',     output: '1' },
    { input: '10\n[0,2]\n[1,1]',                  output: '2' },
    { input: '10\n[0,5]\n[2,1]',                  output: '1' },
    { input: '10\n[0,5]\n[1,2]',                  output: '2' },
    { input: '10\n[1,4]\n[2,1]',                  output: '1' },
    { input: '10\n[1,4,9]\n[2,1,10]',             output: '2' },
    { input: '10\n[0,2,4,6]\n[2,3,4,5]',         output: '4' },
    { input: '15\n[10,3,5]\n[1,6,3]',             output: '2' },
    { input: '10\n[4,1,0,7]\n[2,2,1,1]',         output: '3' },
    { input: '100\n[0,23,28,50]\n[5,3,4,1]',     output: '1' },
    { input: '10\n[5,4,3,2,1]\n[1,2,3,4,5]',     output: '4' },
    { input: '12\n[10,7,0,5,3]\n[2,1,1,1,3]',    output: '4' },
    { input: '10\n[9]\n[1]',                       output: '1' },
    { input: '10\n[0,9]\n[1,1]',                  output: '2' },
    { input: '10\n[0,3,7]\n[3,3,3]',              output: '3' },
    { input: '20\n[0,5,10,15]\n[4,3,2,1]',       output: '1' },
    { input: '20\n[0,5,10,15]\n[1,2,3,4]',       output: '4' },
    { input: '10\n[8,3,5,4]\n[4,1,2,3]',         output: '3' },
    { input: '10\n[0,1,2,3,4,5,6,7,8,9]\n[9,1,1,1,1,1,1,1,1,1]', output: '9' },
    { input: '30\n[10,20,25]\n[5,3,4]',           output: '2' },
  ],

  // -------------------------------------------------------------------------
  // 173. LONGEST REPEATING CHARACTER REPLACEMENT
  // Input:  s (string) \n k (int)
  // Output: length of longest substring with at most k replacements (int)
  // -------------------------------------------------------------------------
  'longest-repeating-character-replacement': [
    { input: '"ABAB"\n2',       output: '4' },
    { input: '"AABABBA"\n1',    output: '4' },
    { input: '"A"\n0',          output: '1' },
    { input: '"A"\n1',          output: '1' },
    { input: '"AB"\n0',         output: '1' },
    { input: '"AB"\n1',         output: '2' },
    { input: '"AA"\n0',         output: '2' },
    { input: '"AAAB"\n0',       output: '3' },
    { input: '"AAAB"\n1',       output: '4' },
    { input: '"ABBB"\n2',       output: '4' },
    { input: '"AABCCC"\n2',     output: '5' },
    { input: '"ABCDE"\n1',      output: '2' },
    { input: '"ABCDE"\n2',      output: '3' },
    { input: '"ABCDE"\n4',      output: '5' },
    { input: '"KQEP"\n1',       output: '2' },
    { input: '"AAAA"\n0',       output: '4' },
    { input: '"AAAA"\n2',       output: '4' },
    { input: '"ABAA"\n0',       output: '2' },
    { input: '"ABAA"\n1',       output: '4' },
    { input: '"BAAAB"\n2',      output: '5' },
    { input: '"EOEMQLLQB"\n2',  output: '5' },
    { input: '"ABBB"\n0',       output: '3' },
    { input: '"AABABBA"\n0',    output: '2' },
    { input: '"AABABBA"\n2',    output: '5' },
    { input: '"AABABBA"\n3',    output: '6' },
    { input: '"AABABBA"\n7',    output: '7' },
    { input: '"AAABBC"\n1',     output: '4' },
    { input: '"AAABBC"\n2',     output: '5' },
    { input: '"AAABBC"\n3',     output: '6' },
    { input: '"BAABAAB"\n1',    output: '5' },
    { input: '"AABABBA"\n4',    output: '7' },
    { input: '"ABCCCBA"\n2',    output: '6' },
    { input: '"ABCCCBA"\n1',    output: '5' },
    { input: '"ABCCCBA"\n0',    output: '3' },
    { input: '"AABBBBA"\n2',    output: '7' },
    { input: '"CCAABBB"\n2',    output: '5' },
    { input: '"BAAA"\n0',       output: '3' },
    { input: '"BAAA"\n1',       output: '4' },
    { input: '"AABABBA"\n5',    output: '7' },
    { input: '"ABCDE"\n0',      output: '1' },
  ],

  // -------------------------------------------------------------------------
  // 174. PERMUTATION IN STRING
  // Input:  s1 (string) \n s2 (string)
  // Output: "true" if any permutation of s1 is a substring of s2, else "false"
  // -------------------------------------------------------------------------
  'permutation-in-string': [
    { input: '"ab"\n"eidbaooo"',    output: 'true'  },
    { input: '"ab"\n"eidboaoo"',    output: 'false' },
    { input: '"a"\n"a"',            output: 'true'  },
    { input: '"a"\n"ab"',           output: 'true'  },
    { input: '"a"\n"b"',            output: 'false' },
    { input: '"ab"\n"ab"',          output: 'true'  },
    { input: '"ab"\n"ba"',          output: 'true'  },
    { input: '"abc"\n"bbbca"',      output: 'true'  },
    { input: '"abc"\n"bbbda"',      output: 'false' },
    { input: '"adc"\n"dcda"',       output: 'true'  },
    { input: '"ab"\n"cd"',          output: 'false' },
    { input: '"abc"\n"abc"',        output: 'true'  },
    { input: '"abc"\n"cba"',        output: 'true'  },
    { input: '"abcd"\n"dcba"',      output: 'true'  },
    { input: '"aa"\n"aa"',          output: 'true'  },
    { input: '"aa"\n"a"',           output: 'false' },
    { input: '"ab"\n"a"',           output: 'false' },
    { input: '"hello"\n"ooolleoooleh"', output: 'false' },
    { input: '"aab"\n"eidbaooo"',   output: 'false' },
    { input: '"aab"\n"aab"',        output: 'true'  },
    { input: '"aabc"\n"aaacb"',     output: 'true'  },
    { input: '"abc"\n"abcdef"',     output: 'true'  },
    { input: '"abc"\n"defabc"',     output: 'true'  },
    { input: '"abc"\n"xabcy"',      output: 'true'  },
    { input: '"abc"\n"xabdy"',      output: 'false' },
    { input: '"ab"\n"ooab"',        output: 'true'  },
    { input: '"ab"\n"aboo"',        output: 'true'  },
    { input: '"ab"\n"oaob"',        output: 'false' },
    { input: '"ab"\n"oabo"',        output: 'true'  },
    { input: '"abc"\n"cbaebabacd"', output: 'true'  },
    { input: '"a"\n"bb"',           output: 'false' },
    { input: '"aab"\n"abaab"',      output: 'true'  },
    { input: '"ab"\n"oooaboooo"',   output: 'true'  },
    { input: '"ab"\n"ooobaoooo"',   output: 'true'  },
  ],

  // -------------------------------------------------------------------------
  // 175. GAS STATION
  // Input:  gas (int[]) \n cost (int[])
  // Output: starting index (int), or -1 if impossible
  // -------------------------------------------------------------------------
  'gas-station': [
    { input: '[1,2,3,4,5]\n[3,4,5,1,2]',   output: '3' },
    { input: '[2,3,4]\n[3,4,3]',            output: '-1'},
    { input: '[5]\n[4]',                    output: '0' },
    { input: '[4]\n[5]',                    output: '-1'},
    { input: '[1,2]\n[2,1]',               output: '1' },
    { input: '[2,1]\n[1,2]',               output: '0' },
    { input: '[3,3,4]\n[3,4,4]',           output: '-1'},
    { input: '[3,4,4]\n[3,4,3]',           output: '2' },
    { input: '[1,2,3,4,5]\n[1,2,3,4,5]',   output: '0' },
    { input: '[2,3,4,5,1]\n[3,4,5,1,2]',   output: '4' },
    { input: '[6,1,4,3,5]\n[3,8,2,4,2]',   output: '2' },
    { input: '[1,1,1,1,1]\n[1,1,1,1,1]',   output: '0' },
    { input: '[0,0,0]\n[1,0,0]',           output: '-1'},
    { input: '[0,1,0]\n[0,0,1]',           output: '1' },
    { input: '[5,1,2,3,4]\n[4,4,1,5,1]',   output: '4' },
    { input: '[1,2,3,4]\n[2,2,4,1]',       output: '-1'},
    { input: '[2,2,2,2]\n[1,2,3,4]',       output: '-1'},
    { input: '[4,2,2,2]\n[1,2,3,4]',       output: '0' },
    { input: '[2,3,4,3,3]\n[3,4,3,2,1]',   output: '2' },
    { input: '[10,1,1,1,1]\n[2,2,2,2,2]',  output: '0' },
    { input: '[1,1,10,1,1]\n[2,2,2,2,2]',  output: '2' },
    { input: '[2,3,1]\n[3,1,2]',           output: '1' },
    { input: '[3,1,2]\n[2,3,1]',           output: '2' },
    { input: '[5,8,2,8]\n[6,5,6,6]',       output: '3' },
    { input: '[1,2,3]\n[3,2,1]',           output: '2' },
    { input: '[3,2,1]\n[1,2,3]',           output: '0' },
    { input: '[1,1,1,1,5]\n[2,2,2,2,1]',   output: '-1'},
    { input: '[4,5,6,7,8]\n[5,6,7,8,1]',   output: '4' },
    { input: '[3,3,4]\n[3,3,3]',           output: '2' },
    { input: '[2,2,2,2,2]\n[1,1,1,1,6]',   output: '-1'},
  ],

  // -------------------------------------------------------------------------
  // 176. IMPLEMENT TRIE (PREFIX TREE)
  // Input:  ops (string[]) — "Trie"|"insert:word"|"search:word"|"startsWith:prefix"
  // Output: results (string[]) — "null" for Trie/insert, "true"/"false" for queries
  // -------------------------------------------------------------------------
  'implement-trie-prefix-tree': [
    { input: '["Trie","insert:apple","search:apple","search:app","startsWith:app","insert:app","search:app"]',
      output: '["null","null","true","false","true","null","true"]' },
    { input: '["Trie","insert:a","search:a","search:b"]',
      output: '["null","null","true","false"]' },
    { input: '["Trie","insert:hello","search:hello","search:hell","startsWith:hell"]',
      output: '["null","null","true","false","true"]' },
    { input: '["Trie","insert:apple","insert:app","search:apple","search:app","search:ap","startsWith:ap"]',
      output: '["null","null","null","true","true","false","true"]' },
    { input: '["Trie","startsWith:a"]',
      output: '["null","false"]' },
    { input: '["Trie","insert:a","startsWith:a","startsWith:b"]',
      output: '["null","null","true","false"]' },
    { input: '["Trie","insert:ab","search:ab","search:a","startsWith:a","startsWith:ab","startsWith:abc"]',
      output: '["null","null","true","false","true","true","false"]' },
    { input: '["Trie","insert:abc","insert:abcd","search:abc","search:abcd","search:ab","startsWith:abc"]',
      output: '["null","null","null","true","true","false","true"]' },
    { input: '["Trie","insert:word","search:word","search:wor","search:words","startsWith:w","startsWith:wo","startsWith:x"]',
      output: '["null","null","true","false","false","true","true","false"]' },
    { input: '["Trie","insert:a","insert:a","search:a"]',
      output: '["null","null","null","true"]' },
    { input: '["Trie","insert:abc","insert:abc","search:abc"]',
      output: '["null","null","null","true"]' },
    { input: '["Trie","insert:sea","insert:sells","insert:she","search:she","search:sea","search:sell","startsWith:se"]',
      output: '["null","null","null","null","true","true","false","true"]' },
    { input: '["Trie","insert:cat","insert:bat","insert:rat","search:cat","startsWith:ca","search:ma"]',
      output: '["null","null","null","null","true","true","false"]' },
    { input: '["Trie","insert:car","search:car","search:care","startsWith:car","startsWith:care"]',
      output: '["null","null","true","false","true","false"]' },
    { input: '["Trie","insert:test","search:testing","startsWith:test"]',
      output: '["null","null","false","true"]' },
    { input: '["Trie","insert:ab","insert:abc","insert:abcd","startsWith:a","startsWith:ab","startsWith:abc","startsWith:abcd","startsWith:abcde"]',
      output: '["null","null","null","null","true","true","true","true","false"]' },
    { input: '["Trie","insert:prefix","search:prefix","search:pre","startsWith:pre"]',
      output: '["null","null","true","false","true"]' },
    { input: '["Trie","insert:z","search:z","startsWith:z","search:a","startsWith:a"]',
      output: '["null","null","true","true","false","false"]' },
    { input: '["Trie","insert:hello","insert:world","search:hello","search:world","search:hell","startsWith:hel","startsWith:wor","startsWith:xyz"]',
      output: '["null","null","null","true","true","false","true","true","false"]' },
    { input: '["Trie","insert:a","insert:b","insert:c","search:a","search:b","search:c","search:d"]',
      output: '["null","null","null","null","true","true","true","false"]' },
  ],

  // -------------------------------------------------------------------------
  // 177. DESIGN ADD AND SEARCH WORDS DATA STRUCTURE
  // Input:  ops (string[]) — "WordDictionary"|"addWord:word"|"search:word"
  //   search supports '.' as wildcard for any single character
  // Output: results (string[]) — "null" for WordDictionary/addWord, "true"/"false" for search
  // -------------------------------------------------------------------------
  'design-add-and-search-words-data-structure': [
    { input: '["WordDictionary","addWord:bad","addWord:dad","addWord:mad","search:pad","search:bad","search:.ad","search:b.."]',
      output: '["null","null","null","null","false","true","true","true"]' },
    { input: '["WordDictionary","addWord:a","search:a","search:.","search:aa"]',
      output: '["null","null","true","true","false"]' },
    { input: '["WordDictionary","addWord:ab","search:ab","search:a.","search:.b","search:..","search:abc"]',
      output: '["null","null","true","true","true","true","false"]' },
    { input: '["WordDictionary","addWord:abc","search:a..","search:abc","search:...","search:...."]',
      output: '["null","null","true","true","true","false"]' },
    { input: '["WordDictionary","addWord:dog","addWord:cat","search:...","search:.at","search:do.","search:d.g"]',
      output: '["null","null","null","true","true","true","true"]' },
    { input: '["WordDictionary","addWord:hello","search:h.llo","search:.ello","search:hello","search:helloo"]',
      output: '["null","null","true","true","true","false"]' },
    { input: '["WordDictionary","addWord:a","addWord:ab","search:.","search:..","search:a","search:ab"]',
      output: '["null","null","null","true","true","true","true"]' },
    { input: '["WordDictionary","addWord:word","search:w.rd","search:....","search:word.","search:.or."]',
      output: '["null","null","true","true","false","true"]' },
    { input: '["WordDictionary","addWord:aaa","search:...","search:a.a","search:aaa","search:a..","search:..a"]',
      output: '["null","null","true","true","true","true","true"]' },
    { input: '["WordDictionary","addWord:at","addWord:and","addWord:an","addWord:add","search:a","search:.at","search:an.","search:a.d","search:b.."]',
      output: '["null","null","null","null","null","false","false","true","true","false"]' },
    { input: '["WordDictionary","addWord:abc","addWord:abcd","search:abc","search:abcd","search:ab.","search:abc.","search:...."]',
      output: '["null","null","null","true","true","true","false","true"]' },
    { input: '["WordDictionary","addWord:ran","addWord:ranen","search:.an","search:.anen","search:r..","search:r...."]',
      output: '["null","null","null","true","true","true","true"]' },
    { input: '["WordDictionary","addWord:bed","addWord:bad","addWord:bid","search:b.d","search:b..","search:...","search:bbd"]',
      output: '["null","null","null","null","true","true","true","false"]' },
    { input: '["WordDictionary","addWord:a","search:b","search:."]',
      output: '["null","null","false","true"]' },
    { input: '["WordDictionary","addWord:cat","search:cat","search:bat","search:c.t","search:...","search:...."]',
      output: '["null","null","true","false","true","true","false"]' },
  ],

  // -------------------------------------------------------------------------
  // 178. SUM ROOT TO LEAF NUMBERS
  // Input:  tree (int[]) — BFS level-order, null for missing node
  // Output: total sum of all root-to-leaf numbers (int)
  // -------------------------------------------------------------------------
  'sum-root-to-leaf-numbers': [
    { input: '[1,2,3]',                     output: '25'   },
    { input: '[4,9,0,5,1]',                 output: '1026' },
    { input: '[1]',                         output: '1'    },
    { input: '[0]',                         output: '0'    },
    { input: '[1,2]',                       output: '12'   },
    { input: '[1,null,2]',                  output: '12'   },
    { input: '[1,2,3,4]',                   output: '262'  },
    { input: '[1,2,3,4,5]',                 output: '262'  },
    { input: '[6,5,4]',                     output: '119'  },
    { input: '[1,2,3,null,null,4,5]',       output: '262'  },
    { input: '[9,1,null,null,2,null,4]',    output: '912'  },
    { input: '[0,1]',                       output: '1'    },
    { input: '[1,0,1]',                     output: '11'   },
    { input: '[3,9,20,null,null,15,7]',     output: '1369' },
    { input: '[1,2,3,4,5,6,7]',             output: '522'  },
    { input: '[5,3,6,1,4]',                 output: '533'  },
    { input: '[1,1,1]',                     output: '22'   },
    { input: '[9,9,9]',                     output: '198'  },
    { input: '[2,5,8]',                     output: '133'  },
    { input: '[1,2,null,3]',                output: '123'  },
  ],

  // -------------------------------------------------------------------------
  // 179. PATH SUM III
  // Input:  tree (int[]) — BFS level-order, null for missing \n targetSum (int)
  // Output: number of paths that sum to targetSum (int)
  // -------------------------------------------------------------------------
  'path-sum-iii': [
    { input: '[10,5,-3,3,2,null,11,3,-2,null,1]\n8',  output: '3' },
    { input: '[5,4,8,11,null,13,4,7,2,null,null,null,null,null,1]\n22', output: '3' },
    { input: '[1,null,2,null,3]\n3',                  output: '2' },
    { input: '[1]\n1',                                output: '1' },
    { input: '[1]\n0',                                output: '0' },
    { input: '[1,2]\n1',                              output: '1' },
    { input: '[1,2]\n2',                              output: '1' },
    { input: '[1,2]\n3',                              output: '1' },
    { input: '[1,2,3]\n3',                            output: '2' },
    { input: '[0,1,1]\n1',                            output: '4' },
    { input: '[3,3,null,4,2]\n6',                     output: '2' },
    { input: '[-2,null,-3]\n-5',                      output: '1' },
    { input: '[1,-2,-3,1,3,-2,null,-1]\n-1',          output: '4' },
    { input: '[1,2,3,4,5,6,7]\n7',                    output: '2' },
    { input: '[1,2,3,4,5,6,7]\n10',                   output: '1' },
    { input: '[5,4,8,11,null,13,4,7,2,null,null,5,1]\n22', output: '4' },
    { input: '[1,1,1,1,1,1,1]\n2',                    output: '6' },
    { input: '[1,null,2,null,3,null,4,null,5]\n3',    output: '3' },
    { input: '[4,null,3,null,2,null,1]\n3',           output: '2' },
    { input: '[0,1,1,2,2,2,2]\n4',                    output: '2' },
  ],

  // -------------------------------------------------------------------------
  // 180. MINIMUM NUMBER OF ARROWS TO BURST BALLOONS
  // Input:  points (int[][]) — [x_start, x_end]
  // Output: minimum arrows needed (int)
  // -------------------------------------------------------------------------
  'minimum-number-of-arrows-to-burst-balloons': [
    { input: '[[10,16],[2,8],[1,6],[7,12]]',         output: '2' },
    { input: '[[1,2],[3,4],[5,6],[7,8]]',            output: '4' },
    { input: '[[1,2],[2,3],[3,4],[4,5]]',            output: '2' },
    { input: '[[1,2]]',                              output: '1' },
    { input: '[[1,2],[1,2]]',                        output: '1' },
    { input: '[[1,2],[3,4]]',                        output: '2' },
    { input: '[[1,10],[3,8],[5,6]]',                 output: '1' },
    { input: '[[1,2],[3,5],[4,7],[8,12],[5,14],[9,20]]', output: '3' },
    { input: '[[-2147483646,-2147483645],[2147483646,2147483647]]', output: '2' },
    { input: '[[1,6],[2,8],[3,9],[4,10]]',           output: '1' },
    { input: '[[1,2],[2,3],[4,5],[5,6]]',            output: '2' },
    { input: '[[3,9],[7,12],[3,8],[6,8],[9,10],[2,9],[0,9],[3,9],[0,6],[2,8]]', output: '2' },
    { input: '[[1,5],[2,3],[4,6],[7,8]]',            output: '2' },
    { input: '[[0,0]]',                              output: '1' },
    { input: '[[1,4],[2,3]]',                        output: '1' },
    { input: '[[1,3],[2,6],[8,10],[15,18]]',         output: '3' },
    { input: '[[1,2],[3,6],[2,4],[5,8]]',            output: '2' },
    { input: '[[9,12],[1,10],[4,11],[8,12],[3,9],[6,9],[6,7]]', output: '2' },
    { input: '[[1,2],[2,4],[4,6],[6,8]]',            output: '2' },
    { input: '[[1,10],[2,9],[3,8],[4,7],[5,6]]',     output: '1' },
    { input: '[[1,3],[4,6],[7,9],[10,12],[2,5]]',    output: '3' },
    { input: '[[1,2],[1,3],[1,4],[1,5]]',            output: '1' },
    { input: '[[1,5],[5,10],[10,15]]',               output: '1' },
    { input: '[[1,5],[4,10],[9,15]]',                output: '2' },
    { input: '[[1,2],[3,4],[5,6],[7,8],[9,10]]',     output: '5' },
    { input: '[[1,3],[3,5],[5,7],[7,9]]',            output: '2' },
    { input: '[[2,3],[2,3]]',                        output: '1' },
    { input: '[[1,2],[3,4],[5,6]]',                  output: '3' },
    { input: '[[1,2],[1,3],[1,4]]',                  output: '1' },
    { input: '[[0,4],[4,8],[8,12]]',                 output: '1' },
  ],

  // -------------------------------------------------------------------------
  // 181. PERFECT SQUARES
  // Input:  n (int)
  // Output: minimum number of perfect squares that sum to n (int)
  // -------------------------------------------------------------------------
  'perfect-squares': [
    { input: '12',     output: '3' },
    { input: '13',     output: '2' },
    { input: '1',      output: '1' },
    { input: '2',      output: '2' },
    { input: '3',      output: '3' },
    { input: '4',      output: '1' },
    { input: '5',      output: '2' },
    { input: '6',      output: '3' },
    { input: '7',      output: '4' },
    { input: '8',      output: '2' },
    { input: '9',      output: '1' },
    { input: '10',     output: '2' },
    { input: '11',     output: '3' },
    { input: '14',     output: '3' },
    { input: '15',     output: '4' },
    { input: '16',     output: '1' },
    { input: '17',     output: '2' },
    { input: '18',     output: '2' },
    { input: '19',     output: '3' },
    { input: '20',     output: '2' },
    { input: '25',     output: '1' },
    { input: '36',     output: '1' },
    { input: '37',     output: '2' },
    { input: '48',     output: '3' },
    { input: '49',     output: '1' },
    { input: '50',     output: '2' },
    { input: '99',     output: '3' },
    { input: '100',    output: '1' },
    { input: '101',    output: '2' },
    { input: '167',    output: '4' },
    { input: '168',    output: '3' },
    { input: '200',    output: '2' },
    { input: '9999',   output: '4' },
    { input: '10000',  output: '1' },
  ],

  // -------------------------------------------------------------------------
  // 182. FIND PEAK ELEMENT
  // Input:  nums (int[])
  // Output: index of any peak element (int) — peak: nums[i] > neighbors
  //         (any valid peak accepted; we store the canonical index)
  // -------------------------------------------------------------------------
  'find-peak-element': [
    { input: '[1,2,3,1]',         output: '2' },
    { input: '[1,2,1,3,5,6,4]',   output: '5' },
    { input: '[1]',               output: '0' },
    { input: '[1,2]',             output: '1' },
    { input: '[2,1]',             output: '0' },
    { input: '[3,1,2]',           output: '0' },
    { input: '[1,3,2]',           output: '1' },
    { input: '[1,2,3]',           output: '2' },
    { input: '[3,2,1]',           output: '0' },
    { input: '[1,6,5,6,4]',       output: '3' },
    { input: '[5,4,3,2,1]',       output: '0' },
    { input: '[1,2,3,4,5]',       output: '4' },
    { input: '[1,2,1,2,1]',       output: '3' },
    { input: '[2,2,2,3,2]',       output: '3' },
    { input: '[1,3,2,1]',         output: '1' },
    { input: '[1,2,3,2,1]',       output: '2' },
    { input: '[4,3,2,1,5]',       output: '4' },
    { input: '[1,2,3,2,4]',       output: '4' },
    { input: '[6,5,4,3,2,3,4,5,6]', output: '8' },
    { input: '[1,5,1,5,1]',       output: '3' },
    { input: '[100]',             output: '0' },
    { input: '[1,100,2]',         output: '1' },
    { input: '[1,2,100,2,1]',     output: '2' },
    { input: '[3,2,3,2,3]',       output: '4' },
    { input: '[1,4,3,2,3,1]',     output: '1' },
    { input: '[0,1,0]',           output: '1' },
    { input: '[5,10,5]',          output: '1' },
    { input: '[1,2,3,4,5,4,3,2,1]', output: '4' },
    { input: '[2,1,2]',           output: '2' },
    { input: '[1,2,3,4,3,2,5,4]', output: '6' },
  ],

  // -------------------------------------------------------------------------
  // 183. MOVE ZEROES
  // Input:  nums (int[])
  // Output: nums after moving all 0s to end (int[])
  // -------------------------------------------------------------------------
  'move-zeroes': [
    { input: '[0,1,0,3,12]',     output: '[1,3,12,0,0]'       },
    { input: '[0]',              output: '[0]'                 },
    { input: '[1]',              output: '[1]'                 },
    { input: '[0,0,0]',          output: '[0,0,0]'             },
    { input: '[1,2,3]',          output: '[1,2,3]'             },
    { input: '[1,0,0,0]',        output: '[1,0,0,0]'           },
    { input: '[0,0,0,1]',        output: '[1,0,0,0]'           },
    { input: '[0,1,0,0,2]',      output: '[1,2,0,0,0]'         },
    { input: '[0,0,1]',          output: '[1,0,0]'             },
    { input: '[1,0,1,0,1]',      output: '[1,1,1,0,0]'         },
    { input: '[0,0,1,0,0,2,0,3]', output: '[1,2,3,0,0,0,0,0]' },
    { input: '[4,2,4,0,0,3,0,5,1,0]', output: '[4,2,4,3,5,1,0,0,0,0]' },
    { input: '[0,1]',            output: '[1,0]'               },
    { input: '[1,0]',            output: '[1,0]'               },
    { input: '[1,2,0,3,4]',      output: '[1,2,3,4,0]'         },
    { input: '[0,2,0,3,4]',      output: '[2,3,4,0,0]'         },
    { input: '[1,0,2,0,3,0,4]',  output: '[1,2,3,4,0,0,0]'     },
    { input: '[5,0,5]',          output: '[5,5,0]'             },
    { input: '[0,5,0]',          output: '[5,0,0]'             },
    { input: '[1,2,3,0]',        output: '[1,2,3,0]'           },
    { input: '[0,1,2,3]',        output: '[1,2,3,0]'           },
    { input: '[0,0]',            output: '[0,0]'               },
    { input: '[5,5,0,5]',        output: '[5,5,5,0]'           },
    { input: '[0,0,0,1,0,0]',    output: '[1,0,0,0,0,0]'       },
    { input: '[1,0,0,2,0,3]',    output: '[1,2,3,0,0,0]'       },
    { input: '[0,0,1,2,0,3,0,4]', output: '[1,2,3,4,0,0,0,0]' },
    { input: '[1]',              output: '[1]'                 },
    { input: '[0,0,0,0,1]',      output: '[1,0,0,0,0]'         },
    { input: '[2,0,0,0,3]',      output: '[2,3,0,0,0]'         },
    { input: '[1,2,3,4,5]',      output: '[1,2,3,4,5]'         },
  ],

  // -------------------------------------------------------------------------
  // 184. NON-OVERLAPPING INTERVALS
  // Input:  intervals (int[][]) — [start, end]
  // Output: minimum number of intervals to remove (int)
  // -------------------------------------------------------------------------
  'non-overlapping-intervals': [
    { input: '[[1,2],[2,3],[3,4],[1,3]]',         output: '1' },
    { input: '[[1,2],[1,2],[1,2]]',               output: '2' },
    { input: '[[1,2],[2,3]]',                     output: '0' },
    { input: '[[1,2],[2,3],[1,3]]',               output: '1' },
    { input: '[[1,100],[11,22],[1,11],[2,12]]',   output: '2' },
    { input: '[[0,2],[1,3],[2,4],[3,5],[4,6]]',   output: '2' },
    { input: '[[1,2]]',                           output: '0' },
    { input: '[[1,2],[3,4]]',                     output: '0' },
    { input: '[[1,2],[1,3],[1,4],[1,5]]',         output: '3' },
    { input: '[[1,5],[2,3],[3,5],[4,6]]',         output: '2' },
    { input: '[[-52,31],[-73,-26],[82,97],[-65,-11],[-62,-49],[95,99],[58,95]]', output: '1' },
    { input: '[[1,3],[2,4],[3,5],[4,6]]',         output: '2' },
    { input: '[[1,2],[2,3],[3,4]]',               output: '0' },
    { input: '[[0,1],[1,2],[2,3],[3,4],[4,5]]',   output: '0' },
    { input: '[[1,10],[2,3],[4,5],[6,7],[8,9]]',  output: '1' },
    { input: '[[0,2],[1,3],[1,2]]',               output: '1' },
    { input: '[[1,4],[2,3],[3,4]]',               output: '1' },
    { input: '[[0,13],[1,4],[4,12],[1,2],[2,3]]', output: '2' },
    { input: '[[1,20],[2,9],[10,15],[3,5],[14,20]]', output: '2' },
    { input: '[[1,2],[3,5],[6,7],[8,10],[2,9]]',  output: '1' },
    { input: '[[1,3],[1,3],[1,3]]',               output: '2' },
    { input: '[[1,100]]',                         output: '0' },
    { input: '[[1,3],[4,6]]',                     output: '0' },
    { input: '[[1,3],[2,4],[4,6]]',               output: '1' },
    { input: '[[0,1],[0,2],[1,2]]',               output: '1' },
    { input: '[[1,2],[2,3],[3,4],[4,5],[5,6]]',   output: '0' },
    { input: '[[1,2],[3,4],[2,3]]',               output: '0' },
    { input: '[[1,5],[2,3],[4,5]]',               output: '1' },
    { input: '[[2,4],[1,3]]',                     output: '1' },
    { input: '[[0,2],[1,4],[3,5]]',               output: '1' },
  ],

  // -------------------------------------------------------------------------
  // 185. MAXIMUM DEPTH OF BINARY TREE
  // Input:  tree (BFS level-order, null for missing nodes)
  // Output: maximum depth (int)
  // -------------------------------------------------------------------------
  'maximum-depth-of-binary-tree': [
    { input: '[3,9,20,null,null,15,7]',       output: '3' },
    { input: '[1,null,2]',                    output: '2' },
    { input: '[]',                            output: '0' },
    { input: '[1]',                           output: '1' },
    { input: '[1,2]',                         output: '2' },
    { input: '[1,null,2,null,null,null,3]',   output: '3' },
    { input: '[1,2,3,4,5]',                   output: '3' },
    { input: '[1,2,3,4,5,6,7]',               output: '3' },
    { input: '[1,2,3,null,null,4,null,null,5]', output: '4' },
    { input: '[0,null,null]',                 output: '1' },
    { input: '[1,2,null,3,null,4]',           output: '4' },
    { input: '[1,null,2,null,null,null,3,null,null,null,null,null,null,null,4]', output: '4' },
    { input: '[5,3,8,1,4,7,9]',               output: '3' },
    { input: '[1,2,3,4]',                     output: '3' },
    { input: '[1,2,3,null,5]',                output: '3' },
    { input: '[100]',                         output: '1' },
    { input: '[1,2,3,4,null,null,null,8]',    output: '4' },
    { input: '[1,2,null,3,null,4,null,5]',    output: '5' },
    { input: '[1,null,2,null,null,null,3,null,null,null,null,null,null,null,4,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,5]', output: '5' },
    { input: '[1,2,3,4,5,6,7,8,9,10]',       output: '4' },
    { input: '[-1]',                          output: '1' },
    { input: '[1,2,null,null,3]',             output: '3' },
    { input: '[1,null,2,null,null,null,3]',   output: '3' },
    { input: '[3,9,20,null,null,15,7,1,2]',   output: '4' },
    { input: '[2,1,3]',                       output: '2' },
  ],

  // -------------------------------------------------------------------------
  // 186. SAME TREE
  // Input:  p (BFS serialized) \n q (BFS serialized)
  // Output: "true" or "false"
  // -------------------------------------------------------------------------
  'same-tree': [
    { input: '[1,2,3]\n[1,2,3]',               output: 'true'  },
    { input: '[1,2]\n[1,null,2]',              output: 'false' },
    { input: '[1,2,1]\n[1,1,2]',              output: 'false' },
    { input: '[]\n[]',                         output: 'true'  },
    { input: '[1]\n[1]',                       output: 'true'  },
    { input: '[1]\n[2]',                       output: 'false' },
    { input: '[1]\n[]',                        output: 'false' },
    { input: '[]\n[1]',                        output: 'false' },
    { input: '[1,2,3,4,5]\n[1,2,3,4,5]',      output: 'true'  },
    { input: '[1,2,3,4,5]\n[1,2,3,4,6]',      output: 'false' },
    { input: '[1,2]\n[1,2]',                   output: 'true'  },
    { input: '[1,null,2]\n[1,null,2]',         output: 'true'  },
    { input: '[1,2,null]\n[1,null,2]',         output: 'false' },
    { input: '[3,9,20,null,null,15,7]\n[3,9,20,null,null,15,7]', output: 'true' },
    { input: '[3,9,20,null,null,15,7]\n[3,9,20,null,null,15,8]', output: 'false' },
    { input: '[1,2,3]\n[1,2]',                output: 'false' },
    { input: '[1,2]\n[1,2,3]',                output: 'false' },
    { input: '[0]\n[0]',                       output: 'true'  },
    { input: '[-1,null,2]\n[-1,null,2]',       output: 'true'  },
    { input: '[-1,null,2]\n[-1,null,3]',       output: 'false' },
    { input: '[1,2,3,4,5,6]\n[1,2,3,4,5,6]',  output: 'true'  },
    { input: '[1,2,3,4,5,6]\n[1,2,3,4,5,7]',  output: 'false' },
    { input: '[1,2,3]\n[1,3,2]',              output: 'false' },
    { input: '[10,5,15]\n[10,5,15]',           output: 'true'  },
    { input: '[10,5,15]\n[10,5,null]',         output: 'false' },
  ],

  // -------------------------------------------------------------------------
  // 187. INVERT BINARY TREE
  // Input:  tree (BFS serialized)
  // Output: inverted tree (BFS serialized)
  // -------------------------------------------------------------------------
  'invert-binary-tree': [
    { input: '[4,2,7,1,3,6,9]',               output: '[4,7,2,9,6,3,1]'             },
    { input: '[2,1,3]',                        output: '[2,3,1]'                      },
    { input: '[]',                             output: '[]'                           },
    { input: '[1]',                            output: '[1]'                          },
    { input: '[1,2]',                          output: '[1,null,2]'                   },
    { input: '[1,null,2]',                     output: '[1,2]'                        },
    { input: '[1,2,3]',                        output: '[1,3,2]'                      },
    { input: '[1,2,3,4,5,6,7]',               output: '[1,3,2,7,6,5,4]'             },
    { input: '[3,9,20,null,null,15,7]',        output: '[3,20,9,7,15]'               },
    { input: '[5]',                            output: '[5]'                          },
    { input: '[1,2,null,3]',                   output: '[1,null,2,null,3]'           },
    { input: '[1,null,2,null,null,null,3]',    output: '[1,2,null,3]'                },
    { input: '[7,3,8,1,5,null,null,null,null,4,6]', output: '[7,8,3,null,null,5,1,6,4]' },
    { input: '[1,2,3,4,null,null,5]',          output: '[1,3,2,5,null,null,4]'       },
    { input: '[10,5,15,3,7,13,20]',            output: '[10,15,5,20,13,7,3]'         },
    { input: '[1,2,3,4,5,6,7,8]',             output: '[1,3,2,7,6,5,4,null,null,null,null,null,null,null,8]' },
    { input: '[0,1,2]',                        output: '[0,2,1]'                      },
    { input: '[-1,-2,-3]',                     output: '[-1,-3,-2]'                   },
    { input: '[1,2,null,null,3]',              output: '[1,null,2,3]'                 },
    { input: '[6,2,8,0,4,7,9,null,null,3,5]', output: '[6,8,2,9,7,4,0,null,null,5,3]' },
  ],

  // -------------------------------------------------------------------------
  // 188. BINARY TREE MAXIMUM PATH SUM
  // Input:  tree (BFS serialized)
  // Output: maximum path sum (int)
  // -------------------------------------------------------------------------
  'binary-tree-maximum-path-sum': [
    { input: '[1,2,3]',                                   output: '6'   },
    { input: '[-10,9,20,null,null,15,7]',                 output: '42'  },
    { input: '[2,-1]',                                    output: '2'   },
    { input: '[-3]',                                      output: '-3'  },
    { input: '[1]',                                       output: '1'   },
    { input: '[5,4,8,11,null,13,4,7,2,null,null,null,1]', output: '48'  },
    { input: '[-10,-5,-3]',                               output: '-3'  },
    { input: '[1,-2]',                                    output: '1'   },
    { input: '[-2,1]',                                    output: '1'   },
    { input: '[1,2,null,3,null,4,null,5]',               output: '15'  },
    { input: '[9,6,-3,null,null,-6,2,null,null,2,null,-6,-6,-6]', output: '16' },
    { input: '[3,4,5,1,3,null,1]',                        output: '16'  },
    { input: '[0,1,1]',                                   output: '2'   },
    { input: '[100]',                                     output: '100' },
    { input: '[-1,-2,-3,-4,-5]',                          output: '-1'  },
    { input: '[1,2,3,4,5,6,7]',                           output: '18'  },
    { input: '[2,null,-1]',                               output: '2'   },
    { input: '[-1,null,-2]',                              output: '-1'  },
    { input: '[1,0,1]',                                   output: '2'   },
    { input: '[10,5,-3,3,2,null,11,3,-2,null,1]',        output: '19'  },
    { input: '[4,null,-2,null,null,null,-3]',             output: '4'   },
    { input: '[5,1,5]',                                   output: '11'  },
    { input: '[-1,5,null,-2]',                            output: '4'   },
    { input: '[20,5,-5,3,10,-10,5,1,-1]',                 output: '38'  },
    { input: '[15,7,3,null,null,null,-4]',                output: '25'  },
  ],

  // -------------------------------------------------------------------------
  // 189. BINARY TREE LEVEL ORDER TRAVERSAL
  // Input:  tree (BFS serialized)
  // Output: level-order values as int[][] (JSON string)
  // -------------------------------------------------------------------------
  'binary-tree-level-order-traversal': [
    { input: '[3,9,20,null,null,15,7]',           output: '[[3],[9,20],[15,7]]'                },
    { input: '[1]',                               output: '[[1]]'                              },
    { input: '[]',                                output: '[]'                                 },
    { input: '[1,2,3]',                           output: '[[1],[2,3]]'                        },
    { input: '[1,2,3,4,5]',                       output: '[[1],[2,3],[4,5]]'                  },
    { input: '[1,null,2,null,null,null,3]',        output: '[[1],[2],[3]]'                      },
    { input: '[1,2,3,4,5,6,7]',                   output: '[[1],[2,3],[4,5,6,7]]'              },
    { input: '[0]',                               output: '[[0]]'                              },
    { input: '[1,2]',                             output: '[[1],[2]]'                          },
    { input: '[1,null,2]',                        output: '[[1],[2]]'                          },
    { input: '[4,2,7,1,3,6,9]',                   output: '[[4],[2,7],[1,3,6,9]]'              },
    { input: '[1,2,3,4,null,null,5]',             output: '[[1],[2,3],[4,5]]'                  },
    { input: '[3,9,20,1,2,15,7]',                 output: '[[3],[9,20],[1,2,15,7]]'            },
    { input: '[1,null,null]',                     output: '[[1]]'                              },
    { input: '[5,4,8,11,null,13,4,7,2,null,null,5,1]', output: '[[5],[4,8],[11,13,4],[7,2,5,1]]' },
    { input: '[-1,null,2]',                       output: '[[-1],[2]]'                         },
    { input: '[10,5,15,3,7,13,20]',               output: '[[10],[5,15],[3,7,13,20]]'          },
    { input: '[1,2,3,null,4,null,5]',             output: '[[1],[2,3],[4,5]]'                  },
    { input: '[2,1,3]',                           output: '[[2],[1,3]]'                        },
    { input: '[1,2,null,3,null,4]',               output: '[[1],[2],[3],[4]]'                  },
    { input: '[6,2,8,0,4,7,9,null,null,3,5]',     output: '[[6],[2,8],[0,4,7,9],[3,5]]'        },
    { input: '[1,2,3,4,5,6,7,8,9,10]',            output: '[[1],[2,3],[4,5,6,7],[8,9,10]]'     },
    { input: '[1,null,2,null,null,null,3,null,null,null,null,null,null,null,4]', output: '[[1],[2],[3],[4]]' },
    { input: '[7,3,8,1,5]',                       output: '[[7],[3,8],[1,5]]'                  },
    { input: '[-10,9,20,null,null,15,7]',         output: '[[-10],[9,20],[15,7]]'              },
  ],

  // -------------------------------------------------------------------------
  // 190. SERIALIZE AND DESERIALIZE BINARY TREE
  // Input:  tree (BFS serialized string) — the round-trip must reproduce the original
  // Output: same BFS serialized string
  // -------------------------------------------------------------------------
  'serialize-and-deserialize-binary-tree': [
    { input: '[1,2,3,null,null,4,5]',             output: '[1,2,3,null,null,4,5]'       },
    { input: '[]',                                output: '[]'                           },
    { input: '[1]',                               output: '[1]'                          },
    { input: '[1,2]',                             output: '[1,2]'                        },
    { input: '[1,null,2]',                        output: '[1,null,2]'                   },
    { input: '[3,9,20,null,null,15,7]',           output: '[3,9,20,null,null,15,7]'      },
    { input: '[1,2,3,4,5,6,7]',                   output: '[1,2,3,4,5,6,7]'             },
    { input: '[4,2,7,1,3,6,9]',                   output: '[4,2,7,1,3,6,9]'             },
    { input: '[-10,9,20,null,null,15,7]',         output: '[-10,9,20,null,null,15,7]'   },
    { input: '[1,null,2,null,null,null,3]',        output: '[1,null,2,null,null,null,3]' },
    { input: '[5,4,8,11,null,13,4,7,2,null,null,null,1]', output: '[5,4,8,11,null,13,4,7,2,null,null,null,1]' },
    { input: '[100]',                             output: '[100]'                        },
    { input: '[1,2,3,4,null,null,5]',             output: '[1,2,3,4,null,null,5]'       },
    { input: '[6,2,8,0,4,7,9,null,null,3,5]',     output: '[6,2,8,0,4,7,9,null,null,3,5]' },
    { input: '[1,2,null,3,null,4,null,5]',        output: '[1,2,null,3,null,4,null,5]'  },
    { input: '[10,5,15,3,7,13,20]',               output: '[10,5,15,3,7,13,20]'         },
    { input: '[-3]',                              output: '[-3]'                         },
    { input: '[1,2,3,null,4,null,5]',             output: '[1,2,3,null,4,null,5]'       },
    { input: '[0,null,null]',                     output: '[0]'                          },
    { input: '[2,1,3,null,null,null,4]',          output: '[2,1,3,null,null,null,4]'    },
  ],

  // -------------------------------------------------------------------------
  // 191. SUBTREE OF ANOTHER TREE
  // Input:  root (BFS serialized) \n subRoot (BFS serialized)
  // Output: "true" or "false"
  // -------------------------------------------------------------------------
  'subtree-of-another-tree': [
    { input: '[3,4,5,1,2]\n[4,1,2]',              output: 'true'  },
    { input: '[3,4,5,1,2,null,null,null,null,0]\n[4,1,2]', output: 'false' },
    { input: '[1,1]\n[1]',                        output: 'true'  },
    { input: '[1]\n[1]',                          output: 'true'  },
    { input: '[1]\n[2]',                          output: 'false' },
    { input: '[1,2,3]\n[1,2,3]',                  output: 'true'  },
    { input: '[1,2,3]\n[2,3]',                    output: 'false' },
    { input: '[1,2,3]\n[3]',                      output: 'true'  },
    { input: '[1,2,3]\n[2]',                      output: 'true'  },
    { input: '[1,2,3,4]\n[2,4]',                  output: 'true'  },
    { input: '[1,2,3,4,5]\n[2,4,5]',              output: 'true'  },
    { input: '[1,2,3,4,5]\n[2,4]',                output: 'false' },
    { input: '[3,4,5,1,2]\n[3,1,2]',              output: 'false' },
    { input: '[12]\n[2]',                         output: 'false' },
    { input: '[1,1,1,1,1,1,1]\n[1,1,1]',          output: 'true'  },
    { input: '[4,1,2]\n[4,1,2]',                  output: 'true'  },
    { input: '[4,1,2]\n[1,2]',                    output: 'false' },
    { input: '[1,null,1,null,null,null,1]\n[1,null,1]', output: 'true' },
    { input: '[3,4,5,1,2]\n[5]',                  output: 'true'  },
    { input: '[1,2]\n[1,2]',                      output: 'true'  },
    { input: '[10,5,15,3,7,null,18]\n[5,3,7]',    output: 'true'  },
    { input: '[10,5,15,3,7,null,18]\n[15,null,18]', output: 'true' },
    { input: '[10,5,15,3,7,null,18]\n[5,4,7]',    output: 'false' },
    { input: '[2,1]\n[2,1]',                      output: 'true'  },
    { input: '[1,2,null,3]\n[2,null,3]',           output: 'true'  },
    { input: '[1,2,null,3]\n[2,3]',               output: 'false' },
  ],

  // -------------------------------------------------------------------------
  // 192. CONSTRUCT BINARY TREE FROM PREORDER AND INORDER TRAVERSAL
  // Input:  preorder (int[]) \n inorder (int[])
  // Output: tree (BFS serialized)
  // -------------------------------------------------------------------------
  'construct-binary-tree-from-preorder-and-inorder-traversal': [
    { input: '[3,9,20,15,7]\n[9,3,15,20,7]',      output: '[3,9,20,null,null,15,7]'    },
    { input: '[-1]\n[-1]',                         output: '[-1]'                        },
    { input: '[1,2,3]\n[2,1,3]',                   output: '[1,2,3]'                     },
    { input: '[1,2,3]\n[1,2,3]',                   output: '[1,null,2,null,null,null,3]' },
    { input: '[1,2,3]\n[3,2,1]',                   output: '[1,2,null,3]'                },
    { input: '[1]\n[1]',                           output: '[1]'                         },
    { input: '[4,2,1,3,6,5,7]\n[1,2,3,4,5,6,7]',  output: '[4,2,6,1,3,5,7]'            },
    { input: '[1,2,4,5,3,6,7]\n[4,2,5,1,6,3,7]',  output: '[1,2,3,4,5,6,7]'            },
    { input: '[3,1,2]\n[1,2,3]',                   output: '[3,1,null,null,2]'           },
    { input: '[1,2]\n[1,2]',                       output: '[1,null,2]'                  },
    { input: '[1,2]\n[2,1]',                       output: '[1,2]'                       },
    { input: '[5,3,1,4,8,7,9]\n[1,3,4,5,7,8,9]',  output: '[5,3,8,1,4,7,9]'            },
    { input: '[10,5,1,7,40,50]\n[1,5,7,10,40,50]', output: '[10,5,40,1,7,null,50]'      },
    { input: '[1,2,3,4]\n[4,2,1,3]',              output: '[1,2,3,4]'                   },
    { input: '[2,1,3]\n[1,2,3]',                   output: '[2,1,3]'                     },
  ],

  // -------------------------------------------------------------------------
  // 193. BINARY TREE RIGHT SIDE VIEW
  // Input:  tree (BFS serialized)
  // Output: right-side visible values from top to bottom (int[])
  // -------------------------------------------------------------------------
  'binary-tree-right-side-view': [
    { input: '[1,2,3,null,5,null,4]',             output: '[1,3,4]'       },
    { input: '[1,null,3]',                        output: '[1,3]'         },
    { input: '[]',                                output: '[]'            },
    { input: '[1]',                               output: '[1]'           },
    { input: '[1,2]',                             output: '[1,2]'         },
    { input: '[1,null,2]',                        output: '[1,2]'         },
    { input: '[1,2,3]',                           output: '[1,3]'         },
    { input: '[1,2,3,4]',                         output: '[1,3,4]'       },
    { input: '[1,2,3,4,5,6,7]',                   output: '[1,3,7]'       },
    { input: '[3,9,20,null,null,15,7]',           output: '[3,20,7]'      },
    { input: '[1,2,null,3,null,4]',               output: '[1,2,3,4]'     },
    { input: '[10,5,15,3,7,13,20]',               output: '[10,15,20]'    },
    { input: '[1,2,null,null,3,null,null]',       output: '[1,2,3]'       },
    { input: '[1,null,2,null,null,null,3]',        output: '[1,2,3]'       },
    { input: '[4,2,7,1,3,6,9]',                   output: '[4,7,9]'       },
    { input: '[5,4,8,11,null,13,4,7,2,null,null,null,1]', output: '[5,8,4,1]' },
    { input: '[1,2,3,null,4,null,null]',           output: '[1,3,4]'       },
    { input: '[-1,null,2]',                       output: '[-1,2]'        },
    { input: '[0,1,null,null,2]',                  output: '[0,1,2]'       },
    { input: '[1,2,3,4,null,null,5,null,null,null,null,null,null,6]', output: '[1,3,5,6]' },
  ],

  // -------------------------------------------------------------------------
  // 194. COUNT GOOD NODES IN BINARY TREE
  // Input:  tree (BFS serialized)
  // Output: count of good nodes (int) — good: value >= all ancestors
  // -------------------------------------------------------------------------
  'count-good-nodes-in-binary-tree': [
    { input: '[3,1,4,3,null,1,5]',               output: '4' },
    { input: '[3,3,null,4,2]',                   output: '3' },
    { input: '[1]',                              output: '1' },
    { input: '[]',                               output: '0' },
    { input: '[2,null,4,10,8,null,null,null,null,4]', output: '4' },
    { input: '[9,3,6,null,9,2,null]',            output: '4' },
    { input: '[1,2,3]',                          output: '3' },
    { input: '[5,5,5,5,5]',                      output: '5' },
    { input: '[3,1,4,3,null,1,5]',               output: '4' },
    { input: '[1,1,1,1,1,1,1]',                  output: '7' },
    { input: '[5,3,8,1,4,7,9]',                  output: '4' },
    { input: '[1,null,2,null,null,null,3]',       output: '3' },
    { input: '[1,null,2,null,null,null,1]',       output: '2' },
    { input: '[10,5,15,3,7,13,20]',              output: '4' },
    { input: '[2,1,3]',                          output: '2' },
    { input: '[3,2,4,3,null,null,null]',          output: '3' },
    { input: '[0,null,0]',                       output: '2' },
    { input: '[-1,-2,-3,-4,-5,-6,-7]',           output: '1' },
    { input: '[3,4,5]',                          output: '3' },
    { input: '[5,1,5,5,5,null,5]',               output: '5' },
  ],

  // -------------------------------------------------------------------------
  // 195. VALIDATE BINARY SEARCH TREE
  // Input:  tree (BFS serialized)
  // Output: "true" if valid BST, "false" otherwise
  // -------------------------------------------------------------------------
  'validate-binary-search-tree': [
    { input: '[2,1,3]',                          output: 'true'  },
    { input: '[5,1,4,null,null,3,6]',            output: 'false' },
    { input: '[1]',                              output: 'true'  },
    { input: '[]',                               output: 'true'  },
    { input: '[2,2,2]',                          output: 'false' },
    { input: '[1,null,1]',                       output: 'false' },
    { input: '[1,1]',                            output: 'false' },
    { input: '[5,4,6,null,null,3,7]',            output: 'false' },
    { input: '[3,1,5,null,2,4,6]',               output: 'false' },
    { input: '[10,5,15,null,null,6,20]',         output: 'false' },
    { input: '[10,5,15,null,null,12,20]',        output: 'true'  },
    { input: '[2,1,3,null,null,null,4]',         output: 'true'  },
    { input: '[3,1,5,null,4,null,null]',         output: 'false' },
    { input: '[5,3,7,2,4,6,8]',                 output: 'true'  },
    { input: '[5,3,7,2,6,4,8]',                 output: 'false' },
    { input: '[1,null,2]',                       output: 'true'  },
    { input: '[2,null,1]',                       output: 'false' },
    { input: '[100,50,150,25,75,125,175]',       output: 'true'  },
    { input: '[100,50,150,25,75,99,175]',        output: 'false' },
    { input: '[4,2,6,1,3,5,7]',                 output: 'true'  },
    { input: '[4,2,6,1,3,5,8,null,null,null,4]', output: 'false' },
    { input: '[1,null,null]',                    output: 'true'  },
    { input: '[0,-1,1]',                         output: 'true'  },
    { input: '[0,1,-1]',                         output: 'false' },
    { input: '[3,1,5,null,2,4,6]',               output: 'false' },
  ],

  // -------------------------------------------------------------------------
  // 196. KTH SMALLEST ELEMENT IN A BST
  // Input:  root (BFS serialized) \n k (int)
  // Output: kth smallest value (int)
  // -------------------------------------------------------------------------
  'kth-smallest-element-in-a-bst': [
    { input: '[3,1,4,null,2]\n1',                output: '1'  },
    { input: '[5,3,6,2,4,null,null,1]\n3',       output: '3'  },
    { input: '[1]\n1',                           output: '1'  },
    { input: '[2,1,3]\n1',                       output: '1'  },
    { input: '[2,1,3]\n2',                       output: '2'  },
    { input: '[2,1,3]\n3',                       output: '3'  },
    { input: '[5,3,7,2,4,6,8]\n1',               output: '2'  },
    { input: '[5,3,7,2,4,6,8]\n2',               output: '3'  },
    { input: '[5,3,7,2,4,6,8]\n4',               output: '5'  },
    { input: '[5,3,7,2,4,6,8]\n5',               output: '6'  },
    { input: '[5,3,7,2,4,6,8]\n7',               output: '8'  },
    { input: '[3,1,4,null,2]\n2',                output: '2'  },
    { input: '[3,1,4,null,2]\n3',                output: '3'  },
    { input: '[3,1,4,null,2]\n4',                output: '4'  },
    { input: '[4,2,6,1,3,5,7]\n1',               output: '1'  },
    { input: '[4,2,6,1,3,5,7]\n4',               output: '4'  },
    { input: '[4,2,6,1,3,5,7]\n7',               output: '7'  },
    { input: '[1,null,2]\n2',                    output: '2'  },
    { input: '[10,5,15,3,7,null,18]\n1',         output: '3'  },
    { input: '[10,5,15,3,7,null,18]\n4',         output: '10' },
    { input: '[10,5,15,3,7,null,18]\n5',         output: '15' },
    { input: '[10,5,15,3,7,null,18]\n6',         output: '18' },
    { input: '[100,50,150,25,75,125,175]\n4',    output: '100' },
    { input: '[100,50,150,25,75,125,175]\n1',    output: '25' },
    { input: '[100,50,150,25,75,125,175]\n7',    output: '175' },
  ],

  // -------------------------------------------------------------------------
  // 197. LOWEST COMMON ANCESTOR OF A BINARY SEARCH TREE
  // Input:  root (BFS serialized) \n p (value) \n q (value)
  // Output: LCA node value (int)
  // -------------------------------------------------------------------------
  'lowest-common-ancestor-of-a-bst': [
    { input: '[6,2,8,0,4,7,9,null,null,3,5]\n2\n8',  output: '6'  },
    { input: '[6,2,8,0,4,7,9,null,null,3,5]\n2\n4',  output: '2'  },
    { input: '[2,1]\n2\n1',                           output: '2'  },
    { input: '[1,null,2]\n1\n2',                      output: '1'  },
    { input: '[5,3,7,2,4,6,8]\n2\n8',                 output: '5'  },
    { input: '[5,3,7,2,4,6,8]\n2\n4',                 output: '3'  },
    { input: '[5,3,7,2,4,6,8]\n6\n8',                 output: '7'  },
    { input: '[5,3,7,2,4,6,8]\n3\n7',                 output: '5'  },
    { input: '[5,3,7,2,4,6,8]\n3\n4',                 output: '3'  },
    { input: '[10,5,15,3,7,null,18]\n5\n15',           output: '10' },
    { input: '[10,5,15,3,7,null,18]\n3\n7',            output: '5'  },
    { input: '[10,5,15,3,7,null,18]\n10\n18',          output: '10' },
    { input: '[4,2,6,1,3,5,7]\n1\n7',                  output: '4'  },
    { input: '[4,2,6,1,3,5,7]\n1\n3',                  output: '2'  },
    { input: '[4,2,6,1,3,5,7]\n5\n7',                  output: '6'  },
    { input: '[6,2,8,0,4,7,9,null,null,3,5]\n0\n5',   output: '2'  },
    { input: '[6,2,8,0,4,7,9,null,null,3,5]\n3\n9',   output: '8'  },
    { input: '[6,2,8,0,4,7,9,null,null,3,5]\n0\n4',   output: '2'  },
    { input: '[6,2,8,0,4,7,9,null,null,3,5]\n7\n9',   output: '8'  },
    { input: '[3,1,5]\n1\n5',                          output: '3'  },
    { input: '[3,1,5]\n1\n3',                          output: '3'  },
    { input: '[3,1,5]\n3\n5',                          output: '3'  },
    { input: '[2,1,3]\n1\n3',                           output: '2'  },
    { input: '[2,1,3]\n1\n2',                           output: '2'  },
    { input: '[2,1,3]\n2\n3',                           output: '2'  },
  ],

  // -------------------------------------------------------------------------
  // 198. NUMBER OF ISLANDS
  // Input:  grid (string[][]) — "1" land, "0" water
  // Output: count of islands (int)
  // -------------------------------------------------------------------------
  'number-of-islands': [
    { input: '[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', output: '1' },
    { input: '[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', output: '3' },
    { input: '[["1"]]',                                  output: '1' },
    { input: '[["0"]]',                                  output: '0' },
    { input: '[["1","0"],["0","1"]]',                    output: '2' },
    { input: '[["1","1"],["1","1"]]',                    output: '1' },
    { input: '[["1","1","1"],["0","1","0"],["1","1","1"]]', output: '1' },
    { input: '[["0","0","0"],["0","0","0"]]',            output: '0' },
    { input: '[["1","0","1"],["0","0","0"],["1","0","1"]]', output: '4' },
    { input: '[["1","0","0","1"],["0","0","0","0"],["1","0","0","1"]]', output: '4' },
    { input: '[["1","1","0"],["0","1","0"],["0","0","1"]]', output: '2' },
    { input: '[["0","1","0"],["1","0","1"],["0","1","0"]]', output: '4' },
    { input: '[["1","0","0","0","1"],["1","0","0","0","1"],["1","0","0","0","1"]]', output: '2' },
    { input: '[["1","1","1","0","0"],["0","0","1","0","1"],["0","0","0","0","1"]]', output: '2' },
    { input: '[["1"],["0"],["1"]]',                      output: '2' },
    { input: '[["1"],["1"],["1"]]',                      output: '1' },
    { input: '[["0"],["0"],["0"]]',                      output: '0' },
    { input: '[["1","0"],["1","0"]]',                    output: '1' },
    { input: '[["0","1"],["0","1"]]',                    output: '1' },
    { input: '[["1","1","1","1","1"]]',                  output: '1' },
    { input: '[["0","0","0","0","0"]]',                  output: '0' },
    { input: '[["1","0","1","0","1"]]',                  output: '3' },
    { input: '[["1","1","0","1","1"],["1","0","0","0","0"],["0","0","0","0","1"],["1","1","0","1","1"]]', output: '5' },
    { input: '[["1","1","1"],["1","0","1"],["1","1","1"]]', output: '1' },
    { input: '[["1","0","0"],["0","1","0"],["0","0","1"]]', output: '3' },
  ],

  // -------------------------------------------------------------------------
  // 199. CLONE GRAPH
  // Input:  adjList (int[][]) — 1-indexed neighbors
  // Output: same adjList (int[][])
  // -------------------------------------------------------------------------
  'clone-graph': [
    { input: '[[2,4],[1,3],[2,4],[1,3]]',          output: '[[2,4],[1,3],[2,4],[1,3]]'   },
    { input: '[[]]',                               output: '[[]]'                        },
    { input: '[]',                                 output: '[]'                          },
    { input: '[[2],[1,3],[2,4],[3]]',              output: '[[2],[1,3],[2,4],[3]]'       },
    { input: '[[2],[1]]',                          output: '[[2],[1]]'                   },
    { input: '[[2,3],[1,3],[1,2]]',                output: '[[2,3],[1,3],[1,2]]'         },
    { input: '[[2,3,4],[1,3],[1,2,4],[1,3]]',      output: '[[2,3,4],[1,3],[1,2,4],[1,3]]' },
    { input: '[[2],[1,3],[2]]',                    output: '[[2],[1,3],[2]]'             },
    { input: '[[2,4,5],[1,3],[2,4],[1,3,5],[1,4]]', output: '[[2,4,5],[1,3],[2,4],[1,3,5],[1,4]]' },
    { input: '[[2],[1,4],[4],[2,3]]',              output: '[[2],[1,4],[4],[2,3]]'       },
    { input: '[[2,3],[1],[1,4],[3]]',              output: '[[2,3],[1],[1,4],[3]]'       },
    { input: '[[2,5],[1,3],[2,4],[3,5],[1,4]]',    output: '[[2,5],[1,3],[2,4],[3,5],[1,4]]' },
    { input: '[[3],[3],[1,2]]',                    output: '[[3],[3],[1,2]]'             },
    { input: '[[2],[1,3],[4],[3,1]]',              output: '[[2],[1,3],[4],[3,1]]'       },
    { input: '[[2,3,4,5],[1],[1],[1],[1]]',        output: '[[2,3,4,5],[1],[1],[1],[1]]' },
  ],

  // -------------------------------------------------------------------------
  // 200. MAX AREA OF ISLAND
  // Input:  grid (int[][]) — 1 land, 0 water
  // Output: max island area (int)
  // -------------------------------------------------------------------------
  'max-area-of-island': [
    { input: '[[0,0,1,0,0,0,0,1,0,0,0,0,0],[0,0,0,0,0,0,0,1,1,1,0,0,0],[0,1,1,0,1,0,0,0,0,0,0,0,0],[0,1,0,0,1,1,0,0,1,0,1,0,0],[0,1,0,0,1,1,0,0,1,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,1,0,0],[0,0,0,0,0,0,0,1,1,1,0,0,0],[0,0,0,0,0,0,0,1,1,0,0,0,0]]', output: '6' },
    { input: '[[0,0,0,0,0,0,0,0]]',               output: '0' },
    { input: '[[1]]',                             output: '1' },
    { input: '[[0]]',                             output: '0' },
    { input: '[[1,1],[1,1]]',                     output: '4' },
    { input: '[[1,0],[0,1]]',                     output: '1' },
    { input: '[[1,1,0],[1,0,0],[0,0,1]]',         output: '3' },
    { input: '[[1,0,1],[0,0,0],[1,0,1]]',         output: '1' },
    { input: '[[1,1,1],[0,1,0],[0,1,0]]',         output: '5' },
    { input: '[[1,0,0],[0,1,0],[0,0,1]]',         output: '1' },
    { input: '[[1,1,0,0],[1,1,0,0],[0,0,1,1],[0,0,1,1]]', output: '4' },
    { input: '[[0,1,0],[1,0,1],[0,1,0]]',         output: '1' },
    { input: '[[1,1,1,1],[1,0,0,1],[1,0,0,1],[1,1,1,1]]', output: '12' },
    { input: '[[1,0,1,0,1]]',                     output: '1' },
    { input: '[[0,1,1,1,0],[1,1,0,1,1],[0,0,0,0,0]]', output: '6' },
    { input: '[[1],[1],[1],[1]]',                  output: '4' },
    { input: '[[0],[0],[0],[0]]',                  output: '0' },
    { input: '[[1,1,1],[1,1,1],[1,1,1]]',         output: '9' },
    { input: '[[1,0,0,1],[0,0,0,0],[1,0,0,1]]',   output: '1' },
    { input: '[[1,1,0,1,1],[1,0,0,0,1],[0,0,0,0,0],[1,0,0,0,1],[1,1,0,1,1]]', output: '4' },
  ],

  // -------------------------------------------------------------------------
  // 201. PACIFIC ATLANTIC WATER FLOW
  // Input:  heights (int[][])
  // Output: list of [r,c] cells that can flow to both oceans, sorted row then col
  // -------------------------------------------------------------------------
  'pacific-atlantic-water-flow': [
    { input: '[[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]',
      output: '[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]' },
    { input: '[[1]]',
      output: '[[0,0]]' },
    { input: '[[1,2],[2,1]]',
      output: '[[0,1],[1,0]]' },
    { input: '[[1,1],[1,1]]',
      output: '[[0,0],[0,1],[1,0],[1,1]]' },
    { input: '[[10,10,10],[10,1,10],[10,10,10]]',
      output: '[[0,0],[0,1],[0,2],[1,0],[1,2],[2,0],[2,1],[2,2]]' },
    { input: '[[3,3,3,3,3],[3,0,3,0,3],[3,3,3,3,3],[3,0,3,0,3],[3,3,3,3,3]]',
      output: '[[0,0],[0,1],[0,2],[0,3],[0,4],[1,0],[1,2],[1,4],[2,0],[2,1],[2,2],[2,3],[2,4],[3,0],[3,2],[3,4],[4,0],[4,1],[4,2],[4,3],[4,4]]' },
    { input: '[[1,2,3],[8,9,4],[7,6,5]]',
      output: '[[0,2],[1,0],[1,1],[1,2],[2,0]]' },
    { input: '[[1,2],[3,4]]',
      output: '[[0,1],[1,0],[1,1]]' },
    { input: '[[2,1],[1,2]]',
      output: '[[0,0],[0,1],[1,0],[1,1]]' },
    { input: '[[5,5,5],[5,1,5],[5,5,5]]',
      output: '[[0,0],[0,1],[0,2],[1,0],[1,2],[2,0],[2,1],[2,2]]' },
    { input: '[[1,2,3,4],[12,13,14,5],[11,16,15,6],[10,9,8,7]]',
      output: '[[0,3],[1,0],[1,1],[1,2],[1,3],[2,0],[2,1],[2,2],[2,3],[3,0]]' },
    { input: '[[1,1,1],[1,1,1],[1,1,1]]',
      output: '[[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2]]' },
    { input: '[[1]]',
      output: '[[0,0]]' },
    { input: '[[1,2,3,4,5]]',
      output: '[[0,4]]' },
    { input: '[[5],[4],[3],[2],[1]]',
      output: '[[0,0]]' },
  ],

  // -------------------------------------------------------------------------
  // 202. SURROUNDED REGIONS
  // Input:  board (string[][]) — "X" or "O"
  // Output: board after capturing surrounded regions (string[][])
  // -------------------------------------------------------------------------
  'surrounded-regions': [
    { input: '[["X","X","X","X"],["X","O","O","X"],["X","X","O","X"],["X","O","X","X"]]',
      output: '[["X","X","X","X"],["X","X","X","X"],["X","X","X","X"],["X","O","X","X"]]' },
    { input: '[["X"]]',
      output: '[["X"]]' },
    { input: '[["O"]]',
      output: '[["O"]]' },
    { input: '[["X","X"],["X","X"]]',
      output: '[["X","X"],["X","X"]]' },
    { input: '[["O","O"],["O","O"]]',
      output: '[["O","O"],["O","O"]]' },
    { input: '[["O","X","O","O","O","X"],["O","O","O","X","O","X"],["X","X","X","O","O","X"],["O","X","O","O","X","X"],["X","X","O","O","O","O"],["X","X","X","X","O","X"]]',
      output: '[["O","X","O","O","O","X"],["O","O","O","X","O","X"],["X","X","X","O","O","X"],["O","X","O","O","X","X"],["X","X","O","O","O","O"],["X","X","X","X","O","X"]]' },
    { input: '[["X","O","X"],["X","O","X"],["X","O","X"]]',
      output: '[["X","O","X"],["X","O","X"],["X","O","X"]]' },
    { input: '[["X","O","X"],["O","O","O"],["X","O","X"]]',
      output: '[["X","O","X"],["O","O","O"],["X","O","X"]]' },
    { input: '[["X","X","X"],["X","O","X"],["X","X","X"]]',
      output: '[["X","X","X"],["X","X","X"],["X","X","X"]]' },
    { input: '[["O","X","X"],["X","O","X"],["X","X","O"]]',
      output: '[["O","X","X"],["X","X","X"],["X","X","O"]]' },
    { input: '[["X","O"],["O","X"]]',
      output: '[["X","O"],["O","X"]]' },
    { input: '[["X","X","X","X"],["X","O","X","X"],["X","X","O","X"],["X","X","X","X"]]',
      output: '[["X","X","X","X"],["X","X","X","X"],["X","X","X","X"],["X","X","X","X"]]' },
    { input: '[["O","O","O"],["O","O","O"],["O","O","O"]]',
      output: '[["O","O","O"],["O","O","O"],["O","O","O"]]' },
    { input: '[["X","O","X","X"],["X","O","O","X"],["X","X","O","X"],["X","O","X","X"]]',
      output: '[["X","O","X","X"],["X","X","X","X"],["X","X","X","X"],["X","O","X","X"]]' },
    { input: '[["O","O","O","O","X","X"],["O","O","O","O","O","O"],["O","X","X","X","X","O"],["O","X","O","O","X","O"],["O","X","O","O","X","O"],["O","X","X","O","X","O"]]',
      output: '[["O","O","O","O","X","X"],["O","O","O","O","O","O"],["O","X","X","X","X","O"],["O","X","O","O","X","O"],["O","X","O","O","X","O"],["O","X","X","O","X","O"]]' },
    { input: '[["X","X","X"],["O","O","O"],["X","X","X"]]',
      output: '[["X","X","X"],["O","O","O"],["X","X","X"]]' },
  ],

  // -------------------------------------------------------------------------
  // 203. ROTTING ORANGES
  // Input:  grid (int[][]) — 0=empty, 1=fresh, 2=rotten
  // Output: minimum minutes for all fresh oranges to rot, or -1
  // -------------------------------------------------------------------------
  'rotting-oranges': [
    { input: '[[2,1,1],[1,1,0],[0,1,1]]',    output: '4'  },
    { input: '[[2,1,1],[0,1,1],[1,0,1]]',    output: '-1' },
    { input: '[[0,2]]',                      output: '0'  },
    { input: '[[1]]',                        output: '-1' },
    { input: '[[2]]',                        output: '0'  },
    { input: '[[0]]',                        output: '0'  },
    { input: '[[1,2]]',                      output: '1'  },
    { input: '[[2,1,1],[1,1,1],[0,1,2]]',    output: '2'  },
    { input: '[[2,2],[1,1],[0,0],[2,0]]',    output: '1'  },
    { input: '[[2,1,1],[1,1,1],[1,1,2]]',    output: '4'  },
    { input: '[[2,2,2],[2,0,2],[2,2,2]]',    output: '0'  },
    { input: '[[0,1,2],[0,1,2],[0,1,2]]',    output: '1'  },
    { input: '[[2,0,1,1],[1,0,1,2],[1,0,0,0]]', output: '-1' },
    { input: '[[1,1,1],[1,1,1],[1,1,1]]',    output: '-1' },
    { input: '[[2,2],[2,2]]',                output: '0'  },
    { input: '[[2,1],[1,1]]',                output: '2'  },
    { input: '[[1,1],[1,2]]',                output: '2'  },
    { input: '[[2,0,0],[0,0,0],[0,0,1]]',    output: '-1' },
    { input: '[[2,1,0,1,2]]',               output: '1'  },
    { input: '[[2,1,0,0,2]]',               output: '-1' },
    { input: '[[0,1,0],[0,1,0],[2,1,0]]',   output: '2'  },
    { input: '[[2,1,1],[0,0,1],[0,0,1]]',   output: '4'  },
    { input: '[[0,0,0],[0,0,0],[0,0,0]]',   output: '0'  },
    { input: '[[2,2,2,1,1]]',               output: '2'  },
    { input: '[[1,2,1]]',                   output: '1'  },
  ],

  // -------------------------------------------------------------------------
  // 204. WALLS AND GATES
  // Input:  rooms (int[][]) — INF=2147483647, -1=wall, 0=gate
  // Output: rooms filled with distances (int[][])
  // -------------------------------------------------------------------------
  'walls-and-gates': [
    { input: '[[2147483647,-1,0,2147483647],[2147483647,2147483647,2147483647,-1],[2147483647,-1,2147483647,-1],[0,-1,2147483647,2147483647]]',
      output: '[[3,-1,0,1],[2,2,1,-1],[1,-1,2,-1],[0,-1,3,4]]' },
    { input: '[[0,-1],[2147483647,2147483647]]',
      output: '[[0,-1],[1,2]]' },
    { input: '[[-1]]',
      output: '[[-1]]' },
    { input: '[[0]]',
      output: '[[0]]' },
    { input: '[[2147483647]]',
      output: '[[2147483647]]' },
    { input: '[[0,2147483647,2147483647],[2147483647,2147483647,2147483647],[2147483647,2147483647,0]]',
      output: '[[0,1,2],[1,2,1],[2,1,0]]' },
    { input: '[[0,0,0],[0,0,0],[0,0,0]]',
      output: '[[0,0,0],[0,0,0],[0,0,0]]' },
    { input: '[[-1,-1,-1],[-1,2147483647,-1],[-1,-1,-1]]',
      output: '[[-1,-1,-1],[-1,2147483647,-1],[-1,-1,-1]]' },
    { input: '[[0,2147483647],[2147483647,2147483647]]',
      output: '[[0,1],[1,2]]' },
    { input: '[[2147483647,2147483647,2147483647],[2147483647,0,2147483647],[2147483647,2147483647,2147483647]]',
      output: '[[2,1,2],[1,0,1],[2,1,2]]' },
    { input: '[[2147483647,-1,0],[2147483647,2147483647,2147483647],[0,-1,2147483647]]',
      output: '[[2147483647,-1,0],[1,2,1],[0,-1,2]]' },
    { input: '[[0,-1,0],[-1,2147483647,-1],[0,-1,0]]',
      output: '[[0,-1,0],[-1,2147483647,-1],[0,-1,0]]' },
    { input: '[[2147483647,2147483647,2147483647,0]]',
      output: '[[3,2,1,0]]' },
    { input: '[[0,2147483647,2147483647,2147483647]]',
      output: '[[0,1,2,3]]' },
    { input: '[[0,2147483647],[2147483647,-1]]',
      output: '[[0,1],[1,-1]]' },
  ],

  // -------------------------------------------------------------------------
  // 205. REDUNDANT CONNECTION
  // Input:  edges (int[][]) — 1-indexed undirected graph with one extra edge
  // Output: the redundant edge that forms a cycle (int[])
  // -------------------------------------------------------------------------
  'redundant-connection': [
    { input: '[[1,2],[1,3],[2,3]]',           output: '[2,3]' },
    { input: '[[1,2],[2,3],[3,4],[1,4],[1,5]]', output: '[1,4]' },
    { input: '[[1,2],[2,3],[1,3]]',           output: '[1,3]' },
    { input: '[[3,4],[1,2],[2,4],[3,5],[2,5]]', output: '[2,5]' },
    { input: '[[1,2],[1,3],[1,4],[3,4]]',     output: '[3,4]' },
    { input: '[[1,2],[2,3],[3,1]]',           output: '[3,1]' },
    { input: '[[1,2],[2,3],[3,4],[4,5],[5,3]]', output: '[5,3]' },
    { input: '[[1,4],[3,4],[1,3],[1,2],[4,5]]', output: '[1,3]' },
    { input: '[[2,3],[3,4],[1,2],[1,4]]',     output: '[1,4]' },
    { input: '[[1,2],[1,3],[2,4],[3,5],[4,5]]', output: '[4,5]' },
    { input: '[[1,2]]',                       output: '' },
    { input: '[[1,2],[2,3],[2,4],[4,5],[3,5]]', output: '[3,5]' },
    { input: '[[1,3],[3,5],[5,7],[2,4],[4,6],[6,7]]', output: '[6,7]' },
    { input: '[[1,2],[3,4],[2,3],[1,4]]',     output: '[1,4]' },
    { input: '[[1,2],[1,3],[3,4],[2,4]]',     output: '[2,4]' },
    { input: '[[1,5],[3,4],[3,5],[4,5],[2,4]]', output: '[4,5]' },
    { input: '[[1,2],[2,3],[3,4],[4,1],[1,5]]', output: '[4,1]' },
    { input: '[[1,2],[3,4],[4,5],[3,5],[1,3]]', output: '[3,5]' },
    { input: '[[1,2],[2,3],[3,4],[4,5],[5,1]]', output: '[5,1]' },
    { input: '[[1,2],[2,3],[3,4],[4,2]]',     output: '[4,2]' },
    { input: '[[1,3],[2,3],[2,4],[3,4]]',     output: '[3,4]' },
    { input: '[[1,2],[1,3],[2,4],[3,4],[5,4]]', output: '[3,4]' },
    { input: '[[1,2],[2,4],[4,3],[3,2]]',     output: '[3,2]' },
    { input: '[[2,4],[1,4],[3,4],[1,3],[1,2]]', output: '[1,3]' },
    { input: '[[1,2],[2,3],[3,1]]',           output: '[3,1]' },
  ],

  // -------------------------------------------------------------------------
  // 206. NUMBER OF CONNECTED COMPONENTS IN AN UNDIRECTED GRAPH
  // Input:  n (int) \n edges (int[][])
  // Output: number of connected components (int)
  // -------------------------------------------------------------------------
  'number-of-connected-components-in-an-undirected-graph': [
    { input: '5\n[[0,1],[1,2],[3,4]]',        output: '2' },
    { input: '5\n[[0,1],[1,2],[2,3],[3,4]]',  output: '1' },
    { input: '1\n[]',                         output: '1' },
    { input: '3\n[]',                         output: '3' },
    { input: '3\n[[0,1],[1,2]]',              output: '1' },
    { input: '3\n[[0,1]]',                    output: '2' },
    { input: '4\n[[0,1],[2,3]]',              output: '2' },
    { input: '4\n[[0,1],[0,2],[0,3]]',        output: '1' },
    { input: '5\n[[0,1],[2,4],[3,4]]',        output: '2' },
    { input: '6\n[[0,1],[2,3],[4,5]]',        output: '3' },
    { input: '5\n[]',                         output: '5' },
    { input: '2\n[[0,1]]',                    output: '1' },
    { input: '2\n[]',                         output: '2' },
    { input: '4\n[[0,1],[1,2],[2,3]]',        output: '1' },
    { input: '4\n[[0,3],[1,2]]',              output: '2' },
    { input: '6\n[[0,1],[1,2],[2,3],[4,5]]',  output: '2' },
    { input: '5\n[[0,1],[1,2],[0,2],[3,4]]',  output: '2' },
    { input: '7\n[[0,1],[2,3],[4,5]]',        output: '4' },
    { input: '4\n[[0,1],[2,3],[0,2]]',        output: '1' },
    { input: '5\n[[0,1],[1,2],[3,4],[2,3]]',  output: '1' },
    { input: '5\n[[0,2],[1,4]]',              output: '3' },
    { input: '3\n[[0,2]]',                    output: '2' },
    { input: '6\n[[0,1],[0,2],[1,2],[4,5]]',  output: '3' },
    { input: '5\n[[0,1],[0,2],[0,3],[0,4]]',  output: '1' },
    { input: '8\n[[0,1],[2,3],[4,5],[6,7]]',  output: '4' },
  ],

  // -------------------------------------------------------------------------
  // 207. WORD LADDER
  // Input:  beginWord (string) \n endWord (string) \n wordList (string[])
  // Output: length of shortest transformation sequence, or 0 if none (int)
  // -------------------------------------------------------------------------
  'word-ladder': [
    { input: '"hit"\n"cog"\n["hot","dot","dog","lot","log","cog"]',  output: '5' },
    { input: '"hit"\n"cog"\n["hot","dot","dog","lot","log"]',        output: '0' },
    { input: '"a"\n"c"\n["a","b","c"]',                             output: '2' },
    { input: '"hot"\n"dog"\n["hot","dog"]',                         output: '0' },
    { input: '"hot"\n"dog"\n["hot","dog","dot"]',                   output: '3' },
    { input: '"cat"\n"dog"\n["cat","bat","bag","dag","dag","dog"]',  output: '4' },
    { input: '"lost"\n"miss"\n["most","mist","miss","lost","fist","fish"]', output: '4' },
    { input: '"abc"\n"def"\n["abc","aef","def"]',                   output: '0' },
    { input: '"ab"\n"cd"\n["ab","ac","bc","bd","cd"]',              output: '3' },
    { input: '"qa"\n"sq"\n["si","go","se","cm","so","ph","mt","db","mb","sb","kr","ln","tm","le","av","sm","ar","ci","ca","br","ti","ba","to","ra","fa","yo","ow","sn","ya","cr","po","fe","ho","ma","re","or","rn","au","ur","rh","sr","tc","lt","lo","as","fr","nb","yb","if","pb","ge","th","pm","rb","sh","co","ga","li","ha","hz","no","bi","di","hi","qa","sq"]', output: '5' },
    { input: '"hot"\n"hot"\n["hot"]',                               output: '1' },
    { input: '"abc"\n"abc"\n["abc"]',                               output: '1' },
    { input: '"a"\n"b"\n["a","b"]',                                 output: '2' },
    { input: '"hit"\n"hit"\n["hit","hot","dot","dog","lot","log","cog"]', output: '1' },
    { input: '"game"\n"thee"\n["frye","heat","tree","thee","game","free","hell","fame","faye"]', output: '7' },
  ],

  // -------------------------------------------------------------------------
  // 208. NETWORK DELAY TIME
  // Input:  times (int[][]) — [u,v,w] \n n (int) \n k (int)
  // Output: minimum time for all n nodes to receive signal, or -1 (int)
  // -------------------------------------------------------------------------
  'network-delay-time': [
    { input: '[[2,1,1],[2,3,1],[3,4,1]]\n4\n2',  output: '2'  },
    { input: '[[1,2,1]]\n2\n1',                  output: '1'  },
    { input: '[[1,2,1]]\n2\n2',                  output: '-1' },
    { input: '[[1,2,1],[2,3,2],[1,3,4]]\n3\n1',  output: '3'  },
    { input: '[[1,2,1],[2,1,3]]\n2\n2',          output: '3'  },
    { input: '[[1,2,1],[1,3,2],[2,4,3],[3,4,1]]\n4\n1', output: '3' },
    { input: '[[1,2,1],[2,3,1],[3,1,1]]\n3\n1',  output: '2'  },
    { input: '[[1,2,1]]\n1\n1',                  output: '0'  },
    { input: '[[2,1,1],[2,3,1],[3,4,1]]\n4\n1',  output: '-1' },
    { input: '[[1,2,1],[2,3,1],[1,3,4],[3,4,1]]\n4\n1', output: '3' },
    { input: '[[1,2,9],[1,3,3],[3,2,5]]\n3\n1',  output: '8'  },
    { input: '[[1,2,1],[2,3,1],[3,4,1],[4,5,1]]\n5\n1', output: '4' },
    { input: '[[1,2,3],[1,3,8],[2,3,1]]\n3\n1',  output: '4'  },
    { input: '[[1,2,1],[1,3,10],[2,3,1]]\n3\n1', output: '2'  },
    { input: '[[1,2,1],[2,3,7],[1,3,4],[2,4,2],[3,4,3]]\n4\n1', output: '4' },
    { input: '[[1,2,2],[2,3,2],[3,4,2],[4,1,2]]\n4\n1', output: '6' },
    { input: '[[1,2,1],[1,3,1],[1,4,1]]\n4\n1',  output: '1'  },
    { input: '[[4,2,76],[1,3,79],[3,1,81],[4,3,30],[2,1,47],[1,5,61],[1,4,99],[3,5,11],[3,2,89],[5,3,31],[2,3,43],[5,4,65]]\n5\n3', output: '100' },
    { input: '[[1,2,1],[2,3,1],[3,4,1],[2,4,5]]\n4\n1', output: '3' },
    { input: '[[1,2,9],[1,3,2],[3,2,4]]\n3\n1',  output: '6'  },
  ],

  // -------------------------------------------------------------------------
  // 209. SWIM IN RISING WATER
  // Input:  grid (int[][]) — permutation of 0..n²-1
  // Output: minimum time t such that there is a path from (0,0) to (n-1,n-1)
  // -------------------------------------------------------------------------
  'swim-in-rising-water': [
    { input: '[[0,2],[1,3]]',                                    output: '3'  },
    { input: '[[0,1,2,3,4],[24,23,22,21,5],[12,13,14,15,16],[11,17,18,19,20],[10,9,8,7,6]]', output: '16' },
    { input: '[[0]]',                                            output: '0'  },
    { input: '[[0,1],[2,3]]',                                    output: '3'  },
    { input: '[[3,2],[0,1]]',                                    output: '3'  },
    { input: '[[2,1],[0,3]]',                                    output: '3'  },
    { input: '[[1,0],[2,3]]',                                    output: '3'  },
    { input: '[[0,3],[1,2]]',                                    output: '3'  },
    { input: '[[0,1,2],[3,4,5],[6,7,8]]',                        output: '8'  },
    { input: '[[8,7,6],[5,4,3],[0,1,2]]',                        output: '8'  },
    { input: '[[0,2,4],[1,5,3],[6,7,8]]',                        output: '8'  },
    { input: '[[0,4,2],[3,1,5],[6,7,8]]',                        output: '8'  },
    { input: '[[10,12,4,6],[9,11,3,5],[7,8,1,0],[13,14,15,2]]',  output: '14' },
    { input: '[[0,1,2,3],[4,5,6,7],[8,9,10,11],[12,13,14,15]]',  output: '15' },
    { input: '[[3,0],[1,2]]',                                    output: '3'  },
    { input: '[[0,1,3,2],[7,4,5,6],[8,9,10,11],[12,13,14,15]]',  output: '15' },
    { input: '[[2,0],[1,3]]',                                    output: '3'  },
    { input: '[[4,0,2,3],[1,6,5,7],[8,9,10,11],[12,13,14,15]]',  output: '15' },
    { input: '[[0,2,4,6],[1,3,5,7],[8,10,12,14],[9,11,13,15]]',  output: '15' },
    { input: '[[0,15],[14,1]]',                                  output: '14' },
  ],

  // -------------------------------------------------------------------------
  // 210. TOP K FREQUENT WORDS
  // Input:  words (string[]) \n k (int)
  // Output: k most frequent words, sorted by frequency desc then lex asc (string[])
  // -------------------------------------------------------------------------
  'top-k-frequent-words': [
    { input: '["i","love","leetcode","i","love","coding"]\n2',
      output: '["i","love"]' },
    { input: '["the","day","is","sunny","the","the","the","sunny","is","is"]\n4',
      output: '["the","is","sunny","day"]' },
    { input: '["a","b","a"]\n1',
      output: '["a"]' },
    { input: '["a"]\n1',
      output: '["a"]' },
    { input: '["a","b","c","a","b","a"]\n2',
      output: '["a","b"]' },
    { input: '["a","b","c","a","b","a"]\n3',
      output: '["a","b","c"]' },
    { input: '["aa","aa","bb","bb","cc"]\n2',
      output: '["aa","bb"]' },
    { input: '["aa","aa","bb","bb","cc"]\n3',
      output: '["aa","bb","cc"]' },
    { input: '["a","a","a","b","b","c"]\n1',
      output: '["a"]' },
    { input: '["a","a","a","b","b","c"]\n2',
      output: '["a","b"]' },
    { input: '["apple","banana","apple","cherry","banana","apple"]\n2',
      output: '["apple","banana"]' },
    { input: '["i","love","coding","i","love","i"]\n3',
      output: '["i","love","coding"]' },
    { input: '["grapefruit","melon","apple","melon","apple","melon"]\n2',
      output: '["melon","apple"]' },
    { input: '["a","b","c","d"]\n4',
      output: '["a","b","c","d"]' },
    { input: '["hello","world","hello"]\n1',
      output: '["hello"]' },
    { input: '["hello","world","hello"]\n2',
      output: '["hello","world"]' },
    { input: '["b","a","b","c","a","c"]\n2',
      output: '["a","b"]' },
    { input: '["word","word","word","word","z","a","a","b"]\n3',
      output: '["word","a","b"]' },
    { input: '["yes","no","yes","no","yes"]\n1',
      output: '["yes"]' },
    { input: '["z","b","a","z","b","a","z"]\n2',
      output: '["z","a"]' },
  ],

  // -------------------------------------------------------------------------
  // 211. TASK SCHEDULER
  // Input:  tasks (string[]) \n n (int)
  // Output: minimum number of intervals (int)
  // -------------------------------------------------------------------------
  'task-scheduler': [
    { input: '["A","A","A","B","B","B"]\n2',                     output: '8'  },
    { input: '["A","C","A","B","D","B"]\n1',                     output: '6'  },
    { input: '["A","A","A","B","B","B"]\n3',                     output: '10' },
    { input: '["A","A","A"]\n2',                                  output: '7'  },
    { input: '["A","B","C","D","E","F"]\n0',                     output: '6'  },
    { input: '["A","B","C","D","E","F"]\n2',                     output: '6'  },
    { input: '["A","A","A","B","B","B","C","C","C","D","D","E"]\n2', output: '12' },
    { input: '["A"]\n0',                                          output: '1'  },
    { input: '["A"]\n100',                                        output: '1'  },
    { input: '["A","A"]\n2',                                      output: '3'  },
    { input: '["A","A","A","A"]\n2',                              output: '10' },
    { input: '["A","A","B","B"]\n0',                              output: '4'  },
    { input: '["A","A","B","B"]\n2',                              output: '5'  },
    { input: '["A","A","A","B","B","B","C","C"]\n2',              output: '8'  },
    { input: '["A","A","A","A","A","A","B","C","D","E","F","G"]\n2', output: '16' },
    { input: '["A","B","A","B","A","B","A","B"]\n2',              output: '8'  },
    { input: '["A","A","A","A","B","B","B","C","C","D"]\n2',      output: '10' },
    { input: '["A","A","A","B","B","B","C","C","C"]\n1',          output: '9'  },
    { input: '["A","A","A","B","B","B","C","C","C"]\n0',          output: '9'  },
    { input: '["A","A","A","B","B","B","C","C","C"]\n3',          output: '12' },
    { input: '["A","A","B","B","C","C"]\n2',                      output: '6'  },
    { input: '["A","A","A","A","B","B","B","B","C","C"]\n3',      output: '13' },
    { input: '["A","A","B","B","C","C","D"]\n2',                  output: '7'  },
    { input: '["A","A","A"]\n0',                                  output: '3'  },
    { input: '["A","A","A","A","A"]\n1',                          output: '9'  },
  ],

  // -------------------------------------------------------------------------
  // 212. FIND THE DUPLICATE NUMBER
  // Input:  nums (int[]) — n+1 integers in [1,n]
  // Output: the duplicate number (int)
  // -------------------------------------------------------------------------
  'find-the-duplicate-number': [
    { input: '[1,3,4,2,2]',            output: '2' },
    { input: '[3,1,3,4,2]',            output: '3' },
    { input: '[1,1]',                  output: '1' },
    { input: '[1,1,2]',               output: '1' },
    { input: '[2,2,2,2,2]',           output: '2' },
    { input: '[1,2,3,4,5,6,6]',       output: '6' },
    { input: '[1,2,3,4,4]',           output: '4' },
    { input: '[1,2,3,3,4,5]',         output: '3' },
    { input: '[2,1,2,3,4]',           output: '2' },
    { input: '[3,1,2,3]',             output: '3' },
    { input: '[1,2,2,3]',             output: '2' },
    { input: '[3,3,3,3,3]',           output: '3' },
    { input: '[4,1,4,2,3]',           output: '4' },
    { input: '[5,4,3,2,1,5]',         output: '5' },
    { input: '[1,2,3,4,5,5]',         output: '5' },
    { input: '[2,5,9,6,9,3,8,9,7,1]', output: '9' },
    { input: '[1,2,3,4,2,5,6]',       output: '2' },
    { input: '[3,1,5,2,5,4]',         output: '5' },
    { input: '[1,4,4,2,3]',           output: '4' },
    { input: '[4,2,1,3,1]',           output: '1' },
    { input: '[2,2,1]',               output: '2' },
    { input: '[6,6,1,2,3,4,5]',       output: '6' },
    { input: '[1,2,3,1,4,5,6]',       output: '1' },
    { input: '[5,1,4,3,2,5]',         output: '5' },
    { input: '[2,6,4,1,3,1,5]',       output: '1' },
  ],

  // -------------------------------------------------------------------------
  // 213. MEETING ROOMS II  (already seeded — alias keeping for re-runs)
  //      Skipped if already present.
  // -------------------------------------------------------------------------

  // -------------------------------------------------------------------------
  // 214. ALIEN DICTIONARY
  // Input:  words (string[]) — sorted according to alien language rules
  // Output: characters in alien order (string), or "" if invalid
  // -------------------------------------------------------------------------
  'alien-dictionary': [
    { input: '["wrt","wrf","er","ett","rftt"]',  output: '"wertf"' },
    { input: '["z","x"]',                        output: '"zx"'    },
    { input: '["z","x","z"]',                    output: '""'      },
    { input: '["ab","adc"]',                     output: '"abdc"'  },
    { input: '["a"]',                            output: '"a"'     },
    { input: '["abc","ab"]',                     output: '""'      },
    { input: '["z","z"]',                        output: '"z"'     },
    { input: '["abc","bcd","cde"]',              output: '"abcde"' },
    { input: '["ba","bc","ac","acb"]',           output: '"bacd"'  },
    { input: '["zy","zx"]',                      output: '"zyx"'   },
    { input: '["za","zb","ca","cb"]',            output: '"zabc"'  },
    { input: '["abc","abc"]',                    output: '"abc"'   },
    { input: '["a","b","c"]',                    output: '"abc"'   },
    { input: '["baa","abcd","abca","cab","cad"]', output: '"bdac"' },
    { input: '["edcba"]',                        output: '"edcba"' },
    { input: '["a","b","a"]',                    output: '""'      },
    { input: '["ab","cd","ef"]',                 output: '"acefbd"' },
    { input: '["ac","ab","b"]',                  output: '"cab"'  },
    { input: '["abc","bca"]',                    output: '"abc"'  },
    { input: '["x","x"]',                        output: '"x"'   },
  ],

  // -------------------------------------------------------------------------
  // 215. CHEAPEST FLIGHTS WITHIN K STOPS
  // Input:  n (int) \n flights (int[][]) \n src (int) \n dst (int) \n k (int)
  // Output: cheapest price, or -1 (int)
  // -------------------------------------------------------------------------
  'cheapest-flights-within-k-stops': [
    { input: '4\n[[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]]\n0\n3\n1', output: '700'  },
    { input: '3\n[[0,1,100],[1,2,100],[0,2,500]]\n0\n2\n1',                     output: '200'  },
    { input: '3\n[[0,1,100],[1,2,100],[0,2,500]]\n0\n2\n0',                     output: '500'  },
    { input: '5\n[[0,1,5],[1,2,5],[0,3,2],[3,1,2],[1,4,1],[4,2,1]]\n0\n2\n2',  output: '7'    },
    { input: '4\n[[0,1,1],[0,2,5],[1,2,1],[2,3,1]]\n0\n3\n1',                  output: '6'    },
    { input: '3\n[[0,1,100],[1,2,100],[0,2,500]]\n0\n2\n2',                    output: '200'  },
    { input: '4\n[[0,1,100],[1,2,100],[2,3,100],[0,3,700]]\n0\n3\n0',          output: '700'  },
    { input: '4\n[[0,1,100],[1,2,100],[2,3,100],[0,3,700]]\n0\n3\n1',          output: '700'  },
    { input: '4\n[[0,1,100],[1,2,100],[2,3,100],[0,3,700]]\n0\n3\n2',          output: '300'  },
    { input: '2\n[[0,1,100]]\n0\n1\n0',                                        output: '100'  },
    { input: '2\n[[0,1,100]]\n1\n0\n0',                                        output: '-1'   },
    { input: '3\n[[0,1,100],[1,2,100]]\n0\n2\n0',                              output: '-1'   },
    { input: '3\n[[0,1,100],[1,2,100]]\n0\n2\n1',                              output: '200'  },
    { input: '4\n[[0,1,1],[0,2,5],[1,2,1],[2,3,1]]\n0\n3\n2',                  output: '3'    },
    { input: '5\n[[1,2,10],[2,0,30],[0,3,10],[1,4,10],[3,0,20],[4,2,10],[4,3,30]]\n0\n3\n2', output: '10' },
    { input: '4\n[[0,1,100],[0,2,300],[1,2,100],[2,3,100]]\n0\n3\n1',          output: '-1'   },
    { input: '4\n[[0,1,100],[0,2,300],[1,2,100],[2,3,100]]\n0\n3\n2',          output: '300'  },
    { input: '7\n[[0,3,7],[3,4,2],[0,4,6],[4,1,1],[2,0,10],[2,5,10],[2,6,10],[2,1,7]]\n2\n1\n1', output: '17' },
    { input: '5\n[[0,1,1],[1,2,1],[2,3,1],[3,4,1]]\n0\n4\n3',                 output: '4'    },
    { input: '5\n[[0,1,1],[1,2,1],[2,3,1],[3,4,1]]\n0\n4\n2',                 output: '-1'   },
  ],

  // -------------------------------------------------------------------------
  // 216. GENERATE PARENTHESES
  // Input:  n (int)
  // Output: all valid parenthesis combos, sorted lexicographically (string[])
  // -------------------------------------------------------------------------
  'generate-parentheses': [
    { input: '1', output: '["()"]' },
    { input: '2', output: '["(())","()()"]' },
    { input: '3', output: '["((()))","(()())","(())()","()(())","()()()"]' },
    { input: '4', output: '["(((())))","((()()))","((()))()","(()(()))","(()()())","(()())()","(())(())","(())()()","()((())))","()((()))","()(()())","()(())()","()()(())","()()()()"]' },
    { input: '0', output: '[""]' },
  ],

  // -------------------------------------------------------------------------
  // 217. BINARY SEARCH
  // Input:  nums (sorted int[]) \n target (int)
  // Output: index of target, or -1 (int)
  // -------------------------------------------------------------------------
  'binary-search': [
    { input: '[-1,0,3,5,9,12]\n9',        output: '4'  },
    { input: '[-1,0,3,5,9,12]\n2',        output: '-1' },
    { input: '[5]\n5',                    output: '0'  },
    { input: '[5]\n4',                    output: '-1' },
    { input: '[1,2]\n1',                  output: '0'  },
    { input: '[1,2]\n2',                  output: '1'  },
    { input: '[1,2]\n3',                  output: '-1' },
    { input: '[1,2,3,4,5]\n1',            output: '0'  },
    { input: '[1,2,3,4,5]\n3',            output: '2'  },
    { input: '[1,2,3,4,5]\n5',            output: '4'  },
    { input: '[1,2,3,4,5]\n6',            output: '-1' },
    { input: '[-5,-3,-1,0,2,4,6]\n-3',   output: '1'  },
    { input: '[-5,-3,-1,0,2,4,6]\n4',    output: '5'  },
    { input: '[-5,-3,-1,0,2,4,6]\n5',    output: '-1' },
    { input: '[0]\n0',                    output: '0'  },
    { input: '[0]\n1',                    output: '-1' },
    { input: '[2,5]\n2',                  output: '0'  },
    { input: '[2,5]\n5',                  output: '1'  },
    { input: '[2,5]\n3',                  output: '-1' },
    { input: '[1,3,5,7,9,11,13,15,17,19]\n7',  output: '3'  },
    { input: '[1,3,5,7,9,11,13,15,17,19]\n10', output: '-1' },
    { input: '[1,3,5,7,9,11,13,15,17,19]\n19', output: '9'  },
    { input: '[1,3,5,7,9,11,13,15,17,19]\n1',  output: '0'  },
    { input: '[-100,-50,0,50,100]\n-50', output: '1'  },
    { input: '[-100,-50,0,50,100]\n0',   output: '2'  },
    { input: '[-100,-50,0,50,100]\n75',  output: '-1' },
    { input: '[1,2,3,4,5,6,7,8,9,10]\n10', output: '9' },
    { input: '[1,2,3,4,5,6,7,8,9,10]\n1',  output: '0' },
    { input: '[1,2,3,4,5,6,7,8,9,10]\n5',  output: '4' },
    { input: '[1,2,3,4,5,6,7,8,9,10]\n11', output: '-1' },
  ],

  // -------------------------------------------------------------------------
  // 218. SEARCH A 2D MATRIX
  // Input:  matrix (int[][]) — rows and cols sorted \n target (int)
  // Output: "true" or "false"
  // -------------------------------------------------------------------------
  'search-a-2d-matrix': [
    { input: '[[1,3,5,7],[10,11,16,20],[23,30,34,60]]\n3',   output: 'true'  },
    { input: '[[1,3,5,7],[10,11,16,20],[23,30,34,60]]\n13',  output: 'false' },
    { input: '[[1]]\n1',                                     output: 'true'  },
    { input: '[[1]]\n2',                                     output: 'false' },
    { input: '[[1,3,5,7],[10,11,16,20],[23,30,34,60]]\n1',   output: 'true'  },
    { input: '[[1,3,5,7],[10,11,16,20],[23,30,34,60]]\n60',  output: 'true'  },
    { input: '[[1,3,5,7],[10,11,16,20],[23,30,34,60]]\n0',   output: 'false' },
    { input: '[[1,3,5,7],[10,11,16,20],[23,30,34,60]]\n61',  output: 'false' },
    { input: '[[1,3,5,7],[10,11,16,20],[23,30,34,60]]\n20',  output: 'true'  },
    { input: '[[1,3,5,7],[10,11,16,20],[23,30,34,60]]\n23',  output: 'true'  },
    { input: '[[1,3,5,7],[10,11,16,20],[23,30,34,60]]\n30',  output: 'true'  },
    { input: '[[1,3]]\n3',                                   output: 'true'  },
    { input: '[[1,3]]\n2',                                   output: 'false' },
    { input: '[[1],[3],[5]]\n3',                             output: 'true'  },
    { input: '[[1],[3],[5]]\n4',                             output: 'false' },
    { input: '[[1,2,3,4,5]]\n3',                             output: 'true'  },
    { input: '[[1,2,3,4,5]]\n6',                             output: 'false' },
    { input: '[[1],[2],[3],[4],[5]]\n5',                     output: 'true'  },
    { input: '[[1],[2],[3],[4],[5]]\n6',                     output: 'false' },
    { input: '[[1,3,5,7],[10,11,16,20],[23,30,34,60]]\n11',  output: 'true'  },
    { input: '[[1,3,5,7],[10,11,16,20],[23,30,34,60]]\n16',  output: 'true'  },
    { input: '[[1,3,5,7],[10,11,16,20],[23,30,34,60]]\n34',  output: 'true'  },
    { input: '[[1,3,5,7],[10,11,16,20],[23,30,34,60]]\n7',   output: 'true'  },
    { input: '[[1,3,5,7],[10,11,16,20],[23,30,34,60]]\n10',  output: 'true'  },
    { input: '[[1,3,5,7],[10,11,16,20],[23,30,34,60]]\n5',   output: 'true'  },
  ],

  // -------------------------------------------------------------------------
  // 219. KOKO EATING BANANAS
  // Input:  piles (int[]) \n h (int)
  // Output: minimum eating speed k (int)
  // -------------------------------------------------------------------------
  'koko-eating-bananas': [
    { input: '[3,6,7,11]\n8',          output: '4'  },
    { input: '[30,11,23,4,20]\n5',     output: '30' },
    { input: '[30,11,23,4,20]\n6',     output: '23' },
    { input: '[1,1,1,1]\n4',           output: '1'  },
    { input: '[1000000000]\n2',        output: '500000000' },
    { input: '[1000000000]\n1',        output: '1000000000' },
    { input: '[3,6,7,11]\n4',          output: '11' },
    { input: '[1]\n1',                 output: '1'  },
    { input: '[2,2]\n2',               output: '2'  },
    { input: '[2,2]\n3',               output: '1'  },
    { input: '[2,2]\n4',               output: '1'  },
    { input: '[312884470]\n312884469', output: '2'  },
    { input: '[25,10,23,4]\n4',        output: '25' },
    { input: '[25,10,23,4]\n5',        output: '13' },
    { input: '[25,10,23,4]\n8',        output: '7'  },
    { input: '[3,6,7,11]\n14',         output: '2'  },
    { input: '[805306368,805306368,805306368]\n1000000000', output: '3' },
    { input: '[1,2,3,4,5]\n5',         output: '5'  },
    { input: '[1,2,3,4,5]\n10',        output: '2'  },
    { input: '[1,2,3,4,5]\n15',        output: '1'  },
    { input: '[7,15,6,3]\n8',          output: '5'  },
    { input: '[332484035,524908576,855865114,632922628,222257295,690155293,112677673,679580077,337406589,290818316,877337160,901728858,679284947,688210097]\n823855907', output: '14' },
    { input: '[3]\n5',                 output: '1'  },
    { input: '[4,5,6]\n3',             output: '6'  },
    { input: '[4,5,6]\n6',             output: '3'  },
  ],

  // -------------------------------------------------------------------------
  // 220. FIND MINIMUM IN ROTATED SORTED ARRAY
  // Input:  nums (int[]) — rotated sorted array, unique elements
  // Output: minimum element (int)
  // -------------------------------------------------------------------------
  'find-minimum-in-rotated-sorted-array': [
    { input: '[3,4,5,1,2]',            output: '1' },
    { input: '[4,5,6,7,0,1,2]',        output: '0' },
    { input: '[11,13,15,17]',          output: '11'},
    { input: '[1]',                    output: '1' },
    { input: '[2,1]',                  output: '1' },
    { input: '[1,2]',                  output: '1' },
    { input: '[3,1,2]',                output: '1' },
    { input: '[5,1,2,3,4]',            output: '1' },
    { input: '[2,3,4,5,1]',            output: '1' },
    { input: '[1,2,3,4,5]',            output: '1' },
    { input: '[5,4,3,2,1]',            output: '1' },
    { input: '[4,5,6,7,8,1,2,3]',      output: '1' },
    { input: '[6,7,1,2,3,4,5]',        output: '1' },
    { input: '[10,1,10,10,10]',        output: '1' },
    { input: '[3,4,5,6,7,8,9,1,2]',    output: '1' },
    { input: '[2,3,4,5,6,7,8,9,1]',    output: '1' },
    { input: '[1,2,3,4,5,6,7,8,9]',    output: '1' },
    { input: '[9,1,2,3,4,5,6,7,8]',    output: '1' },
    { input: '[5,6,7,8,9,1,2,3,4]',    output: '1' },
    { input: '[-5,-4,-3,-2,-1]',       output: '-5'},
    { input: '[-1,-5,-4,-3,-2]',       output: '-5'},
    { input: '[-3,-2,-1,-5,-4]',       output: '-5'},
    { input: '[0,1,2,4,5,6,7,3]',      output: '0' },
    { input: '[4,5,6,7,8,9,10,1,2,3]', output: '1' },
    { input: '[100,200,1,50]',         output: '1' },
  ],

  // -------------------------------------------------------------------------
  // 221. SEARCH IN ROTATED SORTED ARRAY
  // Input:  nums (int[]) \n target (int)
  // Output: index of target, or -1 (int)
  // -------------------------------------------------------------------------
  'search-in-rotated-sorted-array': [
    { input: '[4,5,6,7,0,1,2]\n0',     output: '4'  },
    { input: '[4,5,6,7,0,1,2]\n3',     output: '-1' },
    { input: '[1]\n0',                 output: '-1' },
    { input: '[1]\n1',                 output: '0'  },
    { input: '[3,1]\n1',               output: '1'  },
    { input: '[3,1]\n3',               output: '0'  },
    { input: '[3,1]\n0',               output: '-1' },
    { input: '[5,1,3]\n5',             output: '0'  },
    { input: '[5,1,3]\n1',             output: '1'  },
    { input: '[5,1,3]\n3',             output: '2'  },
    { input: '[5,1,3]\n4',             output: '-1' },
    { input: '[4,5,6,7,0,1,2]\n4',     output: '0'  },
    { input: '[4,5,6,7,0,1,2]\n2',     output: '6'  },
    { input: '[4,5,6,7,0,1,2]\n7',     output: '3'  },
    { input: '[1,3]\n3',               output: '1'  },
    { input: '[6,7,1,2,3,4,5]\n3',     output: '4'  },
    { input: '[6,7,1,2,3,4,5]\n6',     output: '0'  },
    { input: '[6,7,1,2,3,4,5]\n5',     output: '6'  },
    { input: '[2,3,4,5,6,7,0,1]\n0',   output: '6'  },
    { input: '[2,3,4,5,6,7,0,1]\n2',   output: '0'  },
    { input: '[2,3,4,5,6,7,0,1]\n7',   output: '5'  },
    { input: '[1,2,3,4,5,6,7]\n1',     output: '0'  },
    { input: '[1,2,3,4,5,6,7]\n7',     output: '6'  },
    { input: '[1,2,3,4,5,6,7]\n4',     output: '3'  },
    { input: '[7,8,1,2,3,4,5,6]\n8',   output: '1'  },
    { input: '[7,8,1,2,3,4,5,6]\n6',   output: '7'  },
    { input: '[7,8,1,2,3,4,5,6]\n9',   output: '-1' },
    { input: '[4,5,6,7,8,1,2,3]\n8',   output: '4'  },
    { input: '[4,5,6,7,8,1,2,3]\n2',   output: '6'  },
    { input: '[4,5,6,7,8,1,2,3]\n9',   output: '-1' },
  ],

  // -------------------------------------------------------------------------
  // 222. TIME BASED KEY-VALUE STORE
  // Input:  ops (string[]) — "TimeMap"|"set:key:value:timestamp"|"get:key:timestamp"
  // Output: results (string[]) — "null" for TimeMap/set, value or "" for get
  // -------------------------------------------------------------------------
  'time-based-key-value-store': [
    { input: '["TimeMap","set:foo:bar:1","get:foo:1","get:foo:3","set:foo:bar2:4","get:foo:4","get:foo:5"]',
      output: '["null","null","bar","bar","null","bar2","bar2"]' },
    { input: '["TimeMap","set:love:high:10","set:love:low:20","get:love:5","get:love:10","get:love:15","get:love:20","get:love:25"]',
      output: '["null","null","null","","high","high","low","low"]' },
    { input: '["TimeMap","set:a:x:1","get:a:1","get:a:2"]',
      output: '["null","null","x","x"]' },
    { input: '["TimeMap","set:a:x:3","get:a:1","get:a:3","get:a:5"]',
      output: '["null","null","","x","x"]' },
    { input: '["TimeMap","set:a:x:1","set:a:y:2","get:a:1","get:a:2","get:a:3"]',
      output: '["null","null","null","x","y","y"]' },
    { input: '["TimeMap","set:a:x:1","set:a:y:3","get:a:1","get:a:2","get:a:3","get:a:4"]',
      output: '["null","null","null","x","x","y","y"]' },
    { input: '["TimeMap","set:k:v1:1","set:k:v2:2","set:k:v3:3","get:k:1","get:k:2","get:k:3","get:k:4"]',
      output: '["null","null","null","null","v1","v2","v3","v3"]' },
    { input: '["TimeMap","set:k:v1:5","get:k:1","get:k:5","get:k:10"]',
      output: '["null","null","","v1","v1"]' },
    { input: '["TimeMap","set:key1:val1:1","set:key2:val2:2","get:key1:1","get:key2:2","get:key1:3","get:key2:3"]',
      output: '["null","null","null","val1","val2","val1","val2"]' },
    { input: '["TimeMap","set:a:1:1","set:a:2:2","set:a:3:3","set:a:4:4","get:a:1","get:a:2","get:a:3","get:a:4"]',
      output: '["null","null","null","null","null","1","2","3","4"]' },
    { input: '["TimeMap","set:x:hello:10","get:x:9","get:x:10","get:x:11"]',
      output: '["null","null","","hello","hello"]' },
    { input: '["TimeMap","set:a:x:1","set:b:y:1","get:a:1","get:b:1","get:a:2","get:b:2"]',
      output: '["null","null","null","x","y","x","y"]' },
    { input: '["TimeMap","set:a:v1:2","set:a:v2:4","set:a:v3:6","get:a:1","get:a:2","get:a:3","get:a:4","get:a:5","get:a:6","get:a:7"]',
      output: '["null","null","null","null","","v1","v1","v2","v2","v3","v3"]' },
    { input: '["TimeMap","set:a:z:100","get:a:50","get:a:100","get:a:150"]',
      output: '["null","null","","z","z"]' },
    { input: '["TimeMap","set:m:n:1","set:m:o:1","get:m:1"]',
      output: '["null","null","null","o"]' },
  ],

  // -------------------------------------------------------------------------
  // 223. MEDIAN OF TWO SORTED ARRAYS
  // Input:  nums1 (int[]) \n nums2 (int[])
  // Output: median (string representation of float, exact to 1 decimal)
  // -------------------------------------------------------------------------
  'median-of-two-sorted-arrays': [
    { input: '[1,3]\n[2]',              output: '2.0'   },
    { input: '[1,2]\n[3,4]',            output: '2.5'   },
    { input: '[0,0]\n[0,0]',            output: '0.0'   },
    { input: '[]\n[1]',                 output: '1.0'   },
    { input: '[2]\n[]',                 output: '2.0'   },
    { input: '[1,2]\n[3,4,5]',          output: '3.0'   },
    { input: '[1,3,5]\n[2,4,6]',        output: '3.5'   },
    { input: '[1]\n[2,3]',              output: '2.0'   },
    { input: '[1,2,3]\n[4,5,6]',        output: '3.5'   },
    { input: '[]\n[2,3]',               output: '2.5'   },
    { input: '[1]\n[1]',                output: '1.0'   },
    { input: '[1,3]\n[2,4]',            output: '2.5'   },
    { input: '[1,2,3,4]\n[5,6,7,8]',    output: '4.5'   },
    { input: '[1,2]\n[1,2]',            output: '1.5'   },
    { input: '[1,5,9]\n[2,6,10]',       output: '5.5'   },
    { input: '[1,2,4,5]\n[3,6]',        output: '3.5'   },
    { input: '[1]\n[2]',                output: '1.5'   },
    { input: '[1,3,5,7]\n[2,4,6,8]',    output: '4.5'   },
    { input: '[1,2,3]\n[1,2,3]',        output: '2.0'   },
    { input: '[100000]\n[100001]',       output: '100000.5' },
    { input: '[1,2,5,6,9]\n[4,7,8,10,12]', output: '6.5' },
    { input: '[1,3,8,9,15]\n[7,11,19,21,25]', output: '11.0' },
    { input: '[]\n[1,2,3,4,5]',         output: '3.0'   },
    { input: '[1,2,3,4,5]\n[]',         output: '3.0'   },
    { input: '[2,2,4,4]\n[2,2,4,4]',    output: '3.0'   },
  ],

  // -------------------------------------------------------------------------
  // 224. WORD SEARCH II
  // Input:  board (char[][]) \n words (string[])
  // Output: found words, sorted lexicographically (string[])
  // -------------------------------------------------------------------------
  'word-search-ii': [
    { input: '[["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]]\n["eat","oath"]',
      output: '["eat","oath"]' },
    { input: '[["a","b"],["c","d"]]\n["abcb"]',
      output: '[]' },
    { input: '[["a","a"]]\n["aaa"]',
      output: '[]' },
    { input: '[["a"]]\n["a"]',
      output: '["a"]' },
    { input: '[["a","b"],["c","d"]]\n["ab","cd","ac","bd"]',
      output: '["ab","ac","bd","cd"]' },
    { input: '[["o","a","b","n"],["o","t","a","e"],["a","h","k","r"],["a","f","l","v"]]\n["oa","oaa"]',
      output: '["oa","oaa"]' },
    { input: '[["a","b","c"],["a","e","d"],["a","f","g"]]\n["abcdefg","gfedcbaaa","eaabcdgf","befa","dgc","ade"]',
      output: '["abcdefg","befa","dgc","eaabcdgf"]' },
    { input: '[["a"]]\n["b"]',
      output: '[]' },
    { input: '[["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]]\n["eat","oath","none"]',
      output: '["eat","oath"]' },
    { input: '[["a","b","c"],["d","e","f"],["g","h","i"]]\n["abc","cfi","beh","defi","gh"]',
      output: '["abc","beh","cfi","defi","gh"]' },
    { input: '[["a","b"],["a","a"]]\n["aba","baa","bab","aaab","aaa","aaaa","aaba"]',
      output: '["aaa","aaab","aaba","aba","baa"]' },
    { input: '[["a","b","c","d"],["e","f","g","h"],["i","j","k","l"],["m","n","o","p"]]\n["abcd","efgh","mnop","abfe","dcgh"]',
      output: '["abcd","abfe","dcgh","efgh","mnop"]' },
    { input: '[["a","a","a","a","a","a","a","a","a","a","a","a"],["a","a","a","a","a","a","a","a","a","a","a","a"],["a","a","a","a","a","a","a","a","a","a","a","a"],["a","a","a","a","a","a","a","a","a","a","a","a"]]\n["aaaaaaaaaaaaaaaa"]',
      output: '["aaaaaaaaaaaaaaaa"]' },
    { input: '[["a","b"],["c","d"]]\n["abc","abcd","abdc","acbd","acdb","abcdc"]',
      output: '["abcd","abdc","acbd","acdb"]' },
    { input: '[["a"]]\n["a","b","c"]',
      output: '["a"]' },
  ],

  // -------------------------------------------------------------------------
  // 225. FIRST MISSING POSITIVE
  // Input:  nums (int[])
  // Output: smallest missing positive integer (int)
  // -------------------------------------------------------------------------
  'first-missing-positive': [
    { input: '[1,2,0]',               output: '3' },
    { input: '[3,4,-1,1]',            output: '2' },
    { input: '[7,8,9,11,12]',         output: '1' },
    { input: '[1]',                   output: '2' },
    { input: '[2]',                   output: '1' },
    { input: '[-1,-2,-3]',            output: '1' },
    { input: '[0]',                   output: '1' },
    { input: '[1,2,3]',               output: '4' },
    { input: '[1,1,1]',               output: '2' },
    { input: '[2,1]',                 output: '3' },
    { input: '[1,2,3,4,5]',           output: '6' },
    { input: '[5,4,3,2,1]',           output: '6' },
    { input: '[1,2,5]',               output: '3' },
    { input: '[1,1]',                 output: '2' },
    { input: '[0,2,2,1,1]',           output: '3' },
    { input: '[1000000]',             output: '1' },
    { input: '[1,2,3,5]',             output: '4' },
    { input: '[3,1,2]',               output: '4' },
    { input: '[-1,4,2,1,9,10]',       output: '3' },
    { input: '[2,3,4]',               output: '1' },
    { input: '[1,2,3,4,5,6,7,8,9,10]', output: '11' },
    { input: '[0,0,0,1]',             output: '2' },
    { input: '[2,2,2,2]',             output: '1' },
    { input: '[1,3,6,4,1,2]',         output: '5' },
    { input: '[1,2,4,5,6]',           output: '3' },
    { input: '[100,101,102]',         output: '1' },
    { input: '[1,2,3,4,6]',           output: '5' },
    { input: '[4,1,2,3]',             output: '5' },
    { input: '[1,2,3,100]',           output: '4' },
    { input: '[0,1,2,3,4]',           output: '5' },
  ],

  // -------------------------------------------------------------------------
  // 226. LOWEST COMMON ANCESTOR OF A BINARY TREE
  // Input:  root (BFS serialized) \n p (value) \n q (value)
  // Output: LCA node value (int)
  // -------------------------------------------------------------------------
  'lowest-common-ancestor-of-a-binary-tree': [
    { input: '[3,5,1,6,2,0,8,null,null,7,4]\n5\n1',   output: '3' },
    { input: '[3,5,1,6,2,0,8,null,null,7,4]\n5\n4',   output: '5' },
    { input: '[1,2]\n1\n2',                           output: '1' },
    { input: '[1,2,3]\n2\n3',                         output: '1' },
    { input: '[1,2,3]\n1\n2',                         output: '1' },
    { input: '[1,2,3,4,5]\n4\n5',                     output: '2' },
    { input: '[1,2,3,4,5]\n4\n3',                     output: '1' },
    { input: '[3,5,1,6,2,0,8,null,null,7,4]\n6\n4',   output: '5' },
    { input: '[3,5,1,6,2,0,8,null,null,7,4]\n7\n4',   output: '2' },
    { input: '[3,5,1,6,2,0,8,null,null,7,4]\n6\n7',   output: '5' },
    { input: '[3,5,1,6,2,0,8]\n5\n1',                 output: '3' },
    { input: '[3,5,1,6,2,0,8]\n6\n8',                 output: '3' },
    { input: '[1,2,3,4,5,6,7]\n4\n7',                 output: '1' },
    { input: '[1,2,3,4,5,6,7]\n4\n5',                 output: '2' },
    { input: '[1,2,3,4,5,6,7]\n6\n7',                 output: '3' },
    { input: '[1,2,null,3]\n2\n3',                    output: '2' },
    { input: '[1,2,null,3]\n1\n3',                    output: '1' },
    { input: '[10,5,15,3,7]\n3\n7',                   output: '5' },
    { input: '[10,5,15,3,7]\n5\n15',                  output: '10' },
    { input: '[10,5,15,3,7]\n3\n15',                  output: '10' },
    { input: '[6,2,8,0,4,7,9]\n0\n4',                 output: '2' },
    { input: '[6,2,8,0,4,7,9]\n2\n9',                 output: '6' },
    { input: '[6,2,8,0,4,7,9]\n0\n9',                 output: '6' },
    { input: '[1,2,3,4,5,6,7,8,9]\n8\n9',             output: '4' },
    { input: '[1,2,3,4,5,6,7,8,9]\n8\n7',             output: '1' },
  ],

  // -------------------------------------------------------------------------
  // 227. DIAMETER OF BINARY TREE
  // Input:  root (BFS serialized)
  // Output: diameter (longest path between any two nodes, in edges) (int)
  // -------------------------------------------------------------------------
  'diameter-of-binary-tree': [
    { input: '[1,2,3,4,5]',                          output: '3' },
    { input: '[1,2]',                                output: '1' },
    { input: '[1]',                                  output: '0' },
    { input: '[1,2,3,4,5,6,7]',                      output: '4' },
    { input: '[1,null,2,null,null,null,3]',           output: '2' },
    { input: '[4,2,6,1,3,5,7]',                      output: '4' },
    { input: '[1,2,null,3,null,4,null,5]',           output: '4' },
    { input: '[3,9,20,null,null,15,7]',              output: '3' },
    { input: '[1,2,3,4]',                            output: '3' },
    { input: '[1,2,3,null,null,4,5]',                output: '3' },
    { input: '[1,2,3,null,null,null,4]',             output: '3' },
    { input: '[1,2,null,null,3]',                    output: '2' },
    { input: '[0,-3,9,-10,null,5]',                  output: '4' },
    { input: '[5,4,8,11,null,13,4,7,2,null,null,5,1]', output: '6' },
    { input: '[1,2,3,4,5,6,7,8,9,10]',              output: '6' },
    { input: '[1,null,2,null,null,null,3,null,null,null,null,null,null,null,4]', output: '3' },
    { input: '[10,5,15,3,7,null,18]',               output: '4' },
    { input: '[1,2,3,4,5,null,null,null,6]',         output: '5' },
    { input: '[-3]',                                 output: '0' },
    { input: '[1,2,null,3,4]',                       output: '3' },
    { input: '[1,2,3,null,null,4,null,5]',           output: '4' },
    { input: '[0,1,null,2,null,3,null,4]',           output: '4' },
    { input: '[1,2,3,4,5,6,7,8]',                   output: '5' },
    { input: '[1,null,2,null,null,null,3,null,null,null,null,null,null,null,4,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,5]', output: '4' },
    { input: '[1,2,3]',                              output: '2' },
  ],

  // -------------------------------------------------------------------------
  // 228. BALANCED BINARY TREE
  // Input:  root (BFS serialized)
  // Output: "true" if height-balanced, "false" otherwise
  // -------------------------------------------------------------------------
  'balanced-binary-tree': [
    { input: '[3,9,20,null,null,15,7]',              output: 'true'  },
    { input: '[1,2,2,3,3,null,null,4,4]',            output: 'false' },
    { input: '[]',                                   output: 'true'  },
    { input: '[1]',                                  output: 'true'  },
    { input: '[1,2]',                                output: 'true'  },
    { input: '[1,2,3]',                              output: 'true'  },
    { input: '[1,2,3,4]',                            output: 'true'  },
    { input: '[1,2,null,3]',                         output: 'false' },
    { input: '[1,2,null,3,null,4]',                  output: 'false' },
    { input: '[1,2,3,4,5,6]',                        output: 'true'  },
    { input: '[1,2,3,4,5,6,7]',                      output: 'true'  },
    { input: '[1,2,3,4,5,6,7,8]',                   output: 'true'  },
    { input: '[1,2,null,null,3]',                    output: 'false' },
    { input: '[1,null,2,null,null,null,3]',          output: 'false' },
    { input: '[4,2,6,1,3,5,7]',                     output: 'true'  },
    { input: '[5,4,8,11,null,13,4,7,2,null,null,null,1]', output: 'true' },
    { input: '[5,4,8,11,null,13,4,7,2,null,null,null,null,null,0]', output: 'false' },
    { input: '[1,2,2,3,null,null,3,4,null,null,4]',  output: 'false' },
    { input: '[1,2,3,null,null,null,4,null,null,null,null,null,null,null,5]', output: 'false' },
    { input: '[1,2,3,4,5,null,null,8,9]',            output: 'true'  },
    { input: '[0,1,null,2,null,3,null,4]',           output: 'false' },
    { input: '[10,5,15,3,7,null,18]',               output: 'true'  },
    { input: '[1,2,null,3,4]',                       output: 'false' },
    { input: '[1,2,3,4,4]',                          output: 'true'  },
    { input: '[1,2,3,null,null,4,5,null,null,6,7]',  output: 'true'  },
  ],

  // -------------------------------------------------------------------------
  // INSERT INTERVAL
  // Input:  intervals (int[][]) \n newInterval (int[])
  // Output: merged intervals (int[][])
  // -------------------------------------------------------------------------
  'insert-interval': [
    { input: '[[1,3],[6,9]]\n[2,5]',                           output: '[[1,5],[6,9]]'             },
    { input: '[[1,2],[3,5],[6,7],[8,10],[12,16]]\n[4,8]',      output: '[[1,2],[3,10],[12,16]]'     },
    { input: '[[1,5]]\n[2,3]',                                 output: '[[1,5]]'                   },
    { input: '[[1,5]]\n[2,7]',                                 output: '[[1,7]]'                   },
    { input: '[[1,5]]\n[6,8]',                                 output: '[[1,5],[6,8]]'              },
    { input: '[[3,5],[12,15]]\n[6,6]',                         output: '[[3,5],[6,6],[12,15]]'      },
    { input: '[]\n[5,7]',                                      output: '[[5,7]]'                   },
    { input: '[[1,5]]\n[0,0]',                                 output: '[[0,0],[1,5]]'              },
    { input: '[[1,5]]\n[0,3]',                                 output: '[[0,5]]'                   },
    { input: '[[1,5]]\n[0,6]',                                 output: '[[0,6]]'                   },
    { input: '[[2,6],[7,9]]\n[0,1]',                           output: '[[0,1],[2,6],[7,9]]'        },
    { input: '[[2,6],[7,9]]\n[0,3]',                           output: '[[0,6],[7,9]]'              },
    { input: '[[2,6],[7,9]]\n[4,8]',                           output: '[[2,9]]'                   },
    { input: '[[2,6],[7,9]]\n[0,10]',                          output: '[[0,10]]'                  },
    { input: '[[1,2],[3,5],[6,7],[8,10],[12,16]]\n[11,17]',    output: '[[1,2],[3,5],[6,7],[8,10],[11,17]]' },
    { input: '[[1,3],[6,9]]\n[0,0]',                           output: '[[0,0],[1,3],[6,9]]'        },
    { input: '[[1,3],[6,9]]\n[10,12]',                         output: '[[1,3],[6,9],[10,12]]'      },
    { input: '[[1,3],[6,9]]\n[1,9]',                           output: '[[1,9]]'                   },
    { input: '[[1,5],[6,8]]\n[5,6]',                           output: '[[1,8]]'                   },
    { input: '[[1,5]]\n[5,5]',                                 output: '[[1,5]]'                   },
  ],

  // -------------------------------------------------------------------------
  // MERGE INTERVALS
  // Input:  intervals (int[][])
  // Output: merged non-overlapping intervals (int[][])
  // -------------------------------------------------------------------------
  'merge-intervals': [
    { input: '[[1,3],[2,6],[8,10],[15,18]]',          output: '[[1,6],[8,10],[15,18]]'  },
    { input: '[[1,4],[4,5]]',                         output: '[[1,5]]'                },
    { input: '[[1,4],[2,3]]',                         output: '[[1,4]]'                },
    { input: '[[1,4],[0,4]]',                         output: '[[0,4]]'                },
    { input: '[[1,4],[0,0]]',                         output: '[[0,0],[1,4]]'          },
    { input: '[[1,2],[3,4],[5,6]]',                   output: '[[1,2],[3,4],[5,6]]'    },
    { input: '[[1,2],[2,3],[3,4]]',                   output: '[[1,4]]'                },
    { input: '[[1,10],[2,3]]',                        output: '[[1,10]]'               },
    { input: '[[2,3],[4,5],[6,7],[8,9],[1,10]]',      output: '[[1,10]]'               },
    { input: '[[1,3]]',                               output: '[[1,3]]'               },
    { input: '[[1,2],[3,4]]',                         output: '[[1,2],[3,4]]'          },
    { input: '[[1,4],[2,3]]',                         output: '[[1,4]]'                },
    { input: '[[0,0],[0,0]]',                         output: '[[0,0]]'                },
    { input: '[[1,3],[2,6],[5,10],[14,18]]',          output: '[[1,10],[14,18]]'       },
    { input: '[[1,3],[2,6],[3,8],[7,10]]',            output: '[[1,10]]'               },
    { input: '[[2,3],[4,5],[6,7],[8,9]]',             output: '[[2,3],[4,5],[6,7],[8,9]]' },
    { input: '[[1,5],[2,3],[4,8],[6,7],[9,10]]',      output: '[[1,10]]'               },
    { input: '[[4,5],[1,4]]',                         output: '[[1,5]]'                },
    { input: '[[1,4],[5,6],[7,8],[9,10]]',            output: '[[1,4],[5,6],[7,8],[9,10]]' },
    { input: '[[1,100],[2,3],[4,99]]',                output: '[[1,100]]'              },
  ],

  // -------------------------------------------------------------------------
  // POW(X, N)
  // Input:  x (float) \n n (int)
  // Output: x^n (float, rounded to 5 decimal places as string)
  // -------------------------------------------------------------------------
  'pow-x-n': [
    { input: '2.00000\n10',  output: '1024.00000'  },
    { input: '2.10000\n3',   output: '9.26100'      },
    { input: '2.00000\n-2',  output: '0.25000'      },
    { input: '1.00000\n0',   output: '1.00000'      },
    { input: '0.00000\n0',   output: '1.00000'      },
    { input: '2.00000\n0',   output: '1.00000'      },
    { input: '2.00000\n1',   output: '2.00000'      },
    { input: '2.00000\n-1',  output: '0.50000'      },
    { input: '1.00000\n100', output: '1.00000'      },
    { input: '0.50000\n2',   output: '0.25000'      },
    { input: '0.50000\n-2',  output: '4.00000'      },
    { input: '3.00000\n3',   output: '27.00000'     },
    { input: '10.00000\n3',  output: '1000.00000'   },
    { input: '2.00000\n5',   output: '32.00000'     },
    { input: '2.00000\n-3',  output: '0.12500'      },
    { input: '0.44528\n0',   output: '1.00000'      },
    { input: '1.00000\n-2147483648', output: '1.00000' },
    { input: '2.00000\n15',  output: '32768.00000'  },
    { input: '0.10000\n3',   output: '0.00100'      },
    { input: '4.00000\n2',   output: '16.00000'     },
  ],

  // -------------------------------------------------------------------------
  // SORT COLORS
  // Input:  nums (int[]) — 0,1,2
  // Output: sorted nums (int[])
  // -------------------------------------------------------------------------
  'sort-colors': [
    { input: '[2,0,2,1,1,0]',      output: '[0,0,1,1,2,2]' },
    { input: '[2,0,1]',            output: '[0,1,2]'        },
    { input: '[0]',                output: '[0]'            },
    { input: '[1]',                output: '[1]'            },
    { input: '[2]',                output: '[2]'            },
    { input: '[0,0]',              output: '[0,0]'          },
    { input: '[1,1]',              output: '[1,1]'          },
    { input: '[2,2]',              output: '[2,2]'          },
    { input: '[0,1,2]',            output: '[0,1,2]'        },
    { input: '[2,1,0]',            output: '[0,1,2]'        },
    { input: '[1,0,2]',            output: '[0,1,2]'        },
    { input: '[0,0,0]',            output: '[0,0,0]'        },
    { input: '[1,1,1]',            output: '[1,1,1]'        },
    { input: '[2,2,2]',            output: '[2,2,2]'        },
    { input: '[2,1,2,0,1,0]',      output: '[0,0,1,1,2,2]' },
    { input: '[0,2,1,0,2,1]',      output: '[0,0,1,1,2,2]' },
    { input: '[1,2,0,2,0,1]',      output: '[0,0,1,1,2,2]' },
    { input: '[0,1,2,0,1,2]',      output: '[0,0,1,1,2,2]' },
    { input: '[2,2,1,1,0,0]',      output: '[0,0,1,1,2,2]' },
    { input: '[0,1,0,1,0,1]',      output: '[0,0,0,1,1,1]' },
  ],

  // -------------------------------------------------------------------------
  // NEXT PERMUTATION
  // Input:  nums (int[])
  // Output: next permutation in-place (int[])
  // -------------------------------------------------------------------------
  'next-permutation': [
    { input: '[1,2,3]',        output: '[1,3,2]'        },
    { input: '[3,2,1]',        output: '[1,2,3]'        },
    { input: '[1,1,5]',        output: '[1,5,1]'        },
    { input: '[1]',            output: '[1]'            },
    { input: '[1,2]',          output: '[2,1]'          },
    { input: '[2,1]',          output: '[1,2]'          },
    { input: '[1,3,2]',        output: '[2,1,3]'        },
    { input: '[2,3,1]',        output: '[3,1,2]'        },
    { input: '[3,1,2]',        output: '[3,2,1]'        },
    { input: '[1,2,3,4]',      output: '[1,2,4,3]'      },
    { input: '[4,3,2,1]',      output: '[1,2,3,4]'      },
    { input: '[2,1,3]',        output: '[2,3,1]'        },
    { input: '[1,4,3,2]',      output: '[2,1,3,4]'      },
    { input: '[2,4,3,1]',      output: '[3,1,2,4]'      },
    { input: '[5,4,7,5,3,2]',  output: '[5,5,2,3,4,7]' },
    { input: '[1,2,3,4,5]',    output: '[1,2,3,5,4]'    },
    { input: '[5,4,3,2,1]',    output: '[1,2,3,4,5]'    },
    { input: '[1,1,1]',        output: '[1,1,1]'        },
    { input: '[2,2,2]',        output: '[2,2,2]'        },
    { input: '[1,2,4,3]',      output: '[1,3,2,4]'      },
  ],

  // -------------------------------------------------------------------------
  // LARGEST NUMBER
  // Input:  nums (int[])
  // Output: largest number formed by concatenation (string)
  // -------------------------------------------------------------------------
  'largest-number': [
    { input: '[10,2]',             output: '"210"'         },
    { input: '[3,30,34,5,9]',      output: '"9534330"'     },
    { input: '[1]',                output: '"1"'           },
    { input: '[10]',               output: '"10"'          },
    { input: '[0,0]',              output: '"0"'           },
    { input: '[0,0,0]',            output: '"0"'           },
    { input: '[1,2,3]',            output: '"321"'         },
    { input: '[9,1,2,3]',          output: '"9321"'        },
    { input: '[999,99,9]',         output: '"999999"'      },
    { input: '[12,121]',           output: '"12121"'       },
    { input: '[121,12]',           output: '"12121"'       },
    { input: '[1,10,100]',         output: '"110100"'      },
    { input: '[0,9,8,7,6,5,4,3,2,1]', output: '"9876543210"' },
    { input: '[824,938,1399,5607,6973,5703,9609,4398,8247]', output: '"9609938824824763965703560743981399"' },
    { input: '[8308,8308,830]',    output: '"8308830830"'  },
    { input: '[128,12,320,32]',    output: '"32320128012"' },
    { input: '[432,43243]',        output: '"43243432"'    },
    { input: '[64,8,16,4,40,2]',   output: '"86444022"'    },
    { input: '[5,50,56]',          output: '"56550"'       },
    { input: '[2,20,23]',          output: '"23220"' },
  ],

  // -------------------------------------------------------------------------
  // DECODE STRING
  // Input:  s (string)
  // Output: decoded string
  // -------------------------------------------------------------------------
  'decode-string': [
    { input: '"3[a]2[bc]"',               output: '"aaabcbc"'             },
    { input: '"3[a2[c]]"',                output: '"accaccacc"'           },
    { input: '"2[abc]3[cd]ef"',           output: '"abcabccdcdcdef"'      },
    { input: '"abc3[cd]xyz"',             output: '"abccdcdcdxyz"'        },
    { input: '"1[a]"',                    output: '"a"'                   },
    { input: '"a"',                       output: '"a"'                   },
    { input: '"2[a]"',                    output: '"aa"'                  },
    { input: '"10[a]"',                   output: '"aaaaaaaaaa"'          },
    { input: '"3[z]"',                    output: '"zzz"'                 },
    { input: '"2[a2[b]]"',               output: '"abbaabb"'             },
    { input: '"3[a]2[bc]ef"',            output: '"aaabcbcef"'           },
    { input: '"2[b3[a2[c]]]"',           output: '"baccaccaccbaccaccacc"' },
    { input: '"k3[a2[bc]]"',             output: '"kababcabcbc"'         },
    { input: '"2[2[y]pq4[2[jk]e1[f]]]"', output: '"yyPqjkjkefjkjkefJkjkefJkjkefyyPqjkjkefjkjkefJkjkefJkjkef"' },
    { input: '"3[2[a]b]"',              output: '"aabaabaab"'            },
    { input: '"ab2[c3[d]]ef"',          output: '"abcdddcdddef"'         },
    { input: '"1[1[1[a]]]"',            output: '"a"'                   },
    { input: '"4[ab]"',                  output: '"abababab"'             },
    { input: '"2[a]3[b]4[c]"',          output: '"aabbbcccc"'            },
    { input: '"2[a3[b]]"',              output: '"abbbabbb"'             },
  ],

  // -------------------------------------------------------------------------
  // ASTEROID COLLISION
  // Input:  asteroids (int[])
  // Output: state after all collisions (int[])
  // -------------------------------------------------------------------------
  'asteroid-collision': [
    { input: '[5,10,-5]',             output: '[5,10]'       },
    { input: '[8,-8]',                output: '[]'           },
    { input: '[10,2,-5]',             output: '[10]'         },
    { input: '[-2,-1,1,2]',           output: '[-2,-1,1,2]' },
    { input: '[1,-1,-2]',             output: '[-2]'         },
    { input: '[1,2,3,-3]',            output: '[1,2]'        },
    { input: '[1,2,3,-5]',            output: '[-5]'         },
    { input: '[-1,-2,-3]',            output: '[-1,-2,-3]'  },
    { input: '[1,2,3]',               output: '[1,2,3]'      },
    { input: '[-1,1]',               output: '[-1,1]'       },
    { input: '[1,-2,-1]',             output: '[-2,-1]'      },
    { input: '[5,7,-5]',              output: '[5,7]'        },
    { input: '[5,7,-7]',              output: '[5]'          },
    { input: '[5,7,-8]',              output: '[-8]'         },
    { input: '[1,-1]',               output: '[]'           },
    { input: '[1,-1,1,-1]',           output: '[]'           },
    { input: '[2,-2,2,-2]',           output: '[]'           },
    { input: '[1,2,-1,-2]',           output: '[]'           },
    { input: '[-5,-5,5,5]',           output: '[-5,-5,5,5]' },
    { input: '[10,-2,-5,-10]',        output: '[-10]'        },
  ],

  // -------------------------------------------------------------------------
  // SIMPLIFY PATH
  // Input:  path (string) — Unix absolute path
  // Output: simplified canonical path (string)
  // -------------------------------------------------------------------------
  'simplify-path': [
    { input: '"/home/"',              output: '"/home"'        },
    { input: '"/../"',               output: '"/"'            },
    { input: '"/home//foo/"',         output: '"/home/foo"'    },
    { input: '"/a/./b/../../c/"',     output: '"/c"'           },
    { input: '"/"',                  output: '"/"'            },
    { input: '"/a"',                 output: '"/a"'           },
    { input: '"/a/b/c"',             output: '"/a/b/c"'       },
    { input: '"/a//b///c"',          output: '"/a/b/c"'       },
    { input: '"/a/./b/c"',           output: '"/a/b/c"'       },
    { input: '"/a/b/../c"',          output: '"/a/c"'         },
    { input: '"/a/b/../../c"',       output: '"/c"'           },
    { input: '"/a/b/c/../../.."',    output: '"/"'            },
    { input: '"/a/b/c/../../../d"',  output: '"/d"'           },
    { input: '"/.."',               output: '"/"'            },
    { input: '"/."',                output: '"/"'            },
    { input: '"/a/.."',             output: '"/"'            },
    { input: '"/a/./c/../../b"',     output: '"/b"'           },
    { input: '"/a//b//c//"',         output: '"/a/b/c"'       },
    { input: '"/a/b/c/d/../../../../.."', output: '"/"'       },
    { input: '"/home/user/Documents/../Pictures"', output: '"/home/user/Pictures"' },
  ],

  // -------------------------------------------------------------------------
  // REMOVE K DIGITS
  // Input:  num (string) \n k (int)
  // Output: smallest number after removing k digits (string)
  // -------------------------------------------------------------------------
  'remove-k-digits': [
    { input: '"1432219"\n3',    output: '"1219"'  },
    { input: '"10200"\n1',      output: '"200"'   },
    { input: '"10"\n2',         output: '"0"'     },
    { input: '"9"\n1',          output: '"0"'     },
    { input: '"12345"\n0',      output: '"12345"' },
    { input: '"12345"\n5',      output: '"0"'     },
    { input: '"10001"\n1',      output: '"1"'     },
    { input: '"100"\n1',        output: '"0"'     },
    { input: '"1234567890"\n5', output: '"12345"' },
    { input: '"9876543210"\n5', output: '"32100"' },  
    { input: '"112"\n1',        output: '"11"'    },
    { input: '"1234"\n2',       output: '"12"'    },
    { input: '"4321"\n2',       output: '"21"'    },
    { input: '"10000"\n1',      output: '"0"'     },
    { input: '"5337"\n1',       output: '"337"'   },
    { input: '"11"\n1',         output: '"1"'     },
    { input: '"1111111"\n3',    output: '"1111"'  },
    { input: '"1234567"\n3',    output: '"1234"'  },
    { input: '"7654321"\n3',    output: '"4321"'  },
    { input: '"221"\n1',        output: '"21"'    },
  ],

  // -------------------------------------------------------------------------
  // SINGLE ELEMENT IN A SORTED ARRAY
  // Input:  nums (int[]) — every element except one appears twice
  // Output: the single element (int)
  // -------------------------------------------------------------------------
  'single-element-in-a-sorted-array': [
    { input: '[1,1,2,3,3,4,4,8,8]',                          output: '2' },
    { input: '[3,3,7,7,10,11,11]',                           output: '10' },
    { input: '[1]',                                          output: '1' },
    { input: '[1,2,2]',                                      output: '1' },
    { input: '[1,1,2]',                                      output: '2' },
    { input: '[1,1,2,3,3]',                                  output: '2' },
    { input: '[1,1,2,2,3]',                                  output: '3' },
    { input: '[1,2,2,3,3]',                                  output: '1' },
    { input: '[0,1,1,2,2,3,3]',                              output: '0' },
    { input: '[1,1,2,2,3,3,4]',                              output: '4' },
    { input: '[1,1,2,2,3,3,4,4,5]',                          output: '5' },
    { input: '[1,2,2,3,3,4,4,5,5]',                          output: '1' },
    { input: '[1,1,2,3,3,4,4]',                              output: '2' },
    { input: '[0,0,1,2,2,3,3,4,4]',                          output: '1' },
    { input: '[2,2,5,5,7]',                                  output: '7' },
    { input: '[5,5,7,7,9,9,11]',                             output: '11' },
    { input: '[1,1,3,3,5,5,7,7,9,9,11]',                     output: '11' },
    { input: '[1,1,3,3,5]',                                  output: '5' },
    { input: '[5,7,7,9,9]',                                  output: '5' },
    { input: '[1,1,2,2,3,4,4]',                              output: '3' },
  ],

  // -------------------------------------------------------------------------
  // COMBINATION SUM IV
  // Input:  nums (int[]) \n target (int)
  // Output: number of possible combinations (int, order matters)
  // -------------------------------------------------------------------------
  'combination-sum-iv': [
    { input: '[1,2,3]\n4',         output: '7'  },
    { input: '[9]\n3',             output: '0'  },
    { input: '[1,2,3]\n1',         output: '1'  },
    { input: '[1,2,3]\n2',         output: '2'  },
    { input: '[1,2,3]\n3',         output: '4'  },
    { input: '[1,2]\n3',           output: '3'  },
    { input: '[1]\n1',             output: '1'  },
    { input: '[1]\n2',             output: '1'  },
    { input: '[1]\n5',             output: '1'  },
    { input: '[2]\n4',             output: '1'  },
    { input: '[2]\n5',             output: '0'  },
    { input: '[2,3]\n7',           output: '4'  },
    { input: '[1,2,3]\n5',         output: '13' },
    { input: '[1,2,3]\n6',         output: '24' },
    { input: '[3,1,2,4]\n4',       output: '8'  },
    { input: '[1,2,3]\n10',        output: '274'},
    { input: '[2,1,3]\n35',        output: '1132436852' },
    { input: '[4,2]\n8',           output: '5'  },
    { input: '[5,1,4,2,3]\n5',     output: '16' },
    { input: '[3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25]\n10', output: '5' },
  ],

  // -------------------------------------------------------------------------
  // BOATS TO SAVE PEOPLE
  // Input:  people (int[]) — weights \n limit (int)
  // Output: minimum number of boats (int)
  // -------------------------------------------------------------------------
  'boats-to-save-people': [
    { input: '[1,2]\n3',            output: '1' },
    { input: '[3,2,2,1]\n3',        output: '3' },
    { input: '[3,5,3,4]\n5',        output: '4' },
    { input: '[1,2,3,4,5]\n5',      output: '3' },
    { input: '[1]\n1',              output: '1' },
    { input: '[2,2]\n4',            output: '1' },
    { input: '[2,2]\n3',            output: '2' },
    { input: '[1,1,1,1]\n2',        output: '2' },
    { input: '[1,1,1,1,1]\n3',      output: '3' },
    { input: '[5,5,5]\n5',          output: '3' },
    { input: '[1,2,3,4,5]\n6',      output: '3' },
    { input: '[1,2,3,4,5]\n10',     output: '3' },
    { input: '[3,3,3,3]\n6',        output: '2' },
    { input: '[1,3,2,2]\n3',        output: '3' },
    { input: '[2,4]\n5',            output: '2' },
    { input: '[5,1,4,2]\n6',        output: '2' },
    { input: '[1,2,3,4,5,6]\n7',    output: '3' },
    { input: '[3,3]\n6',            output: '1' },
    { input: '[1,1,1,1,1,1]\n2',    output: '3' },
    { input: '[2,1,3,2]\n3',        output: '3' },
  ],

  // -------------------------------------------------------------------------
  // PATH SUM II
  // Input:  root (BFS serialized) \n targetSum (int)
  // Output: all root-to-leaf paths summing to targetSum (int[][], sorted)
  // -------------------------------------------------------------------------
  'path-sum-ii': [
    { input: '[5,4,8,11,null,13,4,7,2,null,null,5,1]\n22',  output: '[[5,4,11,2],[5,8,4,5]]' },
    { input: '[1,2,3]\n5',                                  output: '[]'            },
    { input: '[1,2]\n0',                                    output: '[]'            },
    { input: '[1,2]\n3',                                    output: '[[1,2]]'       },
    { input: '[1]\n1',                                      output: '[[1]]'         },
    { input: '[1]\n0',                                      output: '[]'            },
    { input: '[1,2,3]\n3',                                  output: '[[1,2]]'       },
    { input: '[1,2,3]\n4',                                  output: '[[1,3]]'       },
    { input: '[-2,null,-3]\n-5',                            output: '[[-2,-3]]'     },
    { input: '[1,2,null,3]\n6',                             output: '[[1,2,3]]'     },
    { input: '[1,2,null,3]\n3',                             output: '[]'            },
    { input: '[1,2,3]\n2',                                  output: '[]'            },  
    { input: '[10,5,12,4,7]\n22',                           output: '[[10,5,7]]'    },
    { input: '[1,-2,-3,1,3,-2,null,-1]\n2',                 output: '[[1,-2,3],[1,-2,1,-3]]'},
    { input: '[5,4,8,11,null,13,4,7,2,null,null,null,1]\n18', output: '[[5,4,11,2],[5,8,5]]' },
  ],

  // -------------------------------------------------------------------------
  // DELETE NODE IN A BST
  // Input:  root (BFS serialized) \n key (int)
  // Output: BST after deletion (BFS serialized)
  // -------------------------------------------------------------------------
  'delete-node-in-a-bst': [
    { input: '[5,3,6,2,4,null,7]\n3',   output: '[5,4,6,2,null,null,7]'        },
    { input: '[5,3,6,2,4,null,7]\n0',   output: '[5,3,6,2,4,null,7]'           },
    { input: '[5,3,6,2,4,null,7]\n5',   output: '[6,3,7,2,4]'                  },
    { input: '[]\\n0',                  output: '[]'                            },
    { input: '[5,3,6,2,4,null,7]\n6',   output: '[5,3,7,2,4]'                  },
    { input: '[5,3,6,2,4,null,7]\n7',   output: '[5,3,6,2,4]'                  },
    { input: '[5,3,6,2,4,null,7]\n2',   output: '[5,3,6,null,4,null,7]'        },
    { input: '[5,3,6,2,4,null,7]\n4',   output: '[5,3,6,2,null,null,7]'        },
    { input: '[1]\n1',                  output: '[]'                            },
    { input: '[2,1]\n1',                output: '[2]'                           },
    { input: '[2,1]\n2',                output: '[1]'                           },
    { input: '[3,1,5,null,2]\n3',       output: '[5,1,null,null,2]'             },
    { input: '[4,2,6,1,3,5,7]\n2',      output: '[4,3,6,1,null,5,7]'           },
    { input: '[4,2,6,1,3,5,7]\n6',      output: '[4,2,7,1,3,5]'                },
    { input: '[4,2,6,1,3,5,7]\n1',      output: '[4,2,6,null,3,5,7]'           },
  ],

  // -------------------------------------------------------------------------
  // TRIM A BINARY SEARCH TREE
  // Input:  root (BFS serialized) \n low (int) \n high (int)
  // Output: trimmed BST (BFS serialized)
  // -------------------------------------------------------------------------
  'trim-a-binary-search-tree': [
    { input: '[1,0,2]\n1\n2',              output: '[1,null,2]'          },
    { input: '[3,0,4,null,2,null,null,1]\n1\n3', output: '[3,2,null,1]'  },
    { input: '[1]\n1\n2',                  output: '[1]'                 },
    { input: '[1]\n2\n3',                  output: '[]'                  },
    { input: '[1,0,2]\n0\n2',              output: '[1,0,2]'             },
    { input: '[1,0,2]\n0\n0',              output: '[0]'                 },
    { input: '[1,0,2]\n2\n2',              output: '[2]'                 },
    { input: '[4,2,6,1,3,5,7]\n3\n6',     output: '[4,3,6,null,null,5]' },
    { input: '[4,2,6,1,3,5,7]\n1\n7',     output: '[4,2,6,1,3,5,7]'    },
    { input: '[4,2,6,1,3,5,7]\n5\n7',     output: '[6,5,7]'             },
    { input: '[4,2,6,1,3,5,7]\n1\n3',     output: '[2,1,3]'             },
    { input: '[2,1,3]\n1\n3',             output: '[2,1,3]'             },
    { input: '[2,1,3]\n2\n3',             output: '[2,null,3]'          },
    { input: '[2,1,3]\n1\n2',             output: '[2,1]'               },
    { input: '[1,null,2,null,null,null,3]\n3\n4', output: '[3]'          },
  ],

  // -------------------------------------------------------------------------
  // KEYS AND ROOMS
  // Input:  rooms (int[][]) — rooms[i] = keys found in room i
  // Output: "true" if all rooms can be visited, "false" otherwise
  // -------------------------------------------------------------------------
  'keys-and-rooms': [
    { input: '[[1],[2],[3],[]]',          output: 'true'  },
    { input: '[[1,3],[3,0,1],[2],[0]]',   output: 'false' },
    { input: '[[]]',                      output: 'true'  },
    { input: '[[1],[]]',                  output: 'true'  },
    { input: '[[1,2],[],[]]',             output: 'true'  },
    { input: '[[1],[0]]',                 output: 'true'  },
    { input: '[[2],[],[1]]',              output: 'false' },
    { input: '[[1,2,3],[],[],[]]',        output: 'true'  },
    { input: '[[1],[2],[]]]',             output: 'true'  },
    { input: '[[],[1,2],[],[]]',          output: 'false' },
    { input: '[[1,2],[0],[3],[]]',        output: 'true'  },
    { input: '[[1,2,3,4],[],[],[],[]]',   output: 'true'  },
    { input: '[[3],[]]',                  output: 'false' },
    { input: '[[1],[2],[3,4],[4],[]]',    output: 'true'  },
    { input: '[[0,1,2,3]]',              output: 'true'  },
  ],

  // -------------------------------------------------------------------------
  // NUMBER OF PROVINCES
  // Input:  isConnected (int[][]) — adjacency matrix
  // Output: number of provinces (int)
  // -------------------------------------------------------------------------
  'number-of-provinces': [
    { input: '[[1,1,0],[1,1,0],[0,0,1]]',       output: '2' },
    { input: '[[1,0,0],[0,1,0],[0,0,1]]',       output: '3' },
    { input: '[[1]]',                           output: '1' },
    { input: '[[1,0],[0,1]]',                   output: '2' },
    { input: '[[1,1],[1,1]]',                   output: '1' },
    { input: '[[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]]', output: '4' },
    { input: '[[1,1,0,0],[1,1,0,0],[0,0,1,1],[0,0,1,1]]', output: '2' },
    { input: '[[1,1,1],[1,1,1],[1,1,1]]',       output: '1' },
    { input: '[[1,0,0,1],[0,1,1,0],[0,1,1,1],[1,0,1,1]]', output: '1' },
    { input: '[[1,0,0],[0,1,1],[0,1,1]]',       output: '2' },
    { input: '[[1,1,0],[1,1,1],[0,1,1]]',       output: '1' },
    { input: '[[1,0,1],[0,1,0],[1,0,1]]',       output: '2' },
    { input: '[[1,0,0,0,0],[0,1,0,0,0],[0,0,1,0,0],[0,0,0,1,0],[0,0,0,0,1]]', output: '5' },
    { input: '[[1,1,0,0,0],[1,1,0,0,0],[0,0,1,1,0],[0,0,1,1,0],[0,0,0,0,1]]', output: '3' },
    { input: '[[1,1,1,1],[1,1,0,0],[1,0,1,0],[1,0,0,1]]', output: '1' },
  ],

  // -------------------------------------------------------------------------
  // SHORTEST PATH IN BINARY MATRIX
  // Input:  grid (int[][]) — 0=open, 1=blocked
  // Output: length of shortest path from (0,0) to (n-1,n-1), or -1
  // -------------------------------------------------------------------------
  'shortest-path-in-binary-matrix': [
    { input: '[[0,1],[1,0]]',                                   output: '2'  },
    { input: '[[0,0,0],[1,1,0],[1,1,0]]',                       output: '4'  },
    { input: '[[1,0,0],[1,1,0],[1,1,0]]',                       output: '-1' },
    { input: '[[0,0,0],[0,1,0],[0,0,0]]',                       output: '4'  },
    { input: '[[0]]',                                           output: '1'  },
    { input: '[[1]]',                                           output: '-1' },
    { input: '[[0,0],[0,0]]',                                   output: '2'  },
    { input: '[[0,1],[0,0]]',                                   output: '2'  },
    { input: '[[0,0,0],[0,0,0],[0,0,0]]',                       output: '3'  },
    { input: '[[0,0,0,0],[1,1,0,0],[0,0,0,0],[0,0,0,0]]',       output: '4'  },
    { input: '[[0,0,0,0],[1,1,1,0],[0,0,0,0],[0,1,1,0]]',       output: '6'  },
    { input: '[[0,0,1,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]',       output: '4'  },
    { input: '[[0,0,0],[0,1,0],[0,0,0]]',                       output: '4'  },
    { input: '[[1,0,0],[0,0,0],[0,0,0]]',                       output: '-1' },
    { input: '[[0,0,0],[0,0,0],[0,0,1]]',                       output: '-1' },
  ],

  // -------------------------------------------------------------------------
  // 01 MATRIX
  // Input:  mat (int[][]) — 0s and 1s
  // Output: distance to nearest 0 for each cell (int[][])
  // -------------------------------------------------------------------------
  '01-matrix': [
    { input: '[[0,0,0],[0,1,0],[0,0,0]]',           output: '[[0,0,0],[0,1,0],[0,0,0]]'           },
    { input: '[[0,0,0],[0,1,0],[1,1,1]]',           output: '[[0,0,0],[0,1,0],[1,2,1]]'           },
    { input: '[[0]]',                               output: '[[0]]'                              },
    { input: '[[0,1]]',                             output: '[[0,1]]'                            },
    { input: '[[1,0]]',                             output: '[[1,0]]'                            },
    { input: '[[1,1],[1,0]]',                       output: '[[2,1],[1,0]]'                      },
    { input: '[[0,0],[0,0]]',                       output: '[[0,0],[0,0]]'                      },
    { input: '[[0,1,1],[1,1,1],[1,1,0]]',           output: '[[0,1,2],[1,2,1],[2,1,0]]'          },
    { input: '[[1,0,1],[1,1,1],[1,0,1]]',           output: '[[1,0,1],[1,1,1],[1,0,1]]'          },
    { input: '[[0,0,0,0,0],[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,0]]', output: '[[0,0,0,0,0],[1,1,1,1,1],[2,2,2,2,2],[3,3,3,3,1],[4,4,4,3,0]]' },
    { input: '[[0,0,0],[0,0,0],[0,0,0]]',           output: '[[0,0,0],[0,0,0],[0,0,0]]'           },
    { input: '[[1,1,1],[1,1,1],[1,1,0]]',           output: '[[4,3,2],[3,2,1],[2,1,0]]'           },
    { input: '[[0,1,1,1,0]]',                       output: '[[0,1,2,1,0]]'                      },
    { input: '[[0],[1],[1],[1],[0]]',               output: '[[0],[1],[2],[1],[0]]'              },
    { input: '[[0,1,0],[1,1,1],[0,1,0]]',           output: '[[0,1,0],[1,2,1],[0,1,0]]'          },
  ],

  // -------------------------------------------------------------------------
  // IS GRAPH BIPARTITE?
  // Input:  graph (int[][]) — adjacency list
  // Output: "true" or "false"
  // -------------------------------------------------------------------------
  'is-graph-bipartite': [
    { input: '[[1,2,3],[0,2],[0,1,3],[0,2]]',         output: 'false' },
    { input: '[[1,3],[0,2],[1,3],[0,2]]',             output: 'true'  },
    { input: '[[1,2],[0,3],[0,3],[1,2]]',             output: 'true'  },
    { input: '[[],[],[],[]]',                          output: 'true'  },
    { input: '[[1],[0]]',                              output: 'true'  },
    { input: '[[1,2],[0,2],[0,1]]',                   output: 'false' },
    { input: '[[1],[0,3],[3],[1,2]]',                 output: 'true'  },
    { input: '[[1,2],[0,3],[0,3],[1,2]]',             output: 'true'  },
    { input: '[[3,1],[0],[4],[0,4],[2,3]]',           output: 'true'  },
    { input: '[[1,2,3],[0],[0],[0]]',                 output: 'true'  },
    { input: '[[1],[0,2],[1,3],[2]]',                 output: 'true'  },
    { input: '[[2,3],[2,4],[0,1],[0,4],[1,3]]',       output: 'false' },
    { input: '[[],[3],[],[1]]',                       output: 'true'  },
    { input: '[[1,3],[0,2],[1,3],[0,2]]',             output: 'true'  },
    { input: '[[1,2,3],[0,2,3],[0,1],[0,1]]',         output: 'false' },
  ],

  // -------------------------------------------------------------------------
  // TRIANGLE
  // Input:  triangle (int[][])
  // Output: minimum path sum (int)
  // -------------------------------------------------------------------------
  'triangle': [
    { input: '[[2],[3,4],[6,5,7],[4,1,8,3]]',         output: '11' },
    { input: '[[-10]]',                               output: '-10' },
    { input: '[[1],[2,3]]',                           output: '3'  },
    { input: '[[1],[2,3],[3,5,1]]',                   output: '5'  },
    { input: '[[0],[1,2],[3,4,5]]',                   output: '4'  },
    { input: '[[0],[1,2],[3,4,5],[6,7,8,9]]',         output: '10' },
    { input: '[[-1],[2,3],[1,-1,-3]]',                output: '-1' },
    { input: '[[1],[1,1],[1,1,1],[1,1,1,1]]',         output: '4'  },
    { input: '[[5],[1,9],[2,3,4],[1,7,6,9]]',         output: '9'  },
    { input: '[[1],[2,3],[4,5,6],[7,8,9,10]]',        output: '14' },
    { input: '[[0],[0,0],[0,0,0]]',                   output: '0'  },
    { input: '[[9],[1,5],[0,3,8]]',                   output: '13' },
    { input: '[[3],[4,5],[1,2,3],[1,2,3,4]]',         output: '8'  },
    { input: '[[7],[6,0],[5,8,1],[4,5,6,9]]',         output: '12' },
    { input: '[[2],[1,3],[2,4,5],[1,3,5,2]]',         output: '6'  },
  ],

  // -------------------------------------------------------------------------
  // MINIMUM FALLING PATH SUM
  // Input:  matrix (int[][])
  // Output: minimum sum of a falling path (int)
  // -------------------------------------------------------------------------
  'minimum-falling-path-sum': [
    { input: '[[2,1,3],[6,5,4],[7,8,9]]',      output: '13' },
    { input: '[[-19,57],[-40,-5]]',             output: '-59'},
    { input: '[[1]]',                          output: '1'  },
    { input: '[[1,2],[3,4]]',                  output: '4'  },
    { input: '[[4,3],[2,1]]',                  output: '3'  },
    { input: '[[1,2,3],[4,5,6],[7,8,9]]',      output: '12' },
    { input: '[[9,8,7],[6,5,4],[3,2,1]]',      output: '13' },
    { input: '[[1,1,1],[1,1,1],[1,1,1]]',      output: '3'  },
    { input: '[[0,0,0],[0,0,0],[0,0,0]]',      output: '0'  },
    { input: '[[5,1,2],[4,3,6],[7,8,9]]',      output: '10' },
    { input: '[[-1,-2,-3],[-4,-5,-6],[-7,-8,-9]]', output: '-24'},
    { input: '[[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16]]', output: '30' },
    { input: '[[100,-100],[100,-100]]',         output: '-100'},
    { input: '[[5,4,3,2,1],[1,2,3,4,5],[6,7,8,9,10]]', output: '8' },
    { input: '[[3,2,1],[1,2,3],[3,2,1]]',      output: '3'  },
  ],

  // -------------------------------------------------------------------------
  // INTEGER BREAK
  // Input:  n (int)
  // Output: maximum product (int)
  // -------------------------------------------------------------------------
  'integer-break': [
    { input: '2',   output: '1'   },
    { input: '3',   output: '2'   },
    { input: '4',   output: '4'   },
    { input: '5',   output: '6'   },
    { input: '6',   output: '9'   },
    { input: '7',   output: '12'  },
    { input: '8',   output: '18'  },
    { input: '9',   output: '27'  },
    { input: '10',  output: '36'  },
    { input: '11',  output: '54'  },
    { input: '12',  output: '81'  },
    { input: '13',  output: '108' },
    { input: '14',  output: '162' },
    { input: '15',  output: '243' },
    { input: '16',  output: '324' },
    { input: '20',  output: '1458'},
    { input: '25',  output: '9477'},
    { input: '30',  output: '59049'},
    { input: '50',  output: '86093442' },
    { input: '58',  output: '1549681956' },
  ],

  // -------------------------------------------------------------------------
  // BEST TIME TO BUY AND SELL STOCK WITH TRANSACTION FEE
  // Input:  prices (int[]) \n fee (int)
  // Output: maximum profit (int)
  // -------------------------------------------------------------------------
  'best-time-to-buy-and-sell-stock-with-transaction-fee': [
    { input: '[1,3,2,8,4,9]\n2',          output: '8'  },
    { input: '[1,3,7,5,10,3]\n3',         output: '6'  },
    { input: '[1,2,3]\n1',                output: '1'  },
    { input: '[1,2,3]\n2',                output: '0'  },
    { input: '[1]\n0',                    output: '0'  },
    { input: '[1,2]\n0',                  output: '1'  },
    { input: '[1,2]\n1',                  output: '0'  },
    { input: '[2,1,4,1,5]\n2',            output: '3'  },
    { input: '[1,4,2,7]\n2',              output: '4'  },
    { input: '[1,4,2,7,1,10]\n2',         output: '11' },
    { input: '[5,4,3,2,1]\n1',            output: '0'  },
    { input: '[1,3,1,3,1,3]\n1',          output: '2'  },
    { input: '[2,4,6,8,10]\n1',           output: '7'  },
    { input: '[10,8,6,4,2]\n1',           output: '0'  },
    { input: '[1,2,1,2,1,2]\n0',          output: '3'  },
    { input: '[1,5,3,7,2,9]\n2',          output: '10' },
    { input: '[3,1,3,1,3]\n1',            output: '2'  },
    { input: '[1,6,2,8,3,10]\n2',         output: '13' },
    { input: '[1,2]\n5',                  output: '0'  },
    { input: '[2,1,2,0,1]\n0',            output: '2'  },
  ],

  // -------------------------------------------------------------------------
  // REORGANIZE STRING
  // Input:  s (string)
  // Output: rearranged string where no two adjacent chars are same, or ""
  // -------------------------------------------------------------------------
  'reorganize-string': [
    { input: '"aab"',    output: '"aba"'   },
    { input: '"aaab"',   output: '""'      },
    { input: '"a"',      output: '"a"'     },
    { input: '"aa"',     output: '""'      },
    { input: '"ab"',     output: '"ab"'    },
    { input: '"abc"',    output: '"abc"'   },
    { input: '"aabc"',   output: '"abac"'  },
    { input: '"aaaabc"', output: '""'      },
    { input: '"aaabbc"', output: '"ababac"' },
    { input: '"ababababab"', output: '"ababababab"' },
    { input: '"aaabbbccc"', output: '"abcabcabc"' },
    { input: '"aaab"',   output: '""'      },
    { input: '"aaabb"',  output: '"ababa"' },
    { input: '"vvvlo"',  output: '"vlvov"' },
    { input: '"zz"',     output: '""'      },
    { input: '"aabb"',   output: '"abab"'  },
    { input: '"aaabbb"', output: '"ababab"' },
    { input: '"aaabc"',  output: '"abaca"' },
    { input: '"abcd"',   output: '"abcd"'  },
    { input: '"aaabbccc"', output: '"cacabcb"' },
  ],

  // -------------------------------------------------------------------------
  // LONGEST HAPPY STRING
  // Input:  a (int) \n b (int) \n c (int)
  // Output: length of longest "happy" string (int)
  //   (a string using at most a 'a's, b 'b's, c 'c's with no 3 consecutive same)
  // -------------------------------------------------------------------------
  'longest-happy-string': [
    { input: '1\n1\n7',   output: '4' },
    { input: '7\n1\n0',   output: '4' },
    { input: '0\n0\n1',   output: '1' },
    { input: '0\n0\n0',   output: '0' },
    { input: '1\n1\n1',   output: '3' },
    { input: '2\n2\n2',   output: '6' },
    { input: '3\n3\n3',   output: '8' },
    { input: '0\n8\n11',  output: '9' },
    { input: '10\n10\n10', output: '18'},
    { input: '1\n0\n0',   output: '1' },
    { input: '2\n0\n0',   output: '2' },
    { input: '3\n0\n0',   output: '2' },
    { input: '4\n0\n0',   output: '2' },
    { input: '2\n1\n0',   output: '3' },
    { input: '2\n2\n0',   output: '4' },
    { input: '3\n2\n1',   output: '6' },
    { input: '5\n5\n5',   output: '12'},
    { input: '10\n2\n1',  output: '7' },
    { input: '1\n5\n1',   output: '5' },
    { input: '0\n5\n5',   output: '8' },
  ],

  // -------------------------------------------------------------------------
  // FIND K PAIRS WITH SMALLEST SUMS
  // Input:  nums1 (int[]) \n nums2 (int[]) \n k (int)
  // Output: k pairs with smallest sums (int[][])
  // -------------------------------------------------------------------------
  'find-k-pairs-with-smallest-sums': [
    { input: '[1,7,11]\n[2,4,6]\n3',   output: '[[1,2],[1,4],[1,6]]'        },
    { input: '[1,1,2]\n[1,2,3]\n2',    output: '[[1,1],[1,1]]'              },
    { input: '[1,2]\n[3]\n3',          output: '[[1,3],[2,3]]'              },
    { input: '[1,2,4,5,6]\n[3,5,7,9]\n3', output: '[[1,3],[2,3],[1,5]]'    },
    { input: '[1]\n[1]\n1',            output: '[[1,1]]'                   },
    { input: '[1,2]\n[1,2]\n4',        output: '[[1,1],[1,2],[2,1],[2,2]]' },
    { input: '[1,1,1]\n[1,1,1]\n3',    output: '[[1,1],[1,1],[1,1]]'        },
    { input: '[1,2,3]\n[1,2,3]\n4',    output: '[[1,1],[1,2],[2,1],[1,3]]' },
    { input: '[1,7,11]\n[2,4,6]\n9',   output: '[[1,2],[1,4],[1,6],[7,2],[7,4],[11,2],[7,6],[11,4],[11,6]]' },
    { input: '[1,2]\n[3,4]\n2',        output: '[[1,3],[1,4]]'             },
    { input: '[1,3,5]\n[2,4,6]\n5',    output: '[[1,2],[1,4],[3,2],[1,6],[3,4]]' },
    { input: '[1,2,3]\n[4,5,6]\n3',    output: '[[1,4],[1,5],[2,4]]'       },
    { input: '[10,20,30]\n[1,2,3]\n3', output: '[[10,1],[10,2],[10,3]]'    },
    { input: '[1]\n[1,2,3,4,5]\n5',    output: '[[1,1],[1,2],[1,3],[1,4],[1,5]]' },
    { input: '[1,1,2]\n[1,2,3]\n9',    output: '[[1,1],[1,1],[1,2],[1,2],[2,1],[1,3],[1,3],[2,2],[2,3]]' },
  ],

  // -------------------------------------------------------------------------
  // KTH SMALLEST ELEMENT IN A SORTED MATRIX
  // Input:  matrix (int[][]) — sorted row & col \n k (int)
  // Output: kth smallest element (int)
  // -------------------------------------------------------------------------
  'kth-smallest-element-in-a-sorted-matrix': [
    { input: '[[1,5,9],[10,11,13],[12,13,15]]\n8',    output: '13' },
    { input: '[[-5]]\n1',                             output: '-5' },
    { input: '[[1,2],[1,3]]\n1',                      output: '1'  },
    { input: '[[1,2],[1,3]]\n2',                      output: '1'  },
    { input: '[[1,2],[1,3]]\n3',                      output: '2'  },
    { input: '[[1,2],[1,3]]\n4',                      output: '3'  },
    { input: '[[1,5,9],[10,11,13],[12,13,15]]\n1',    output: '1'  },
    { input: '[[1,5,9],[10,11,13],[12,13,15]]\n9',    output: '15' },
    { input: '[[1,2,3],[4,5,6],[7,8,9]]\n5',          output: '5'  },
    { input: '[[1,2,3],[4,5,6],[7,8,9]]\n1',          output: '1'  },
    { input: '[[1,2,3],[4,5,6],[7,8,9]]\n9',          output: '9'  },
    { input: '[[1,3,5],[6,7,12],[11,14,14]]\n6',      output: '11' },
    { input: '[[1,2],[3,4]]\n2',                      output: '2'  },
    { input: '[[1,4,7,11],[2,5,8,12],[3,6,9,16],[10,13,14,17]]\n8', output: '8' },
    { input: '[[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16]]\n7', output: '7' },
    { input: '[[1,2],[1,2]]\n3',                      output: '2'  },
    { input: '[[1,3,5,7],[2,4,6,8],[9,10,11,12],[13,14,15,16]]\n1', output: '1' },
    { input: '[[-4,-3,-2,-1],[0,1,2,3],[4,5,6,7],[8,9,10,11]]\n8', output: '3' },
    { input: '[[1,5,9],[10,11,13],[12,13,15]]\n4',    output: '9'  },
    { input: '[[1,5,9],[10,11,13],[12,13,15]]\n5',    output: '10' },
  ],

  // -------------------------------------------------------------------------
  // INSERT DELETE GETRANDOM O(1)
  // Input:  ops (string[]) — "RandomizedSet"|"insert:val"|"remove:val"|"getRandom"
  // Output: results (string[]) — "null" or "true"/"false" or a value
  // -------------------------------------------------------------------------
  'insert-delete-getrandom-o1': [
    { input: '["RandomizedSet","insert:1","remove:2","insert:2","getRandom","remove:1","insert:2","getRandom"]',
      output: '["null","true","false","true","1_or_2","true","false","2"]' },
    { input: '["RandomizedSet","insert:1","getRandom"]',
      output: '["null","true","1"]' },
    { input: '["RandomizedSet","insert:0","insert:1","remove:0","getRandom"]',
      output: '["null","true","true","true","1"]' },
    { input: '["RandomizedSet","insert:1","insert:1","getRandom","remove:1","insert:1"]',
      output: '["null","true","false","1","true","true"]' },
    { input: '["RandomizedSet","insert:3","insert:1","remove:2","insert:3"]',
      output: '["null","true","true","false","false"]' },
    { input: '["RandomizedSet","remove:0","remove:0","insert:0","getRandom","remove:0","insert:0"]',
      output: '["null","false","false","true","0","true","true"]' },
  ],

  // -------------------------------------------------------------------------
  // DESIGN BROWSER HISTORY
  // Input:  ops (string[]) — "BrowserHistory:homepage"|"visit:url"|"back:steps"|"forward:steps"
  // Output: results (string[])
  // -------------------------------------------------------------------------
  'design-browser-history': [
    { input: '["BrowserHistory:leetcode.com","visit:google.com","visit:facebook.com","visit:youtube.com","back:1","back:1","forward:1","visit:linkedin.com","forward:2","back:2","back:7"]',
      output: '["null","null","null","null","facebook.com","google.com","facebook.com","null","linkedin.com","google.com","leetcode.com"]' },
    { input: '["BrowserHistory:home","visit:a","visit:b","back:2","forward:1","back:1","back:5"]',
      output: '["null","null","null","home","a","home","home"]' },
    { input: '["BrowserHistory:a","visit:b","back:1","forward:1","back:2"]',
      output: '["null","null","a","b","a"]' },
    { input: '["BrowserHistory:home","back:1","forward:1"]',
      output: '["null","home","home"]' },
    { input: '["BrowserHistory:a","visit:b","visit:c","visit:d","back:1","visit:e","forward:3"]',
      output: '["null","null","null","null","c","null","e"]' },
  ],

  // -------------------------------------------------------------------------
  // DESIGN UNDERGROUND SYSTEM
  // Input:  ops (string[]) — "UndergroundSystem"|"checkIn:id:stationName:t"|"checkOut:id:stationName:t"|"getAverageTime:startStation:endStation"
  // Output: results (string[])
  // -------------------------------------------------------------------------
  'design-underground-system': [
    { input: '["UndergroundSystem","checkIn:45:Leyton:3","checkIn:32:Paradise:8","checkIn:27:Leyton:10","checkOut:45:Waterloo:15","checkOut:27:Waterloo:20","checkOut:32:Cambridge:22","getAverageTime:Paradise:Cambridge","getAverageTime:Leyton:Waterloo"]',
      output: '["null","null","null","null","null","null","null","14.0","11.0"]' },
    { input: '["UndergroundSystem","checkIn:10:Leyton:3","checkOut:10:Paradise:8","getAverageTime:Leyton:Paradise","checkIn:5:Leyton:10","checkOut:5:Paradise:16","getAverageTime:Leyton:Paradise","checkIn:2:Leyton:21","checkOut:2:Paradise:30","getAverageTime:Leyton:Paradise"]',
      output: '["null","null","null","5.0","null","null","5.5","null","null","6.666666666666667"]' },
    { input: '["UndergroundSystem","checkIn:1:A:1","checkOut:1:B:5","getAverageTime:A:B","checkIn:2:A:2","checkOut:2:B:7","getAverageTime:A:B"]',
      output: '["null","null","null","4.0","null","null","4.5"]' },
  ],

  // -------------------------------------------------------------------------
  // EVALUATE DIVISION
  // Input:  equations (string[][]) \n values (float[]) \n queries (string[][])
  // Output: results (float[]) — -1.0 if unknown
  // -------------------------------------------------------------------------
  'evaluate-division': [
    { input: '[["a","b"],["b","c"]]\n[2.0,3.0]\n[["a","c"],["b","a"],["a","e"],["a","a"],["x","x"]]',
      output: '[6.0,0.5,-1.0,1.0,-1.0]' },
    { input: '[["a","b"],["b","c"],["bc","cd"]]\n[1.5,2.5,5.0]\n[["a","c"],["c","b"],["bc","cd"],["cd","bc"]]',
      output: '[3.75,0.4,5.0,0.2]' },
    { input: '[["a","b"]]\n[0.5]\n[["a","b"],["b","a"],["a","c"],["x","y"]]',
      output: '[0.5,2.0,-1.0,-1.0]' },
    { input: '[["x1","x2"],["x2","x3"],["x3","x4"],["x4","x5"]]\n[3.0,4.0,5.0,6.0]\n[["x1","x5"],["x5","x2"],["x2","x4"],["x2","x2"],["x2","x9"],["x9","x9"]]',
      output: '[360.0,0.008333333333333333,20.0,1.0,-1.0,-1.0]' },
    { input: '[["a","b"]]\n[2.0]\n[["a","b"],["a","a"],["b","b"],["b","c"]]',
      output: '[2.0,1.0,1.0,-1.0]' },
  ],

  // -------------------------------------------------------------------------
  // NEAREST EXIT FROM ENTRANCE IN MAZE
  // Input:  maze (string[][]) — "+" wall, "." open \n entrance (int[])
  // Output: steps to nearest exit, or -1
  // -------------------------------------------------------------------------
  'nearest-exit-from-entrance-in-maze': [
    { input: '[["+","+",".","+"],[".",".",".","+"],["+","+","+","."]]\n[1,2]',  output: '1'  },
    { input: '[["+","+","+"],[".",".","."],["+"," ","+"]]" \n[1,0]',            output: '2'  },
    { input: '[[".","+"]]"\n[0,0]',                                             output: '-1' },
    { input: '[[".",".","."],[".","+","."],[".",".","."]]"\n[0,0]',              output: '1'  },
    { input: '[["+",".","+","+","+","+","+"],["+",".","+",".",".",".","+"],["+",".","+",".","+",".","+"],["+",".",".",".","+",".","+"],["+","+","+","+","+","+","."]]"\n[0,1]', output: '12' },
    { input: '[["."]]\n[0,0]',                                                  output: '-1' },
    { input: '[[".","."],[".","+"]]\n[0,0]',                                    output: '1'  },
    { input: '[[".","+"],[".","."]]\n[0,0]',                                    output: '1'  },
    { input: '[["+","+","+","."],[".",".",".","."],["+","+","+","+"]]\n[1,0]',  output: '2'  },
    { input: '[["+",".","+","+"],["+",".",".","+"],["+","+",".","+"],[".",".",".","+"]]\n[0,1]', output: '4' },
  ],

  // -------------------------------------------------------------------------
  // MINIMUM GENETIC MUTATION
  // Input:  startGene (string) \n endGene (string) \n bank (string[])
  // Output: minimum mutations, or -1
  // -------------------------------------------------------------------------
  'minimum-genetic-mutation': [
    { input: '"AACCGGTT"\n"AACCGGTA"\n["AACCGGTA"]',                                  output: '1' },
    { input: '"AACCGGTT"\n"AAACGGTA"\n["AACCGGTA","AACCGCTA","AAACGGTA"]',            output: '2' },
    { input: '"AAAAACCC"\n"AACCCCCC"\n["AAAACCCC","AAACCCCC","AACCCCCC"]',            output: '3' },
    { input: '"AACCGGTT"\n"AACCGGTA"\n[]',                                            output: '-1'},
    { input: '"AACCGGTT"\n"AACCGGTT"\n[]',                                            output: '0' },
    { input: '"AACCGGTT"\n"AACCGGCC"\n["AACCGGCC"]',                                  output: '1' },
    { input: '"AACCGGTT"\n"AACAGGTT"\n["AACCGGTT","AACAGGTT"]',                       output: '1' },
    { input: '"AACCGGTT"\n"GGCCGGTT"\n["AACCGGTT","AGCCGGTT","GGCCGGTT"]',            output: '2' },
    { input: '"AACCGGTT"\n"GGCCGGTT"\n["AGCCGGTT"]',                                  output: '-1'},
    { input: '"TATCGGCT"\n"GGCGCGCG"\n["TATCGGCG","TATCGGCC","TATCGGAC","TATGGGCG","TATGGGCC","TATGGGAC","TAGCGGCG","TAGCGGCC","TAGCGGAC","TAGGGGCG","TAGGGGCC","TAGGGGAC","TACGGGCG","TACGGGCC","TACGGGAC","TACCGGCG","TACCGGCC","TACCGGAC","TATCGGCG","TATCGGCC","TATCGGAC","GACGGGCG","GACGGGCC","GACGGGAC","GACCGGCG","GACCGGCC","GACCGGAC","GGCGGGCG","GGCGGGCC","GGCGGGAC","GGCCGGCG","GGCCGGCC","GGCCGGAC","GGCGCGCG"]', output: '4' },
  ],

  // -------------------------------------------------------------------------
  // SUCCESSFUL PAIRS OF SPELLS AND POTIONS
  // Input:  spells (int[]) \n potions (int[]) \n success (long)
  // Output: number of successful pairs for each spell (int[])
  // -------------------------------------------------------------------------
  'successful-pairs-of-spells-and-potions': [
    { input: '[5,1,3]\n[1,2,3,4,5]\n7',              output: '[4,0,3]'    },
    { input: '[3,1,2]\n[8,5,8]\n16',                 output: '[2,0,2]'    },
    { input: '[1,2,3]\n[1,2,3]\n3',                  output: '[0,1,3]'    },
    { input: '[10,20,30]\n[1,2,5,10]\n100',           output: '[1,2,3]'    },
    { input: '[1]\n[1]\n1',                          output: '[1]'        },
    { input: '[1]\n[1]\n2',                          output: '[0]'        },
    { input: '[5,5,5]\n[5,5,5]\n25',                  output: '[3,3,3]'    },
    { input: '[2,3,4]\n[2,3,4]\n8',                   output: '[2,2,3]'    },
    { input: '[1,2,3,4,5]\n[1,2,3,4,5]\n5',           output: '[1,2,3,5,5]'},
    { input: '[1,2,3,4,5]\n[5,4,3,2,1]\n5',           output: '[5,4,3,2,1]'},
    { input: '[3]\n[3,3,3]\n9',                       output: '[3]'        },
    { input: '[1,1000000000]\n[1,1000000000]\n1000000000', output: '[1,1]' },
    { input: '[6,7,8,9,10]\n[2,4,6,8,10]\n30',        output: '[3,3,2,2,2]'},
    { input: '[1,2,4]\n[1,2,4,8]\n8',                 output: '[3,3,3]'    },
    { input: '[5,10,15]\n[3,5,7,9]\n45',              output: '[0,1,3]'    },
  ],

  // -------------------------------------------------------------------------
  // SEARCH SUGGESTIONS SYSTEM
  // Input:  products (string[]) \n searchWord (string)
  // Output: suggestion lists per prefix (string[][][])
  // -------------------------------------------------------------------------
  'search-suggestions-system': [
    { input: '["mobile","mouse","moneypluscard","monitor","mousepad"]\n"mouse"',
      output: '[["mobile","moneypluscard","monitor"],["mobile","moneypluscard","monitor"],["mouse","mousepad"],["mouse","mousepad"],["mouse","mousepad"]]' },
    { input: '["havana"]\n"havana"',
      output: '[["havana"],["havana"],["havana"],["havana"],["havana"],["havana"]]' },
    { input: '["bags","baggage","banner","box","cloths"]\n"bags"',
      output: '[["baggage","bags","banner"],["baggage","bags","banner"],["baggage","bags"],["bags"]]' },
    { input: '["apple","apple","apple"]\n"apple"',
      output: '[["apple","apple","apple"],["apple","apple","apple"],["apple","apple","apple"],["apple","apple","apple"],["apple","apple","apple"]]' },
    { input: '["ab","abc","abcd"]\n"abcd"',
      output: '[["ab","abc","abcd"],["ab","abc","abcd"],["abc","abcd"],["abcd"]]' },
    { input: '["abc","abcd","abcde"]\n"a"',
      output: '[["abc","abcd","abcde"]]' },
    { input: '["product","product2","product3"]\n"pro"',
      output: '[["product","product2","product3"],["product","product2","product3"],["product","product2","product3"]]' },
  ],

  // -------------------------------------------------------------------------
  // REPLACE WORDS
  // Input:  dictionary (string[]) \n sentence (string)
  // Output: sentence with words replaced by shortest matching root (string)
  // -------------------------------------------------------------------------
  'replace-words': [
    { input: '["cat","bat","rat"]\n"the cattle was rattled by the battery"',
      output: '"the cat was rat by the bat"' },
    { input: '["a","b","c"]\n"aadsfasf absbs bbab cadsfafs"',
      output: '"a a b c"' },
    { input: '["a","aa","aaa","aaaa"]\n"a aa a aaaa aaa aaa aaa aaaaaa bbb baba ababa"',
      output: '"a a a a a a a a bbb baba a"' },
    { input: '["catt","cat","bat","hand"]\n"the cattle was rattled by the battery"',
      output: '"the cat was rattled by the bat"' },
    { input: '["ac","ab"]\n"it is abnormal that this solution is accepted"',
      output: '"it is ab that this solution is ac"' },
    { input: '["e","k","c","harqp","h","gsafc"]\n"the quick brown fox jumps over the lazy dog"',
      output: '"the k brown fox jumps over the lazy dog"' },
    { input: '["de","duck"]\n"dear duck"',
      output: '"de duck"' },
    { input: '["root","r"]\n"roots rootless"',
      output: '"r r"' },
    { input: '["apple"]\n"apple apples applesauce"',
      output: '"apple apple apple"' },
    { input: '["cat"]\n"cat category"',
      output: '"cat cat"' },
  ],

  // -------------------------------------------------------------------------
  // MINIMUM REMOVE TO MAKE VALID PARENTHESES
  // Input:  s (string)
  // Output: resulting valid string (string)
  // -------------------------------------------------------------------------
  'minimum-remove-to-make-valid-parentheses': [
    { input: '"lee(t(c)o)de)"',    output: '"lee(t(c)o)de"'  },
    { input: '"a)b(c)d"',          output: '"ab(c)d"'         },
    { input: '"))(("',             output: '""'               },
    { input: '"(a("',              output: '"(a)"'            },
    { input: '"()"',               output: '"()"'             },
    { input: '"(("',               output: '""'               },
    { input: '"))"',               output: '""'               },
    { input: '"abc"',              output: '"abc"'            },
    { input: '"()()"',             output: '"()()"'           },
    { input: '""',                 output: '""'               },
    { input: '"(ab)"',             output: '"(ab)"'           },
    { input: '"a)b)c)d"',          output: '"abc d"'          },
    { input: '"a(b(c(d)"',         output: '"a(b(cd)"'        },
    { input: '"a)b(c"',            output: '"ab(c)"'          },
    { input: '"((a)b"',            output: '"((a)b)"'         },
  ],

  // -------------------------------------------------------------------------
  // BASIC CALCULATOR II
  // Input:  s (string) — expression with +,-,*,/ and spaces
  // Output: result (int)
  // -------------------------------------------------------------------------
  'basic-calculator-ii': [
    { input: '"3+2*2"',             output: '7'    },
    { input: '" 3/2 "',            output: '1'    },
    { input: '" 3+5 / 2 "',        output: '5'    },
    { input: '"1+1"',              output: '2'    },
    { input: '"2*3+4"',            output: '10'   },
    { input: '"14-3/2"',           output: '13'   },
    { input: '"1-1+1"',            output: '1'    },
    { input: '"10+10"',            output: '20'   },
    { input: '"2*3*4"',            output: '24'   },
    { input: '"4/2/2"',            output: '1'    },
    { input: '"2+3*4-5"',          output: '9'    },
    { input: '"100*2+12"',         output: '212'  },
    { input: '"100*2/400"',        output: '0'    },
    { input: '"3+2*2-1"',          output: '6'    },
    { input: '"1*2-3/4+5*6-7*8+9/10"', output: '-24' },
    { input: '"0"',                output: '0'    },
    { input: '"42"',               output: '42'   },
    { input: '"3*5+2/1"',          output: '17'   },
    { input: '"10+5-2*3+1"',       output: '10'   },
    { input: '"100+200*300-500/5"', output: '60000' },
  ],

  // -------------------------------------------------------------------------
  // ELIMINATE MAXIMUM NUMBER OF MONSTERS
  // Input:  dist (int[]) — initial distances \n speed (int[])
  // Output: maximum monsters eliminated (int)
  // -------------------------------------------------------------------------
  'eliminate-maximum-number-of-monsters': [
    { input: '[1,3,4]\n[1,1,1]',        output: '3' },
    { input: '[1,1,2,3]\n[1,1,1,1]',    output: '1' },
    { input: '[3,2,4]\n[5,3,2]',        output: '1' },
    { input: '[3,5,7,8,9]\n[2,3,4,5,3]', output: '3' },
    { input: '[1]\n[1]',                output: '1' },
    { input: '[1]\n[2]',                output: '1' },
    { input: '[3]\n[1]',                output: '1' },
    { input: '[1,2,3]\n[1,2,3]',        output: '3' },
    { input: '[4,3,12,6,8]\n[2,1,1,2,4]', output: '3' },
    { input: '[2,2,2,2]\n[1,1,1,1]',    output: '2' },
    { input: '[5,5,5]\n[1,1,1]',        output: '3' },
    { input: '[1,2,3,4,5]\n[5,4,3,2,1]', output: '1' },
    { input: '[100,100,100]\n[1,2,3]',   output: '3' },
    { input: '[3,2,1]\n[1,1,1]',        output: '1' },
    { input: '[4,2,6,3,8]\n[1,1,2,2,4]', output: '3' },
  ],

  // -------------------------------------------------------------------------
  // DETECT SQUARES
  // Input:  ops (string[]) — "DetectSquares"|"add:x:y"|"count:x:y"
  // Output: results (string[])
  // -------------------------------------------------------------------------
  'detect-squares': [
    { input: '["DetectSquares","add:3:10","add:11:2","add:3:2","count:11:10","count:14:8","add:11:2","count:11:10"]',
      output: '["null","null","null","null","1","0","null","2"]' },
    { input: '["DetectSquares","add:0:0","add:0:2","add:2:0","count:2:2"]',
      output: '["null","null","null","null","1"]' },
    { input: '["DetectSquares","count:0:0"]',
      output: '["null","0"]' },
    { input: '["DetectSquares","add:0:0","add:1:0","add:0:1","add:1:1","count:0:0","count:1:1"]',
      output: '["null","null","null","null","null","1","1"]' },
    { input: '["DetectSquares","add:1:1","add:1:3","add:3:1","count:3:3","add:3:3","count:3:3","count:1:1"]',
      output: '["null","null","null","null","1","null","2","2"]' },
  ],

  // -------------------------------------------------------------------------
  // IMPLEMENT MAGIC DICTIONARY
  // Input:  ops (string[]) — "MagicDictionary"|"buildDict:w1,w2,..."|"search:word"
  // Output: results (string[])
  // -------------------------------------------------------------------------
  'implement-magic-dictionary': [
    { input: '["MagicDictionary","buildDict:hello,leetcode","search:hello","search:hhllo","search:hell","search:leetcoded"]',
      output: '["null","null","false","true","false","false"]' },
    { input: '["MagicDictionary","buildDict:hello,world","search:world","search:worlds","search:worle","search:wrold"]',
      output: '["null","null","false","false","true","true"]' },
    { input: '["MagicDictionary","buildDict:abc","search:abc","search:abd","search:abcd"]',
      output: '["null","null","false","true","false"]' },
    { input: '["MagicDictionary","buildDict:a","search:b","search:a"]',
      output: '["null","null","true","false"]' },
    { input: '["MagicDictionary","buildDict:hello","search:hello","search:hxllo","search:hxxlo"]',
      output: '["null","null","false","true","false"]' },
  ],

  // -------------------------------------------------------------------------
  // REMOVE ALL ADJACENT DUPLICATES IN STRING II
  // Input:  s (string) \n k (int)
  // Output: resulting string
  // -------------------------------------------------------------------------
  'remove-all-adjacent-duplicates-in-string-ii': [
    { input: '"abcd"\n2',             output: '"abcd"'    },
    { input: '"deeedbbcccbdaa"\n3',   output: '"aa"'      },
    { input: '"pbbcggttciiippooaais"\n2', output: '"ps"'  },
    { input: '"aaa"\n2',              output: '"a"'       },
    { input: '"aaaa"\n2',              output: '""'        },
    { input: '"aabbcc"\n2',           output: '""'        },
    { input: '"ab"\n2',               output: '"ab"'      },
    { input: '"aabaa"\n2',            output: '"aaa"'     },
    { input: '"aabbaab"\n2',          output: '"b"'       },
    { input: '"abcddcba"\n2',         output: '""'        },
    { input: '"abc"\n3',              output: '"abc"'     },
    { input: '"aaabccc"\n3',          output: '"b"'       },
    { input: '"yfttttfbbbbnnnnffbgffffgbbbbgssssgthyyyy"\n4', output: '"yfgth"' },
    { input: '"a"\n1',                output: '""'        },
    { input: '"abcde"\n3',            output: '"abcde"'   },
  ],

  // -------------------------------------------------------------------------
  // PATH SUM III (already done) - skipped
  // -------------------------------------------------------------------------

  // -------------------------------------------------------------------------
  // LONGEST ZIGZAG PATH IN A BINARY TREE
  // Input:  root (BFS serialized)
  // Output: longest zigzag length (int) — measured in edges
  // -------------------------------------------------------------------------
  'longest-zigzag-path-in-a-binary-tree': [
    { input: '[1,null,1,1,1,null,null,1,1,null,1,null,null,null,1]', output: '3' },
    { input: '[1,1,1,null,1,null,null,1,1,null,1]',                  output: '4' },
    { input: '[1]',                                                   output: '0' },
    { input: '[1,2]',                                                 output: '1' },
    { input: '[1,null,2]',                                            output: '1' },
    { input: '[1,2,3,4,null,null,5]',                                 output: '2' },
    { input: '[3,9,20,null,null,15,7]',                               output: '2' },
    { input: '[1,2,null,3,4]',                                        output: '2' },
    { input: '[1,null,2,null,null,null,3]',                           output: '2' },
    { input: '[1,2,null,null,3,null,null,null,null,4]',               output: '3' },
    { input: '[1,2,3,null,4,5,6,null,7]',                            output: '3' },
    { input: '[1,2,null,3,null,4,null,5]',                           output: '2' },
    { input: '[5,8,9,10,11,12,13]',                                  output: '2' },
    { input: '[1,2,3]',                                              output: '1' },
    { input: '[1,null,2,null,null,null,3,null,null,null,null,null,null,null,4]', output: '3' },
  ],

  // -------------------------------------------------------------------------
  // FLATTEN BINARY TREE TO LINKED LIST
  // Input:  root (BFS serialized)
  // Output: flattened tree as "linked list" BFS (right children only) (int[])
  // -------------------------------------------------------------------------
  'flatten-binary-tree-to-linked-list': [
    { input: '[1,2,5,3,4,null,6]',   output: '[1,2,3,4,5,6]'   },
    { input: '[]',                   output: '[]'               },
    { input: '[0]',                  output: '[0]'              },
    { input: '[1,2]',                output: '[1,2]'            },
    { input: '[1,null,2]',           output: '[1,2]'            },
    { input: '[1,2,3]',              output: '[1,2,3]'          },
    { input: '[1,2,3,4,5,6,7]',      output: '[1,2,4,5,3,6,7]' },
    { input: '[3,9,20,null,null,15,7]', output: '[3,9,20,15,7]' },
    { input: '[1,2,3,4,null,null,5]', output: '[1,2,4,3,5]'    },
    { input: '[1,2,null,3]',         output: '[1,2,3]'          },
    { input: '[1,null,2,null,null,null,3]', output: '[1,2,3]'   },
    { input: '[5,4,8,11,null,13,4,7,2,null,null,5,1]', output: '[5,4,11,7,2,8,13,4,5,1]' },
    { input: '[1,2,3,4,5,6]',        output: '[1,2,4,5,3,6]'   },
    { input: '[4,2,6,1,3,5,7]',      output: '[4,2,1,3,6,5,7]' },
    { input: '[1,2,null,3,4]',       output: '[1,2,3,4]'        },
  ],

  // -------------------------------------------------------------------------
  // MAXIMUM WIDTH OF BINARY TREE
  // Input:  root (BFS serialized)
  // Output: maximum width (int) — includes null nodes between endpoints
  // -------------------------------------------------------------------------
  'maximum-width-of-binary-tree': [
    { input: '[1,3,2,5,3,null,9]',                   output: '4' },
    { input: '[1,3,null,5,3]',                       output: '2' },
    { input: '[1,3,2,5]',                            output: '2' },
    { input: '[1]',                                  output: '1' },
    { input: '[1,2]',                                output: '1' },
    { input: '[1,null,2]',                           output: '1' },
    { input: '[1,2,3]',                              output: '2' },
    { input: '[1,1,1,1,1,1,1]',                      output: '4' },
    { input: '[0,0,0,0,null,0,null,null,0]',          output: '4' },
    { input: '[1,3,2,5,null,null,9,6,null,7]',       output: '8' },
    { input: '[1,1,1,null,1,null,null,null,null,null,1]', output: '4' },
    { input: '[1,2,3,4,5,6,7]',                     output: '4' },
    { input: '[1,2,3,null,4,null,5]',               output: '4' },
    { input: '[1,3,null,5,null,null,null,3]',        output: '2' },
    { input: '[1,3,2,5,null,null,9,6,null,7,null,null,null,null,null,null,8]', output: '8' },
  ],

  // -------------------------------------------------------------------------
  // ONES AND ZEROES
  // Input:  strs (string[]) \n m (int) \n n (int)
  // Output: max number of strings that fit within m 0s and n 1s (int)
  // -------------------------------------------------------------------------
  'ones-and-zeroes': [
    { input: '["10","0001","111001","1","0"]\n5\n3',    output: '4' },
    { input: '["10","0","1"]\n1\n1',                   output: '2' },
    { input: '["0","1"]\n1\n1',                        output: '2' },
    { input: '["10","0001"]\n5\n3',                    output: '2' },
    { input: '["1"]\n1\n1',                            output: '1' },
    { input: '["0"]\n1\n0',                            output: '1' },
    { input: '["0"]\n0\n1',                            output: '0' },
    { input: '["10","1","0"]\n1\n1',                   output: '2' },
    { input: '["0","00"]\n2\n0',                       output: '2' },
    { input: '["11","0"]\n3\n2',                       output: '2' },
    { input: '["10","0001","111001","1","0"]\n3\n4',   output: '3' },
    { input: '["10","0001","111001","1","0"]\n1\n1',   output: '2' },
    { input: '["100","0001","1111"]\n4\n3',            output: '2' },
    { input: '["1","0","10","01","11"]\n3\n3',         output: '5' },
    { input: '["111","1000","1000","1001"]\n9\n3',     output: '2' },
    { input: '["0","00","000"]\n3\n0',                 output: '3' },
    { input: '["1","0","1","0"]\n2\n2',                output: '4' },
    { input: '["1"]\n0\n1',                            output: '1' },
    { input: '["1"]\n0\n0',                            output: '0' },
    { input: '["1","0","10"]\n2\n2',                   output: '3' },
  ],

  // -------------------------------------------------------------------------
  // LAST STONE WEIGHT II
  // Input:  stones (int[])
  // Output: minimum possible remaining weight (int)
  // -------------------------------------------------------------------------
  'last-stone-weight-ii': [
    { input: '[2,7,4,1,8,1]',    output: '1' },
    { input: '[31,26,33,21,40]', output: '5' },
    { input: '[1,2]',            output: '1' },
    { input: '[1]',              output: '1' },
    { input: '[1,1]',            output: '0' },
    { input: '[2,2]',            output: '0' },
    { input: '[1,2,3]',          output: '0' },
    { input: '[1,2,4]',          output: '1' },
    { input: '[3,3,3]',          output: '3' },
    { input: '[4,4,4,4]',        output: '0' },
    { input: '[1,2,3,4,5]',      output: '1' },
    { input: '[10]',             output: '10'},
    { input: '[10,10]',          output: '0' },
    { input: '[1,1,1,1,1]',      output: '1' },
    { input: '[5,4,3,2,1]',      output: '1' },
    { input: '[2,3,4,5,6,7]',    output: '1' },
    { input: '[1,2,3,4,5,6,7,8,9,10]', output: '1' },
    { input: '[10,9,8,7,6,5,4,3,2,1]', output: '1' },
    { input: '[3,7,5,1,2]',      output: '0' },
    { input: '[4,5,8,3]',        output: '0' },
  ],

  // -------------------------------------------------------------------------
  // ALL NODES DISTANCE K IN BINARY TREE
  // Input:  root (BFS) \n target (int) \n k (int)
  // Output: all node values at distance k from target (int[])
  // -------------------------------------------------------------------------
  'all-nodes-distance-k-in-binary-tree': [
    { input: '[3,5,1,6,2,0,8,null,null,7,4]\n5\n2',  output: '[7,4,1]'   },
    { input: '[1]\n1\n3',                             output: '[]'        },
    { input: '[1]\n1\n0',                             output: '[1]'       },
    { input: '[0,1,null,3,2]\n2\n1',                  output: '[1]'       },
    { input: '[1,2,3]\n1\n2',                         output: '[2,3]'     },
    { input: '[1,2,3]\n1\n0',                         output: '[1]'       },
    { input: '[1,2,3]\n2\n1',                         output: '[1,3]'     },
    { input: '[1,2,3,4,5]\n2\n2',                    output: '[4,5,3]'   },
    { input: '[3,5,1,6,2,0,8,null,null,7,4]\n3\n2',  output: '[5,0,8]'   },
    { input: '[3,5,1,6,2,0,8,null,null,7,4]\n7\n2',  output: '[2,1]'     },
    { input: '[3,5,1,6,2,0,8,null,null,7,4]\n6\n1',  output: '[5]'       },
    { input: '[3,5,1,6,2,0,8,null,null,7,4]\n1\n0',  output: '[1]'       },
    { input: '[1,2,null,3,null,4]\n4\n3',             output: '[1]'       },
    { input: '[1,2,null,3,null,4]\n4\n2',             output: '[2]'       },
    { input: '[1,2,null,3,null,4]\n2\n2',             output: '[4]'       },
  ],

  // -------------------------------------------------------------------------
  // POPULATING NEXT RIGHT POINTERS IN EACH NODE
  // Input:  root (BFS serialized perfect binary tree)
  // Output: BFS level-order node values (int[])
  // -------------------------------------------------------------------------
  'populating-next-right-pointers-in-each-node': [
    { input: '[1,2,3,4,5,6,7]',      output: '[1,2,3,4,5,6,7]' },
    { input: '[]',                   output: '[]'               },
    { input: '[1]',                  output: '[1]'              },
    { input: '[1,2,3]',              output: '[1,2,3]'          },
    { input: '[1,2,3,4,5,6,7]',      output: '[1,2,3,4,5,6,7]' },
    { input: '[1,2,3,null,null,4,5]', output: '[1,2,3,4,5]'    },
    { input: '[4,2,6,1,3,5,7]',      output: '[4,2,6,1,3,5,7]' },
    { input: '[1,2,null,3,4]',       output: '[1,2,3,4]'        },
    { input: '[1,1,1,1,1,1,1]',      output: '[1,1,1,1,1,1,1]' },
    { input: '[5,1,4,null,null,3,6]', output: '[5,1,4,3,6]'    },
  ],

  // -------------------------------------------------------------------------
  // REORDER ROUTES TO MAKE ALL PATHS LEAD TO THE CITY ZERO
  // Input:  n (int) \n connections (int[][])
  // Output: minimum number of edges to reverse (int)
  // -------------------------------------------------------------------------
  'reorder-routes-to-make-all-paths-lead-to-the-city-zero': [
    { input: '6\n[[0,1],[1,3],[2,3],[4,0],[4,5]]',           output: '3' },
    { input: '5\n[[1,0],[1,2],[3,2],[3,4]]',                 output: '2' },
    { input: '3\n[[1,0],[2,0]]',                             output: '0' },
    { input: '2\n[[0,1]]',                                   output: '1' },
    { input: '2\n[[1,0]]',                                   output: '0' },
    { input: '4\n[[0,1],[2,0],[3,0]]',                       output: '0' },
    { input: '4\n[[1,0],[2,1],[3,2]]',                       output: '0' },
    { input: '4\n[[0,1],[0,2],[0,3]]',                       output: '3' },
    { input: '7\n[[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]]',     output: '6' },
    { input: '7\n[[1,0],[2,0],[3,1],[4,1],[5,2],[6,2]]',     output: '0' },
    { input: '5\n[[0,1],[0,2],[1,3],[2,4]]',                 output: '4' },
    { input: '5\n[[1,0],[2,0],[3,1],[4,2]]',                 output: '0' },
    { input: '6\n[[0,1],[2,0],[3,2],[4,3],[5,4]]',           output: '0' },
    { input: '6\n[[0,1],[0,2],[1,3],[1,4],[2,5]]',           output: '5' },
    { input: '3\n[[0,2],[1,2]]',                             output: '0' },
  ],

  // -------------------------------------------------------------------------
  // SNAKES AND LADDERS
  // Input:  board (int[][]) — n×n snakes/ladders board (-1 = none)
  // Output: minimum dice rolls to reach square n^2, or -1
  // -------------------------------------------------------------------------
  'snakes-and-ladders': [
    { input: '[[-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1],[-1,35,-1,-1,13,-1],[-1,-1,-1,-1,-1,-1],[-1,15,-1,-1,-1,-1]]', output: '4' },
    { input: '[[-1,-1],[-1,3]]',                                                                              output: '1' },
    { input: '[[-1,-1],[-1,-1]]',                                                                            output: '1' },
    { input: '[[-1,-1,-1],[-1,-1,-1],[-1,-1,-1]]',                                                          output: '2' },
    { input: '[[-1,-1,-1,-1],[-1,-1,-1,-1],[-1,-1,-1,-1],[-1,-1,-1,-1]]',                                  output: '2' },
    { input: '[[-1,4],[-1,3]]',                                                                              output: '1' },
    { input: '[[1,-1],[-1,-1]]',                                                                             output: '1' },
    { input: '[[-1,-1,-1],[1,-1,3],[-1,-1,-1]]',                                                            output: '1' },
    { input: '[[-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1]]', output: '2' },
    { input: '[[-1,-1,30],[-1,-1,-1],[-1,-1,-1]]',                                                          output: '1' },
    { input: '[[2,-1],[13,-1]]',                                                                             output: '2' },
    { input: '[[-1,6],[-1,-1]]',                                                                             output: '1' },
    { input: '[[1,1,-1],[1,1,1],[-1,1,1]]',                                                                  output: '1' },
    { input: '[[-1,1,1,1,1,1],[-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1]]', output: '-1' },
    { input: '[[-1,-1,-1,-1,-1,11],[-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1]]', output: '1' },
  ],

  // -------------------------------------------------------------------------
  // INSERT DELETE GETRANDOM O(1) — correct slug
  // -------------------------------------------------------------------------
  'insert-delete-getrandom-o-1': [
    { input: '["RandomizedSet","insert:1","remove:2","insert:2","getRandom","remove:1","insert:2","getRandom"]',
      output: '["null","true","false","true","1_or_2","true","false","2"]' },
    { input: '["RandomizedSet","insert:1","getRandom"]',
      output: '["null","true","1"]' },
    { input: '["RandomizedSet","insert:0","insert:1","remove:0","getRandom"]',
      output: '["null","true","true","true","1"]' },
    { input: '["RandomizedSet","insert:1","insert:1","getRandom","remove:1","insert:1"]',
      output: '["null","true","false","1","true","true"]' },
    { input: '["RandomizedSet","insert:3","insert:1","remove:2","insert:3"]',
      output: '["null","true","true","false","false"]' },
    { input: '["RandomizedSet","remove:0","remove:0","insert:0","getRandom","remove:0","insert:0"]',
      output: '["null","false","false","true","0","true","true"]' },
  ],

  // -------------------------------------------------------------------------
  // REORDER LIST
  // Input:  head (int[]) — singly linked list values
  // Output: reordered list values (int[])
  //   Reorder: L0 → Ln → L1 → Ln-1 → L2 → …
  // -------------------------------------------------------------------------
  'reorder-list': [
    { input: '[1,2,3,4]',           output: '[1,4,2,3]'         },
    { input: '[1,2,3,4,5]',         output: '[1,5,2,4,3]'       },
    { input: '[1]',                 output: '[1]'               },
    { input: '[1,2]',               output: '[1,2]'             },
    { input: '[1,2,3]',             output: '[1,3,2]'           },
    { input: '[1,2,3,4,5,6]',       output: '[1,6,2,5,3,4]'     },
    { input: '[1,2,3,4,5,6,7]',     output: '[1,7,2,6,3,5,4]'   },
    { input: '[1,1,1,1]',           output: '[1,1,1,1]'         },
    { input: '[1,2,3,4,5,6,7,8]',   output: '[1,8,2,7,3,6,4,5]' },
    { input: '[0,1,2]',             output: '[0,2,1]'           },
    { input: '[1,2,3,4,5,6,7,8,9]', output: '[1,9,2,8,3,7,4,6,5]' },
    { input: '[5,10,15,20]',        output: '[5,20,10,15]'      },
    { input: '[1,100]',             output: '[1,100]'           },
    { input: '[1,2,3,4,5,6,7,8,9,10]', output: '[1,10,2,9,3,8,4,7,5,6]' },
    { input: '[3,2,1]',             output: '[3,1,2]'           },
  ],

  // -------------------------------------------------------------------------
  // REMOVE NTH NODE FROM END OF LIST
  // Input:  head (int[]) \n n (int)
  // Output: resulting list values (int[])
  // -------------------------------------------------------------------------
  'remove-nth-node-from-end-of-list': [
    { input: '[1,2,3,4,5]\n2',    output: '[1,2,3,5]' },
    { input: '[1]\n1',            output: '[]'         },
    { input: '[1,2]\n1',          output: '[1]'        },
    { input: '[1,2]\n2',          output: '[2]'        },
    { input: '[1,2,3]\n3',        output: '[2,3]'      },
    { input: '[1,2,3]\n2',        output: '[1,3]'      },
    { input: '[1,2,3]\n1',        output: '[1,2]'      },
    { input: '[1,2,3,4,5]\n5',    output: '[2,3,4,5]' },
    { input: '[1,2,3,4,5]\n1',    output: '[1,2,3,4]' },
    { input: '[1,2,3,4]\n2',      output: '[1,2,4]'   },
    { input: '[1,2,3,4,5,6]\n3',  output: '[1,2,3,5,6]' },
    { input: '[10,20,30]\n2',     output: '[10,30]'   },
    { input: '[5]\n1',            output: '[]'         },
    { input: '[1,2,3,4,5,6,7]\n4', output: '[1,2,3,5,6,7]' },
    { input: '[1,2,3,4,5]\n3',    output: '[1,2,4,5]' },
  ],

  // -------------------------------------------------------------------------
  // COPY LIST WITH RANDOM POINTER
  // Input:  list (int[][]) — [[val,randomIdx],...] where randomIdx is null or index
  // Output: copied list (int[][])
  // -------------------------------------------------------------------------
  'copy-list-with-random-pointer': [
    { input: '[[7,null],[13,0],[11,4],[10,2],[1,0]]',      output: '[[7,null],[13,0],[11,4],[10,2],[1,0]]' },
    { input: '[[1,1],[2,1]]',                              output: '[[1,1],[2,1]]'                        },
    { input: '[[3,null],[3,0],[3,null]]',                  output: '[[3,null],[3,0],[3,null]]'             },
    { input: '[]',                                        output: '[]'                                   },
    { input: '[[1,null]]',                                output: '[[1,null]]'                           },
    { input: '[[1,0]]',                                   output: '[[1,0]]'                              },
    { input: '[[1,null],[2,0],[3,1]]',                     output: '[[1,null],[2,0],[3,1]]'               },
    { input: '[[5,null],[4,0]]',                          output: '[[5,null],[4,0]]'                     },
    { input: '[[1,null],[2,null],[3,null]]',               output: '[[1,null],[2,null],[3,null]]'          },
    { input: '[[1,0],[2,1],[3,2]]',                       output: '[[1,0],[2,1],[3,2]]'                  },
    { input: '[[1,2],[2,0],[3,1],[4,null]]',              output: '[[1,2],[2,0],[3,1],[4,null]]'         },
    { input: '[[0,null],[1,0]]',                          output: '[[0,null],[1,0]]'                     },
    { input: '[[1,null],[2,null]]',                       output: '[[1,null],[2,null]]'                  },
    { input: '[[1,1],[2,null]]',                          output: '[[1,1],[2,null]]'                     },
    { input: '[[5,4],[4,3],[3,2],[2,1],[1,0]]',           output: '[[5,4],[4,3],[3,2],[2,1],[1,0]]'      },
  ],

  // -------------------------------------------------------------------------
  // ADD TWO NUMBERS
  // Input:  l1 (int[]) \n l2 (int[]) — digits stored in reverse order
  // Output: sum as reversed linked list (int[])
  // -------------------------------------------------------------------------
  'add-two-numbers': [
    { input: '[2,4,3]\n[5,6,4]',            output: '[7,0,8]'       },
    { input: '[0]\n[0]',                    output: '[0]'           },
    { input: '[9,9,9,9,9,9,9]\n[9,9,9,9]', output: '[8,9,9,9,0,0,0,1]' },
    { input: '[1]\n[9]',                    output: '[0,1]'         },
    { input: '[5]\n[5]',                    output: '[0,1]'         },
    { input: '[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]\n[5,6,4]', output: '[6,6,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]' },
    { input: '[1,2,3]\n[4,5,6]',            output: '[5,7,9]'       },
    { input: '[9]\n[1]',                    output: '[0,1]'         },
    { input: '[1,8]\n[0]',                  output: '[1,8]'         },
    { input: '[2,4,9]\n[5,6,4,9]',          output: '[7,0,4,0,1]'   },
    { input: '[1]\n[1,2]',                  output: '[2,2]'         },
    { input: '[1,2]\n[1]',                  output: '[2,2]'         },
    { input: '[9,9]\n[1]',                  output: '[0,0,1]'       },
    { input: '[5,0,0]\n[5,0,0]',            output: '[0,1,0]'       },
    { input: '[1,0,0,1]\n[9,8,7,6]',        output: '[0,9,7,7]'     },
  ],

  // -------------------------------------------------------------------------
  // MERGE K SORTED LISTS
  // Input:  lists (int[][]) — multiple sorted linked lists
  // Output: merged sorted list (int[])
  // -------------------------------------------------------------------------
  'merge-k-sorted-lists': [
    { input: '[[1,4,5],[1,3,4],[2,6]]',    output: '[1,1,2,3,4,4,5,6]' },
    { input: '[]',                         output: '[]'                 },
    { input: '[[]]',                       output: '[]'                 },
    { input: '[[1]]',                      output: '[1]'                },
    { input: '[[1,2],[3,4]]',              output: '[1,2,3,4]'          },
    { input: '[[2],[1]]',                  output: '[1,2]'              },
    { input: '[[1,2,3],[4,5,6],[7,8,9]]',  output: '[1,2,3,4,5,6,7,8,9]' },
    { input: '[[1],[0]]',                  output: '[0,1]'              },
    { input: '[[-1,0,1],[-2,-1,0]]',       output: '[-2,-1,-1,0,0,1]'  },
    { input: '[[1,3,5,7],[2,4,6,8]]',      output: '[1,2,3,4,5,6,7,8]' },
    { input: '[[1],[2],[3]]',              output: '[1,2,3]'            },
    { input: '[[],[],[]]',                 output: '[]'                 },
    { input: '[[5,10],[1,3,4],[2,6]]',     output: '[1,2,3,4,5,6,10]'  },
    { input: '[[1,4,7],[2,5,8],[3,6,9]]',  output: '[1,2,3,4,5,6,7,8,9]' },
    { input: '[[1,2,3,4,5]]',             output: '[1,2,3,4,5]'        },
  ],

  // -------------------------------------------------------------------------
  // REVERSE NODES IN K-GROUP
  // Input:  head (int[]) \n k (int)
  // Output: resulting list after reversing in k-groups (int[])
  // -------------------------------------------------------------------------
  'reverse-nodes-in-k-group': [
    { input: '[1,2,3,4,5]\n2',     output: '[2,1,4,3,5]'           },
    { input: '[1,2,3,4,5]\n3',     output: '[3,2,1,4,5]'           },
    { input: '[1,2,3,4,5]\n1',     output: '[1,2,3,4,5]'           },
    { input: '[1,2,3,4,5]\n5',     output: '[5,4,3,2,1]'           },
    { input: '[1]\n1',             output: '[1]'                   },
    { input: '[1,2]\n2',           output: '[2,1]'                 },
    { input: '[1,2,3,4,5,6]\n2',   output: '[2,1,4,3,6,5]'         },
    { input: '[1,2,3,4,5,6]\n3',   output: '[3,2,1,6,5,4]'         },
    { input: '[1,2,3,4,5,6]\n4',   output: '[4,3,2,1,5,6]'         },
    { input: '[1,2,3,4,5,6,7,8]\n3', output: '[3,2,1,6,5,4,7,8]'  },
    { input: '[1,2,3,4,5,6,7,8]\n4', output: '[4,3,2,1,8,7,6,5]'  },
    { input: '[1,2]\n1',           output: '[1,2]'                 },
    { input: '[1,2,3]\n3',         output: '[3,2,1]'               },
    { input: '[1,2,3,4]\n2',       output: '[2,1,4,3]'             },
    { input: '[1,2,3,4,5,6,7]\n2', output: '[2,1,4,3,6,5,7]'      },
  ],

  // -------------------------------------------------------------------------
  // MAXIMUM SUBARRAY
  // Input:  nums (int[])
  // Output: largest sum contiguous subarray (int)
  // -------------------------------------------------------------------------
  'maximum-subarray': [
    { input: '[-2,1,-3,4,-1,2,1,-5,4]',  output: '6'  },
    { input: '[1]',                       output: '1'  },
    { input: '[5,4,-1,7,8]',              output: '23' },
    { input: '[-1]',                      output: '-1' },
    { input: '[-2,-1]',                   output: '-1' },
    { input: '[1,2,3,4,5]',              output: '15' },
    { input: '[-5,-4,-3,-2,-1]',          output: '-1' },
    { input: '[0]',                       output: '0'  },
    { input: '[1,-1,1,-1,1]',             output: '1'  },
    { input: '[-2,1]',                    output: '1'  },
    { input: '[2,-1,2,1,-1]',             output: '4'  },
    { input: '[-1,0,1]',                  output: '1'  },
    { input: '[1,-2,3,4,-5,6]',           output: '8'  },
    { input: '[-2,2,-1,3,-4,2]',          output: '4'  },
    { input: '[4,-1,2,-7,3,4]',           output: '7'  },
    { input: '[-1,-2,-3,-4]',             output: '-1' },
    { input: '[1,2,-1,3]',               output: '5'  },
    { input: '[100,-50,100]',             output: '150'},
    { input: '[-1,2,3,-9,5]',             output: '5'  },
    { input: '[0,0,0,0]',                 output: '0'  },
  ],

  // -------------------------------------------------------------------------
  // FIND DUPLICATE NUMBER (extension — find all duplicates)
  // Input:  nums (int[]) — 1..n with some duplicates
  // Output: all duplicates (int[])
  // -------------------------------------------------------------------------
  'find-duplicate-number-extension': [
    { input: '[4,3,2,7,8,2,3,1]',    output: '[2,3]'  },
    { input: '[1,1,2]',              output: '[1]'    },
    { input: '[1]',                  output: '[]'     },
    { input: '[2,2]',                output: '[2]'    },
    { input: '[1,2,3]',              output: '[]'     },
    { input: '[1,2,3,1]',            output: '[1]'    },
    { input: '[1,2,2,1]',            output: '[1,2]'  },
    { input: '[3,1,3,4,2]',          output: '[3]'    },
    { input: '[2,1,2,3,3]',          output: '[2,3]'  },
    { input: '[1,2,3,4,5,6,7,8,9,2]', output: '[2]'  },
    { input: '[1,1,1,1]',            output: '[1]'    },
    { input: '[4,4,4,4]',            output: '[4]'    },
    { input: '[1,2,3,4,5]',          output: '[]'     },
    { input: '[5,4,3,2,1,1]',        output: '[1]'    },
    { input: '[1,3,4,2,2]',          output: '[2]'    },
  ],

  // -------------------------------------------------------------------------
  // TEXT JUSTIFICATION
  // Input:  words (string[]) \n maxWidth (int)
  // Output: fully justified lines (string[])
  // -------------------------------------------------------------------------
  'text-justification': [
    { input: '["This","is","an","example","of","text","justification."]\n16', output: '["This    is    an","example  of text","justification.  "]' },
    { input: '["What","must","be","acknowledgment","shall","be"]\n16',       output: '["What   must   be","acknowledgment  ","shall be        "]' },
    { input: '["Science","is","what","we","understand","well","enough","to","explain","to","a","computer.","Art","is","everything","else","we","do"]\n20', output: '["Science  is  what we","understand      well","enough to explain to","a  computer.  Art is","everything  else  we","do                  "]' },
    { input: '["a"]\n1',   output: '["a"]'  },
    { input: '["a"]\n4',   output: '["a   "]' },
    { input: '["ab","cd","ef"]\n5', output: '["ab cd","ef   "]' },
    { input: '["Hello","World"]\n15', output: '["Hello   World  "]'  },
    { input: '["a","b","c","d","e"]\n3', output: '["a b","c d","e  "]' },
    { input: '["listen","to","many","speak","to","a","few"]\n6', output: '["listen","to    ","many  ","speak ","to   a","few   "]' },
    { input: '["The","quick","brown","fox","jumped"]\n12', output: '["The  quick ","brown   fox ","jumped      "]' },
  ],

  // -------------------------------------------------------------------------
  // NAMING A COMPANY
  // Input:  ideas (string[])
  // Output: number of valid company names (long)
  // -------------------------------------------------------------------------
  'naming-a-company': [
    { input: '["coffee","donuts","time","toffee"]',   output: '6'  },
    { input: '["lack","back"]',                       output: '0'  },
    { input: '["aa","ab","ac","ad"]',                 output: '6'  },
    { input: '["a","b","c"]',                         output: '6'  },
    { input: '["aa","ab","ba","bb"]',                 output: '4'  },
    { input: '["ab","cd"]',                           output: '2'  },
    { input: '["abc","bcd","cde"]',                   output: '6'  },
    { input: '["apple","orange"]',                    output: '2'  },
    { input: '["ab"]',                               output: '0'  },
    { input: '["xyz","yxz","zxy"]',                   output: '6'  },
    { input: '["aaa","bbb"]',                        output: '2'  },
    { input: '["ax","ex","ix","ox","ux"]',            output: '20' },
    { input: '["ab","ac","bc"]',                      output: '2'  },
    { input: '["aa","ba","ca","ab","bb","cb"]',       output: '4'  },
    { input: '["ab","cd","ef","gh"]',                 output: '12' },
  ],

  // -------------------------------------------------------------------------
  // CANDY
  // Input:  ratings (int[])
  // Output: minimum candies needed (int)
  // -------------------------------------------------------------------------
  'candy': [
    { input: '[1,0,2]',                 output: '5'  },
    { input: '[1,2,2]',                 output: '4'  },
    { input: '[1]',                     output: '1'  },
    { input: '[1,2,3,4,5]',             output: '15' },
    { input: '[5,4,3,2,1]',             output: '15' },
    { input: '[1,2,3,2,1]',             output: '9'  },
    { input: '[1,3,2,2,1]',             output: '7'  },
    { input: '[0,0,0]',                 output: '3'  },
    { input: '[1,1,1]',                 output: '3'  },
    { input: '[2,1]',                   output: '3'  },
    { input: '[1,2]',                   output: '3'  },
    { input: '[1,0,2,1,3,2]',           output: '9'  },
    { input: '[4,3,2,1,2,3,4]',         output: '17' },
    { input: '[1,6,10,8,7,3,2]',        output: '18' },
    { input: '[1,2,87,87,87,2,1]',      output: '13' },
    { input: '[0,1,2,3,4,5]',           output: '21' },
    { input: '[5,4,3,2,1,0]',           output: '21' },
    { input: '[1,2,3,1,0]',             output: '9'  },
    { input: '[1,3,4,5,2]',             output: '11' },
    { input: '[1,2,3,2,1,2,3]',         output: '13' },
  ],

  // -------------------------------------------------------------------------
  // TRAPPING RAIN WATER II
  // Input:  heightMap (int[][])
  // Output: total water that can be trapped (int)
  // -------------------------------------------------------------------------
  'trapping-rain-water-ii': [
    { input: '[[1,4,3,1,3,2],[3,2,1,3,2,4],[2,3,3,2,3,1]]',      output: '4'  },
    { input: '[[3,3,3,3,3],[3,2,2,2,3],[3,2,1,2,3],[3,2,2,2,3],[3,3,3,3,3]]', output: '10' },
    { input: '[[1,1,1,1],[1,1,1,1],[1,1,1,1]]',                   output: '0'  },
    { input: '[[1,2,3],[3,2,1],[2,3,1]]',                         output: '0'  },
    { input: '[[5,5,5],[5,1,5],[5,5,5]]',                         output: '4'  },
    { input: '[[1,1],[1,1]]',                                     output: '0'  },
    { input: '[[12,13,1,12],[13,4,13,12],[13,8,10,12],[12,13,12,12],[13,13,13,13]]', output: '14' },
    { input: '[[5,8,7,7],[5,2,1,5],[7,1,7,1],[8,9,6,9],[9,8,9,9]]', output: '12' },
    { input: '[[1,2],[2,1]]',                                     output: '0'  },
    { input: '[[2,2,2],[2,1,2],[2,2,2]]',                         output: '1'  },
  ],

  // -------------------------------------------------------------------------
  // MAX POINTS ON A LINE
  // Input:  points (int[][])
  // Output: max points on a single line (int)
  // -------------------------------------------------------------------------
  'max-points-on-a-line': [
    { input: '[[1,1],[2,2],[3,3]]',              output: '3' },
    { input: '[[1,1],[3,2],[5,3],[4,1],[2,3],[1,4]]', output: '4' },
    { input: '[[0,0]]',                          output: '1' },
    { input: '[[0,0],[1,1]]',                    output: '2' },
    { input: '[[0,0],[1,0],[2,0]]',              output: '3' },
    { input: '[[0,0],[0,1],[0,2]]',              output: '3' },
    { input: '[[1,1],[1,2],[1,3]]',              output: '3' },
    { input: '[[1,1],[2,1],[3,1]]',              output: '3' },
    { input: '[[0,0],[1,1],[0,1],[1,0]]',        output: '2' },
    { input: '[[2,3],[3,3],[-5,3]]',             output: '3' },
    { input: '[[1,1],[2,2],[3,3],[4,4]]',        output: '4' },
    { input: '[[7,3],[19,14],[-6,22],[6,28],[16,4],[-2,17],[5,25],[19,5]]', output: '4' },
    { input: '[[0,0],[1,65536],[65536,0]]',      output: '2' },
    { input: '[[1,2],[2,4],[3,6]]',              output: '3' },
    { input: '[[3,1],[12,3],[3,1]]',             output: '3' },
  ],

  // -------------------------------------------------------------------------
  // SUDOKU SOLVER
  // Input:  board (string[][]) — 9x9, '.' for empty
  // Output: solved board (string[][])
  // -------------------------------------------------------------------------
  'sudoku-solver': [
    { input: '[["5","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]]',
      output: '[["5","3","4","6","7","8","9","1","2"],["6","7","2","1","9","5","3","4","8"],["1","9","8","3","4","2","5","6","7"],["8","5","9","7","6","1","4","2","3"],["4","2","6","8","5","3","7","9","1"],["7","1","3","9","2","4","8","5","6"],["9","6","1","5","3","7","2","8","4"],["2","8","7","4","1","9","6","3","5"],["3","4","5","2","8","6","1","7","9"]]' },
    { input: '[[".",".","9","7","4","8",".",".","."],["7",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",",","."],[".","7",".",".",".",".","3",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".","2",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."],[".",".",".",".",".",".",".",".","."]]]',
      output: 'varies'  },
  ],

  // -------------------------------------------------------------------------
  // N-QUEENS II
  // Input:  n (int)
  // Output: number of distinct solutions (int)
  // -------------------------------------------------------------------------
  'n-queens-ii': [
    { input: '1',  output: '1'   },
    { input: '2',  output: '0'   },
    { input: '3',  output: '0'   },
    { input: '4',  output: '2'   },
    { input: '5',  output: '10'  },
    { input: '6',  output: '4'   },
    { input: '7',  output: '40'  },
    { input: '8',  output: '92'  },
    { input: '9',  output: '352' },
  ],

  // -------------------------------------------------------------------------
  // COUNT OF SMALLER NUMBERS AFTER SELF
  // Input:  nums (int[])
  // Output: count[i] = # of smaller elements to the right (int[])
  // -------------------------------------------------------------------------
  'count-of-smaller-numbers-after-self': [
    { input: '[5,2,6,1]',            output: '[2,1,1,0]'       },
    { input: '[-1]',                 output: '[0]'             },
    { input: '[-1,-1]',              output: '[0,0]'           },
    { input: '[1]',                  output: '[0]'             },
    { input: '[1,2,3,4]',            output: '[0,0,0,0]'       },
    { input: '[4,3,2,1]',            output: '[3,2,1,0]'       },
    { input: '[1,1,1,1]',            output: '[0,0,0,0]'       },
    { input: '[2,0,1]',              output: '[2,0,0]'         },
    { input: '[5,2,6,1,3]',          output: '[3,1,2,0,0]'     },
    { input: '[3,2,1,4]',            output: '[2,1,0,0]'       },
    { input: '[1,2,1]',              output: '[0,1,0]'         },
    { input: '[5,5,5,5]',            output: '[0,0,0,0]'       },
    { input: '[1,9,7,8,5]',          output: '[0,4,1,1,0]'     },
    { input: '[-1,1,0]',             output: '[0,1,0]'         },
    { input: '[6,6,6,1,1,1]',        output: '[3,3,3,0,0,0]'   },
  ],

  // -------------------------------------------------------------------------
  // REVERSE PAIRS
  // Input:  nums (int[])
  // Output: number of reverse pairs (i<j, nums[i]>2*nums[j]) (int)
  // -------------------------------------------------------------------------
  'reverse-pairs': [
    { input: '[1,3,2,3,1]',         output: '2'  },
    { input: '[2,4,3,5,1]',         output: '3'  },
    { input: '[0]',                 output: '0'  },
    { input: '[1,2,3,4]',           output: '0'  },
    { input: '[4,3,2,1]',           output: '0'  },
    { input: '[1,1,1,1]',           output: '0'  },
    { input: '[2,1]',               output: '0'  },
    { input: '[3,1]',               output: '1'  },
    { input: '[5,1]',               output: '1'  },
    { input: '[1,2,3,1,3,2,2]',     output: '3'  },
    { input: '[6,4,5,3,2,1]',       output: '6'  },
    { input: '[-5,-1,-4,-2]',       output: '2'  },
    { input: '[1,0]',               output: '0'  },
    { input: '[4,1,2,3]',           output: '1'  },
    { input: '[2147483647,2147483646]', output: '0' },
  ],

  // -------------------------------------------------------------------------
  // THE SKYLINE PROBLEM
  // Input:  buildings (int[][]) — [left, right, height]
  // Output: key points (int[][])
  // -------------------------------------------------------------------------
  'skyline-problem': [
    { input: '[[2,9,10],[3,7,15],[5,12,12],[15,20,10],[19,24,8]]', output: '[[2,10],[3,15],[7,12],[12,0],[15,10],[20,8],[24,0]]' },
    { input: '[[0,2,3],[2,5,3]]',   output: '[[0,3],[5,0]]'       },
    { input: '[[1,2,1],[1,2,2],[1,2,3]]', output: '[[1,3],[2,0]]' },
    { input: '[[1,2,1]]',           output: '[[1,1],[2,0]]'       },
    { input: '[[1,5,11],[2,7,6],[3,9,13],[12,16,7],[14,25,3],[19,22,18],[23,29,13],[24,28,4]]',
      output: '[[1,11],[3,13],[9,0],[12,7],[14,3],[19,18],[22,3],[25,0]]' },
    { input: '[[0,5,7],[5,10,7]]',  output: '[[0,7],[10,0]]'      },
    { input: '[[0,1,1],[0,1,2]]',   output: '[[0,2],[1,0]]'       },
    { input: '[[1,2,1],[2,3,1]]',   output: '[[1,1],[3,0]]'       },
    { input: '[[1,3,3],[2,4,4],[5,6,1]]', output: '[[1,3],[2,4],[4,0],[5,1],[6,0]]' },
    { input: '[[1,2,5]]',           output: '[[1,5],[2,0]]'       },
  ],

  // -------------------------------------------------------------------------
  // SHORTEST PATH IN A GRID WITH OBSTACLES ELIMINATION
  // Input:  grid (int[][]) \n k (int) — k eliminations allowed
  // Output: shortest path length or -1
  // -------------------------------------------------------------------------
  'shortest-path-in-a-grid-with-obstacles-elimination': [
    { input: '[[0,0,0],[1,1,0],[0,0,0],[0,1,1],[0,0,0]]\n1',  output: '6'  },
    { input: '[[0,1,1],[1,1,1],[1,0,0]]\n1',                  output: '-1' },
    { input: '[[0,0,0],[1,1,0],[0,0,0]]\n0',                  output: '4'  },
    { input: '[[0,1,1],[1,1,0],[0,0,0]]\n1',                  output: '4'  },
    { input: '[[0,0,0],[0,0,0],[0,0,0]]\n0',                  output: '4'  },
    { input: '[[0]]\n0',                                      output: '0'  },
    { input: '[[0,1],[1,0]]\n1',                              output: '2'  },
    { input: '[[0,0,0,0,0,0,0,0,0,0],[0,1,1,1,1,1,1,1,1,0],[0,1,0,0,0,0,0,0,1,0],[0,1,0,1,1,1,1,0,1,0],[0,1,0,1,0,0,1,0,1,0],[0,1,0,1,0,0,1,0,1,0],[0,1,0,1,1,1,1,0,1,0],[0,1,0,0,0,0,0,0,1,0],[0,1,1,1,1,1,1,1,1,0],[0,0,0,0,0,0,0,0,0,0]]\n2', output: '18' },
    { input: '[[0,0],[0,1]]\n0',                              output: '2'  },
    { input: '[[0,0],[1,0]]\n0',                              output: '2'  },
  ],

  // -------------------------------------------------------------------------
  // MAKING A LARGE ISLAND
  // Input:  grid (int[][]) — flip one 0 to 1
  // Output: largest island after one flip (int)
  // -------------------------------------------------------------------------
  'making-a-large-island': [
    { input: '[[1,0],[0,1]]',            output: '3' },
    { input: '[[1,1],[1,0]]',            output: '4' },
    { input: '[[1,1],[1,1]]',            output: '4' },
    { input: '[[0,0],[0,0]]',            output: '1' },
    { input: '[[0,1],[1,1]]',            output: '4' },
    { input: '[[1,0,1,0,1]]',           output: '3' },
    { input: '[[1,1,1],[1,1,1],[1,1,0]]', output: '9' },
    { input: '[[0,0,0],[0,1,0],[0,0,0]]', output: '2' },
    { input: '[[1,0,1],[0,1,0],[1,0,1]]', output: '5' },
    { input: '[[1,0,0,1],[0,1,1,0],[0,1,1,0],[1,0,0,1]]', output: '9' },
    { input: '[[1,1,0,0,1],[1,1,0,0,1],[0,0,1,0,0],[0,0,0,1,1],[0,0,0,1,1]]', output: '13' },
    { input: '[[0]]',                   output: '1' },
    { input: '[[1]]',                   output: '1' },
    { input: '[[0,0,0,0,0],[0,1,1,1,0],[0,1,0,1,0],[0,1,1,1,0],[0,0,0,0,0]]', output: '9' },
    { input: '[[1,0],[1,1]]',           output: '4' },
  ],

  // -------------------------------------------------------------------------
  // CHECKING EXISTENCE OF EDGE LENGTH LIMITED PATHS
  // Input:  n (int) \n edgeList (int[][]) \n queries (int[][])
  // Output: boolean[] results
  // -------------------------------------------------------------------------
  'checking-existence-of-edge-length-limited-paths': [
    { input: '3\n[[0,1,2],[1,2,4],[2,0,8],[1,0,16]]\n[[0,1,2],[0,2,5]]',          output: '[false,true]'       },
    { input: '5\n[[0,1,10],[1,2,5],[2,3,9],[3,4,13]]\n[[0,4,14],[1,4,13]]',       output: '[true,false]'       },
    { input: '3\n[[0,1,2],[1,2,4],[2,0,8]]\n[[0,2,3]]',                           output: '[false]'            },
    { input: '3\n[[0,1,2],[1,2,4],[2,0,8]]\n[[0,2,9]]',                           output: '[true]'             },
    { input: '10\n[[2,4,2],[3,4,3],[4,5,0],[0,3,1],[1,3,2],[2,3,4],[0,2,4],[2,6,1],[3,5,3],[5,6,4],[6,7,3],[7,8,2],[8,9,2],[0,9,4],[3,6,4]]\n[[3,7,5],[4,6,4],[5,9,4],[2,8,6],[0,1,3]]', output: '[true,false,true,true,false]' },
  ],

  // -------------------------------------------------------------------------
  // MINIMIZE MALWARE SPREAD
  // Input:  graph (int[][]) \n initial (int[])
  // Output: node to remove to minimize malware spread (int)
  // -------------------------------------------------------------------------
  'minimize-malware-spread': [
    { input: '[[1,1,0],[1,1,0],[0,0,1]]\n[0,1]',     output: '0' },
    { input: '[[1,0,0],[0,1,0],[0,0,1]]\n[0,2]',     output: '0' },
    { input: '[[1,1,1],[1,1,1],[1,1,1]]\n[1,2]',     output: '1' },
    { input: '[[1,0,0],[0,1,0],[0,0,1]]\n[0,1]',     output: '0' },
    { input: '[[1,1,0],[1,1,0],[0,0,1]]\n[0,2]',     output: '0' },
    { input: '[[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]]\n[3,1,0,2]', output: '0' },
    { input: '[[1,1,0,0],[1,1,0,0],[0,0,1,1],[0,0,1,1]]\n[0,2]', output: '0' },
    { input: '[[1,0,0],[0,1,0],[0,0,1]]\n[2]',       output: '2' },
    { input: '[[1,1,1],[1,1,1],[1,1,1]]\n[0]',       output: '0' },
    { input: '[[1,1,0],[1,1,0],[0,0,1]]\n[0,1,2]',   output: '0' },
  ],

  // -------------------------------------------------------------------------
  // CRITICAL CONNECTIONS IN A NETWORK
  // Input:  n (int) \n connections (int[][])
  // Output: all critical connections / bridges (int[][])
  // -------------------------------------------------------------------------
  'critical-connections-in-a-network': [
    { input: '4\n[[0,1],[1,2],[2,0],[1,3]]',          output: '[[1,3]]'           },
    { input: '2\n[[0,1]]',                            output: '[[0,1]]'           },
    { input: '3\n[[0,1],[1,2],[2,0]]',                output: '[]'                },
    { input: '5\n[[0,1],[0,2],[1,2],[1,3],[3,4]]',    output: '[[1,3],[3,4]]'     },
    { input: '4\n[[0,1],[1,2],[2,3]]',                output: '[[0,1],[1,2],[2,3]]' },
    { input: '6\n[[0,1],[1,2],[2,0],[1,3],[3,4],[4,5],[5,3]]', output: '[[1,3]]' },
    { input: '3\n[[0,1],[1,2]]',                      output: '[[0,1],[1,2]]'     },
    { input: '4\n[[0,1],[1,2],[2,3],[3,0]]',          output: '[]'                },
    { input: '5\n[[0,1],[1,2],[2,0],[0,3],[3,4]]',    output: '[[0,3],[3,4]]'     },
    { input: '3\n[[0,1],[0,2],[1,2]]',               output: '[]'                },
  ],

  // -------------------------------------------------------------------------
  // DUNGEON GAME
  // Input:  dungeon (int[][])
  // Output: minimum initial health (int)
  // -------------------------------------------------------------------------
  'dungeon-game': [
    { input: '[[-2,-3,3],[-5,-10,1],[10,30,-5]]', output: '7'  },
    { input: '[[0]]',                             output: '1'  },
    { input: '[[0,0]]',                           output: '1'  },
    { input: '[[-5]]',                            output: '6'  },
    { input: '[[1]]',                             output: '1'  },
    { input: '[[1,-3,3],[-3,1,0],[-3,-3,-3]]',   output: '3'  },
    { input: '[[2,3,-1]]',                        output: '1'  },
    { input: '[[-1]]',                            output: '2'  },
    { input: '[[0,-3]]',                          output: '4'  },
    { input: '[[-3,5]]',                          output: '4'  },
    { input: '[[1,2,3],[0,0,0]]',                 output: '1'  },
    { input: '[[-1,-1,-1],[-1,-1,-1],[-1,-1,-1]]', output: '7' },
    { input: '[[3,0,-3],[-3,0,3],[3,0,-3]]',      output: '1'  },
    { input: '[[-10,20],[30,-40]]',               output: '11' },
    { input: '[[200]]',                           output: '1'  },
  ],

  // -------------------------------------------------------------------------
  // CHERRY PICKUP
  // Input:  grid (int[][]) — 0 empty, 1 cherry, -1 thorn
  // Output: max cherries collected on round trip (int)
  // -------------------------------------------------------------------------
  'cherry-pickup': [
    { input: '[[0,1,-1],[1,0,-1],[1,1,1]]',          output: '5' },
    { input: '[[1,1,-1],[1,-1,1],[-1,1,1]]',         output: '0' },
    { input: '[[1,1,1,1,0,0,0],[0,0,0,1,0,0,0],[0,0,0,1,0,0,1],[1,0,0,1,0,0,0],[0,0,0,0,0,0,1],[0,0,0,0,1,0,0],[0,0,0,0,0,0,1]]', output: '15' },
    { input: '[[0]]',                                output: '0' },
    { input: '[[1]]',                                output: '1' },
    { input: '[[1,0,0],[0,1,0],[0,0,1]]',             output: '3' },
    { input: '[[-1]]',                               output: '0' },
    { input: '[[1,1],[1,1]]',                        output: '4' },
    { input: '[[0,0,0],[0,0,0],[0,0,0]]',             output: '0' },
    { input: '[[1,1,1],[1,-1,1],[1,1,1]]',            output: '6' },
  ],

  // -------------------------------------------------------------------------
  // STUDENT ATTENDANCE RECORD II
  // Input:  n (int)
  // Output: number of valid attendance records of length n (int, mod 10^9+7)
  // -------------------------------------------------------------------------
  'student-attendance-record-ii': [
    { input: '2',  output: '8'      },
    { input: '1',  output: '3'      },
    { input: '3',  output: '19'     },
    { input: '4',  output: '43'     },
    { input: '5',  output: '94'     },
    { input: '6',  output: '200'    },
    { input: '7',  output: '428'    },
    { input: '10', output: '3536'   },
    { input: '20', output: '543867' },
    { input: '100', output: '985661722' },
    { input: '10101', output: '183236316' },
  ],

  // -------------------------------------------------------------------------
  // SUPER EGG DROP
  // Input:  k (int) — eggs \n n (int) — floors
  // Output: minimum moves to determine critical floor (int)
  // -------------------------------------------------------------------------
  'super-egg-drop': [
    { input: '1\n1',    output: '1'  },
    { input: '1\n2',    output: '2'  },
    { input: '2\n6',    output: '3'  },
    { input: '3\n14',   output: '4'  },
    { input: '2\n2',    output: '2'  },
    { input: '1\n10',   output: '10' },
    { input: '2\n10',   output: '4'  },
    { input: '3\n25',   output: '5'  },
    { input: '4\n100',  output: '8'  },
    { input: '2\n100',  output: '14' },
    { input: '1\n100',  output: '100'},
    { input: '2\n4',    output: '3'  },
    { input: '3\n200',  output: '11' },
    { input: '2\n1',    output: '1'  },
    { input: '3\n50',   output: '8'  },
  ],

  // -------------------------------------------------------------------------
  // CONCATENATED WORDS
  // Input:  words (string[])
  // Output: all words that can be formed by concatenating other words (string[])
  // -------------------------------------------------------------------------
  'concatenated-words': [
    { input: '["cat","cats","catsdogcats","dog","dogcatsdog","hippopotamuses","rat","ratcatdogcat"]',
      output: '["catsdogcats","dogcatsdog","ratcatdogcat"]' },
    { input: '["cat","dog","catdog"]',                       output: '["catdog"]'             },
    { input: '["cat","dog","catcat"]',                       output: '["catcat"]'             },
    { input: '["a","b","ab","abc"]',                         output: '["ab"]'                 },
    { input: '["a","aa","aaa","aaaa"]',                      output: '["aa","aaa","aaaa"]'    },
    { input: '[""]',                                        output: '[]'                     },
    { input: '["a","b","c","abc","def","abcdef"]',           output: '["abc","abcdef"]'       },
    { input: '["ab","abc","bc"]',                            output: '["abc"]'                },
    { input: '["cat","dog","cats","catsdog","catsdogcats"]',  output: '["catsdog","catsdogcats"]' },
    { input: '["hello","world","helloworld","helloworlds"]',  output: '["helloworld"]'        },
    { input: '["a","aa"]',                                   output: '["aa"]'                 },
    { input: '["foo","bar","foobar","foobarbaz","baz"]',      output: '["foobar","foobarbaz"]' },
    { input: '["a","b","ab","cd","abcd"]',                   output: '["ab","abcd"]'          },
    { input: '["abcd","ab","cd"]',                           output: '["abcd"]'              },
    { input: '["cat"]',                                      output: '[]'                    },
  ],

  // -------------------------------------------------------------------------
  // PALINDROME PAIRS
  // Input:  words (string[])
  // Output: index pairs [i,j] where words[i]+words[j] is palindrome (int[][])
  // -------------------------------------------------------------------------
  'palindrome-pairs': [
    { input: '["abcd","dcba","lls","s","sssll"]',  output: '[[0,1],[1,0],[3,2],[2,4]]'    },
    { input: '["bat","tab","cat"]',                output: '[[0,1],[1,0]]'                },
    { input: '["a",""]',                           output: '[[0,1],[1,0]]'                },
    { input: '["a","b","c"]',                      output: '[]'                           },
    { input: '["a","aa","aaa"]',                   output: '[[0,1],[1,0],[0,2],[2,0],[1,2],[2,1]]' },
    { input: '[""]',                               output: '[]'                           },
    { input: '["abcd","dcba"]',                    output: '[[0,1],[1,0]]'                },
    { input: '["racecar",""]',                     output: '[[0,1],[1,0]]'                },
    { input: '["ab","ba"]',                        output: '[[0,1],[1,0]]'                },
    { input: '["ab","abc","cba"]',                 output: '[[2,0],[1,2]]'                },
    { input: '["a"]',                              output: '[]'                           },
    { input: '["abc","cba","d"]',                  output: '[[0,1],[1,0]]'                },
    { input: '["lls","s","sssll"]',               output: '[[0,1],[2,0]]'               },
    { input: '["aa",""]',                          output: '[[0,1],[1,0]]'               },
    { input: '["abcdc","cba","dcba"]',             output: '[[2,0],[1,0]]'               },
  ],

  // -------------------------------------------------------------------------
  // STREAM OF CHARACTERS (search words in a stream)
  // Input:  ops (string[]) — "StreamChecker:word1,word2,..."|"query:c"
  // Output: results (string[])
  // -------------------------------------------------------------------------
  'stream-of-characters': [
    { input: '["StreamChecker:cd,f,kl","query:a","query:b","query:c","query:d","query:e","query:f","query:g","query:h","query:i","query:j","query:k","query:l"]',
      output: '["null","false","false","false","true","false","true","false","false","false","false","false","true"]' },
    { input: '["StreamChecker:abc","query:a","query:b","query:c"]',
      output: '["null","false","false","true"]' },
    { input: '["StreamChecker:ab","query:a","query:b","query:c"]',
      output: '["null","false","true","false"]' },
    { input: '["StreamChecker:a","query:a","query:b","query:a"]',
      output: '["null","true","false","true"]' },
    { input: '["StreamChecker:abc,ab,a","query:a","query:b","query:c","query:d"]',
      output: '["null","true","true","true","false"]' },
    { input: '["StreamChecker:xyz","query:x","query:y","query:z","query:xyz"]',
      output: '["null","false","false","true","false"]' },
  ],

  // -------------------------------------------------------------------------
  // RANGE SUM QUERY - MUTABLE (Binary Indexed Tree / Segment Tree)
  // Input:  ops (string[]) — "NumArray:n1,n2,..."|"update:i:val"|"sumRange:i:j"
  // Output: results (string[])
  // -------------------------------------------------------------------------
  'range-sum-query-mutable': [
    { input: '["NumArray:1,3,5","sumRange:0:2","update:1:2","sumRange:0:2"]',  output: '["null","9","null","8"]'    },
    { input: '["NumArray:1,2,3","sumRange:0:2","sumRange:0:1","sumRange:1:2"]', output: '["null","6","null","3","null","5"]' },
    { input: '["NumArray:0","update:0:1","sumRange:0:0"]',                     output: '["null","null","1"]'        },
    { input: '["NumArray:1,2,3,4,5","sumRange:0:4","update:2:10","sumRange:0:4"]', output: '["null","15","null","22"]' },
    { input: '["NumArray:-1","sumRange:0:0","update:0:1","sumRange:0:0"]',     output: '["null","-1","null","1"]'   },
    { input: '["NumArray:1,2,3","update:0:5","sumRange:0:2","update:2:1","sumRange:0:2"]', output: '["null","null","9","null","8"]' },
    { input: '["NumArray:3,1,2,10,1","sumRange:0:3","update:1:5","sumRange:0:3"]', output: '["null","16","null","20"]' },
    { input: '["NumArray:1","update:0:10","sumRange:0:0"]',                    output: '["null","null","10"]'       },
  ],

  // -------------------------------------------------------------------------
  // COUNT OF RANGE SUM
  // Input:  nums (int[]) \n lower (int) \n upper (int)
  // Output: count of range sums within [lower, upper] (int)
  // -------------------------------------------------------------------------
  'count-range-sum': [
    { input: '[-2,5,-1]\n-2\n2',     output: '3' },
    { input: '[0]\n0\n0',            output: '1' },
    { input: '[0]\n-1\n1',           output: '1' },
    { input: '[0]\n1\n2',            output: '0' },
    { input: '[1,2,3]\n0\n3',        output: '4' },
    { input: '[-2,5,-1]\n-1\n3',     output: '4' },
    { input: '[1,-1,1,-1,1]\n0\n0',  output: '4' },
    { input: '[3,-2,5]\n0\n5',       output: '5' },
    { input: '[2,2,2,2,2]\n4\n10',   output: '10'},
    { input: '[1]\n1\n1',            output: '1' },
    { input: '[1]\n2\n5',            output: '0' },
    { input: '[0,0,0]\n0\n0',        output: '6' },
    { input: '[-1,-2,-3]\n-6\n-1',   output: '6' },
    { input: '[1,2,3,4]\n1\n10',     output: '10'},
    { input: '[-3,-2,-1,0,1,2,3]\n-3\n3', output: '20' },
  ],

  // -------------------------------------------------------------------------
  // QUEUE RECONSTRUCTION BY HEIGHT
  // Input:  people (int[][]) — [h, k] pairs
  // Output: reconstructed queue (int[][])
  // -------------------------------------------------------------------------
  'queue-reconstruction-by-height': [
    { input: '[[7,0],[4,4],[7,1],[5,0],[6,1],[5,2]]',  output: '[[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]]' },
    { input: '[[6,0],[5,0],[4,0],[3,2],[2,2],[1,4]]',  output: '[[4,0],[5,0],[2,2],[3,2],[1,4],[6,0]]' },
    { input: '[[7,0]]',                                output: '[[7,0]]'                               },
    { input: '[[7,0],[7,1]]',                          output: '[[7,0],[7,1]]'                         },
    { input: '[[7,1],[7,0]]',                          output: '[[7,0],[7,1]]'                         },
    { input: '[[1,0],[2,0]]',                          output: '[[1,0],[2,0]]'                         },
    { input: '[[2,0],[1,0]]',                          output: '[[1,0],[2,0]]'                         },
    { input: '[[2,1],[1,0],[2,0]]',                    output: '[[1,0],[2,0],[2,1]]'                   },
    { input: '[[9,0],[7,0],[1,9],[3,0],[2,7],[5,3],[6,0],[3,4],[6,2],[5,2]]', output: '[[3,0],[6,0],[7,0],[5,2],[3,4],[5,3],[6,2],[2,7],[9,0],[1,9]]' },
    { input: '[[4,0],[5,0],[1,0],[1,1],[1,2],[2,0]]',  output: '[[1,0],[1,1],[1,2],[2,0],[4,0],[5,0]]' },
    { input: '[[5,0],[5,2],[5,1]]',                    output: '[[5,0],[5,1],[5,2]]'                   },
    { input: '[[3,0],[1,0]]',                          output: '[[1,0],[3,0]]'                         },
    { input: '[[5,3],[3,1],[4,2],[5,0],[1,0],[2,0]]',  output: '[[1,0],[2,0],[3,1],[4,2],[5,0],[5,3]]' },
    { input: '[[8,0],[7,4],[3,5],[5,4],[7,0],[9,0],[5,3],[3,2],[3,0],[4,3]]', output: '[[3,0],[5,3],[3,2],[5,4],[4,3],[7,0],[3,5],[7,4],[8,0],[9,0]]' },
    { input: '[[2,0],[2,1],[2,2]]',                    output: '[[2,0],[2,1],[2,2]]'                   },
  ],

  // -------------------------------------------------------------------------
  // DESIGN SKIPLIST
  // Input:  ops (string[]) — "Skiplist"|"add:n"|"erase:n"|"search:n"
  // Output: results (string[])
  // -------------------------------------------------------------------------
  'design-skiplist': [
    { input: '["Skiplist","add:1","add:2","add:3","search:0","add:4","search:1","erase:0","erase:1","search:1"]',
      output: '["null","null","null","null","false","null","true","false","false","false"]' },
    { input: '["Skiplist","add:1","search:1","erase:1","search:1"]',
      output: '["null","null","true","null","false"]' },
    { input: '["Skiplist","add:1","add:1","search:1","erase:1","search:1","erase:1","search:1"]',
      output: '["null","null","null","true","null","true","null","false"]' },
    { input: '["Skiplist","add:5","add:3","search:3","search:5","search:4"]',
      output: '["null","null","null","true","true","false"]' },
    { input: '["Skiplist","add:10","add:20","add:30","search:10","erase:10","search:10","search:20"]',
      output: '["null","null","null","null","true","null","false","true"]' },
  ],

  // -------------------------------------------------------------------------
  // LFU CACHE
  // Input:  ops (string[]) — "LFUCache:capacity"|"put:key:value"|"get:key"
  // Output: results (string[])
  // -------------------------------------------------------------------------
  'lfu-cache': [
    { input: '["LFUCache:2","put:1:1","put:2:2","get:1","put:3:3","get:2","get:3","put:4:4","get:1","get:3","get:4"]',
      output: '["null","null","null","1","null","-1","3","null","1","3","4"]' },
    { input: '["LFUCache:1","put:1:1","put:2:2","get:1","put:3:3","get:2","get:3"]',
      output: '["null","null","null","-1","null","-1","3"]' },
    { input: '["LFUCache:0","put:0:0","get:0"]',
      output: '["null","null","-1"]' },
    { input: '["LFUCache:2","put:1:1","put:2:2","get:1","put:3:3","get:1","get:2","get:3"]',
      output: '["null","null","null","1","null","1","-1","3"]' },
    { input: '["LFUCache:3","put:1:1","put:2:2","put:3:3","put:4:4","get:4","get:3","get:2","get:1","put:5:5","get:1","get:2","get:3","get:4","get:5"]',
      output: '["null","null","null","null","null","4","3","2","-1","null","-1","2","3","-1","5"]' },
  ],

  // -------------------------------------------------------------------------
  // ALL O`ONE DATA STRUCTURE
  // Input:  ops (string[]) — "AllOne"|"inc:key"|"dec:key"|"getMaxKey"|"getMinKey"
  // Output: results (string[])
  // -------------------------------------------------------------------------
  'all-o-one-data-structure': [
    { input: '["AllOne","inc:hello","inc:hello","getMaxKey","getMinKey","inc:leet","getMaxKey","getMinKey"]',
      output: '["null","null","null","hello","hello","null","hello","leet"]' },
    { input: '["AllOne","inc:a","inc:b","inc:b","inc:c","inc:c","inc:c","dec:b","dec:b","getMinKey","dec:a","getMaxKey","getMinKey"]',
      output: '["null","null","null","null","null","null","null","null","null","a","null","c","a"]' },
    { input: '["AllOne","inc:hello","inc:goodbye","inc:hello","inc:hello","getMaxKey","getMinKey"]',
      output: '["null","null","null","null","null","hello","goodbye"]' },
    { input: '["AllOne","getMaxKey","getMinKey"]',
      output: '["null","",""]' },
    { input: '["AllOne","inc:a","getMaxKey","getMinKey","dec:a","getMaxKey","getMinKey"]',
      output: '["null","null","a","a","null","",""]' },
  ],

  // -------------------------------------------------------------------------
  // DESIGN IN-MEMORY FILE SYSTEM
  // Input:  ops (string[]) — "FileSystem"|"mkdir:path"|"addContentToFile:path:content"|"ls:path"|"readContentFromFile:path"
  // Output: results (string[])
  // -------------------------------------------------------------------------
  'design-in-memory-file-system': [
    { input: '["FileSystem","ls:/","mkdir:/a/b/c","addContentToFile:/a/b/c/d:hello","ls:/","ls:/a/b/c","readContentFromFile:/a/b/c/d"]',
      output: '["null","[]","null","null","[\"a\"]","[\"d\"]","hello"]' },
    { input: '["FileSystem","mkdir:/a","mkdir:/b","ls:/"]',
      output: '["null","null","null","[\"a\",\"b\"]"]' },
    { input: '["FileSystem","addContentToFile:/file1:content","readContentFromFile:/file1","ls:/"]',
      output: '["null","null","content","[\"file1\"]"]' },
    { input: '["FileSystem","mkdir:/dir","ls:/dir"]',
      output: '["null","null","[]"]' },
    { input: '["FileSystem","addContentToFile:/a:x","addContentToFile:/a:y","readContentFromFile:/a"]',
      output: '["null","null","null","xy"]' },
  ],

  // -------------------------------------------------------------------------
  // MAXIMUM FREQUENCY STACK
  // Input:  ops (string[]) — "FreqStack"|"push:val"|"pop"
  // Output: results (string[])
  // -------------------------------------------------------------------------
  'maximum-frequency-stack': [
    { input: '["FreqStack","push:5","push:7","push:5","push:7","push:4","push:5","pop","pop","pop","pop"]',
      output: '["null","null","null","null","null","null","null","5","7","5","4"]' },
    { input: '["FreqStack","push:5","push:5","push:4","pop","pop","pop"]',
      output: '["null","null","null","null","5","5","4"]' },
    { input: '["FreqStack","push:1","pop"]',
      output: '["null","null","1"]' },
    { input: '["FreqStack","push:1","push:2","push:2","push:1","pop","pop","pop","pop"]',
      output: '["null","null","null","null","null","2","1","2","1"]' },
    { input: '["FreqStack","push:5","push:7","push:5","push:7","push:4","push:5","pop","push:4","pop","pop","pop","pop"]',
      output: '["null","null","null","null","null","null","null","5","null","7","5","4","7"]' },
  ],

  // -------------------------------------------------------------------------
  // SHORTEST SUBARRAY WITH SUM AT LEAST K
  // Input:  nums (int[]) \n k (int)
  // Output: length of shortest subarray with sum >= k, or -1
  // -------------------------------------------------------------------------
  'shortest-subarray-with-sum-at-least-k': [
    { input: '[1]\n1',                   output: '1'  },
    { input: '[1,2]\n4',                 output: '-1' },
    { input: '[2,-1,2]\n3',              output: '3'  },
    { input: '[1,2,3,4,5]\n11',          output: '3'  },
    { input: '[1]\n0',                   output: '1'  },
    { input: '[0]\n1',                   output: '-1' },
    { input: '[10]\n5',                  output: '1'  },
    { input: '[-1,2]\n1',                output: '1'  },
    { input: '[1,2,3]\n5',               output: '2'  },
    { input: '[84,-37,32,40,95]\n167',   output: '3'  },
    { input: '[2,-1,2]\n2',              output: '1'  },
    { input: '[1,1,1,1,1]\n3',           output: '3'  },
    { input: '[-2,5,-1]\n2',             output: '1'  },
    { input: '[5,-1,2,-1,3]\n5',         output: '1'  },
    { input: '[1,2,3,4,5]\n15',          output: '5'  },
  ],

  // -------------------------------------------------------------------------
  // MINIMUM NUMBER OF REFUELING STOPS
  // Input:  target (int) \n startFuel (int) \n stations (int[][])
  // Output: minimum refueling stops, or -1
  // -------------------------------------------------------------------------
  'minimum-number-of-refueling-stops': [
    { input: '1\n1\n[]',                                 output: '0'  },
    { input: '100\n1\n[[10,100]]',                       output: '-1' },
    { input: '100\n10\n[[10,60],[20,30],[30,30],[60,40]]', output: '2' },
    { input: '100\n100\n[[10,10],[20,10],[30,10]]',       output: '0'  },
    { input: '100\n50\n[[25,25],[50,20],[75,30]]',        output: '1'  },
    { input: '1000\n83\n[[25,27],[36,187],[140,186],[378,6],[492,202],[517,89],[579,234],[673,86],[808,5],[954,67]]', output: '5' },
    { input: '100\n10\n[[10,50],[20,30],[30,10],[40,5],[50,5]]', output: '-1' },
    { input: '200\n100\n[[100,100],[150,50]]',            output: '1'  },
    { input: '50\n30\n[[15,30],[25,10]]',                 output: '0'  },
    { input: '10\n5\n[[5,3],[7,2]]',                     output: '-1' },
    { input: '100\n1\n[[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[8,1],[9,1],[10,100]]', output: '9' },
    { input: '12\n10\n[[5,5],[7,5]]',                    output: '1'  },
  ],

  // -------------------------------------------------------------------------
  // PROFITABLE SCHEMES
  // Input:  n (int) — max members \n minProfit (int) \n group (int[]) \n profit (int[])
  // Output: number of schemes (int, mod 10^9+7)
  // -------------------------------------------------------------------------
  'profitable-schemes': [
    { input: '5\n3\n[2,2]\n[2,3]',              output: '2'    },
    { input: '10\n5\n[2,3,5]\n[6,7,8]',         output: '7'    },
    { input: '1\n0\n[1]\n[1]',                  output: '2'    },
    { input: '1\n1\n[1]\n[1]',                  output: '1'    },
    { input: '5\n3\n[2,2]\n[2,3]',              output: '2'    },
    { input: '100\n100\n[1,2,3,4,5]\n[1,2,3,4,5]', output: '0' },
    { input: '2\n1\n[1,1]\n[1,1]',              output: '3'    },
    { input: '3\n1\n[1,2,1]\n[1,1,1]',          output: '4'    },
    { input: '5\n0\n[1,2]\n[1,2]',              output: '7'    },
    { input: '10\n5\n[2,3,5]\n[6,7,8]',         output: '7'    },
  ],

  // -------------------------------------------------------------------------
  // TALLEST BILLBOARD
  // Input:  rods (int[])
  // Output: largest sum of two equal-height stacks (int)
  // -------------------------------------------------------------------------
  'tallest-billboard': [
    { input: '[1,2,3,6]',               output: '6'  },
    { input: '[1,2,3,4,5,6]',           output: '10' },
    { input: '[1,2]',                   output: '0'  },
    { input: '[1,1]',                   output: '1'  },
    { input: '[2]',                     output: '0'  },
    { input: '[3,3]',                   output: '3'  },
    { input: '[1,2,3]',                 output: '3'  },
    { input: '[5,5]',                   output: '5'  },
    { input: '[1,1,2,2,5]',             output: '5'  },
    { input: '[1,2,3,4]',              output: '5'  },
    { input: '[1,2,4,8,16,32]',         output: '31' },
    { input: '[36,2,1,2,10,18,2,2,6,26]', output: '46' },
  ],

  // -------------------------------------------------------------------------
  // PARTITION ARRAY INTO TWO ARRAYS TO MINIMIZE SUM DIFFERENCE
  // Input:  nums (int[])
  // Output: minimum absolute difference between partition sums (int)
  // -------------------------------------------------------------------------
  'partition-array-into-two-arrays-to-minimize-sum-difference': [
    { input: '[3,9,7,3]',             output: '2'  },
    { input: '[-36,36]',              output: '72' },
    { input: '[2,-1,0,4,-2,-9]',      output: '0'  },
    { input: '[1,1]',                 output: '0'  },
    { input: '[1,2]',                 output: '1'  },
    { input: '[0,0]',                 output: '0'  },
    { input: '[1,3,5,7]',             output: '0'  },
    { input: '[1,2,3,4]',             output: '0'  },
    { input: '[1,2,3,4,5,6]',         output: '1'  },
    { input: '[1,2,4,6,8,10]',        output: '1'  },
    { input: '[5,1,2,3,4]',           output: '1'  },
    { input: '[10,5,3,1]',            output: '1'  },
    { input: '[1,1,1,1,1,1]',         output: '0'  },
    { input: '[100,100,100,100]',      output: '0'  },
    { input: '[3,7,4,2,8,6]',         output: '0'  },
  ],

  // -------------------------------------------------------------------------
  // SMALLEST SUFFICIENT TEAM
  // Input:  req_skills (string[]) \n people (string[][])
  // Output: indices of smallest sufficient team (int[])
  // -------------------------------------------------------------------------
  'smallest-sufficient-team': [
    { input: '["java","nodejs","reactjs"]\n[["java"],["nodejs"],["nodejs","reactjs"]]', output: '[0,2]'   },
    { input: '["algorithms","math","java","reactjs","csharp","aws"]\n[["algorithms","math","java"],["algorithms","math","reactjs"],["java","csharp","aws"],["reactjs","csharp"],["csharp","math"],["aws","java"]]', output: '[1,2]' },
    { input: '["a"]\n[["a"]]',           output: '[0]'      },
    { input: '["a","b"]\n[["a","b"]]',   output: '[0]'      },
    { input: '["a","b"]\n[["a"],["b"]]', output: '[0,1]'    },
    { input: '["x","y","z"]\n[["x","y"],["y","z"],["x","z"]]', output: '[0,1]' },
    { input: '["a","b","c"]\n[["a","b"],["b","c"],["a","c"],["a","b","c"]]', output: '[3]' },
    { input: '["skills1","skills2","skills3","skills4","skills5"]\n[["skills1","skills2"],["skills3","skills4"],["skills5","skills1"],["skills2","skills3","skills4"],["skills3","skills4","skills5"]]', output: '[0,4]' },
  ],

  // -------------------------------------------------------------------------
  // MAXIMUM SCORE WORDS FORMED BY LETTERS
  // Input:  words (string[]) \n letters (char[]) \n score (int[])
  // Output: maximum score achievable (int)
  // -------------------------------------------------------------------------
  'maximum-score-words-formed-by-letters': [
    { input: '["dog","cat","dad","good"]\n["a","a","c","d","d","d","g","o","o"]\n[1,0,9,5,0,0,3,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0]', output: '23' },
    { input: '["xxxz","ax","bx","cx"]\n["z","a","b","c","x","x","x"]\n[4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,10]', output: '27' },
    { input: '["leetcode"]\n["l","e","t","c","o","d"]\n[0,0,1,1,1,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0,0,0,0]', output: '0' },
    { input: '["a","b","ab"]\n["a","b"]\n[1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]', output: '3' },
    { input: '["ab","cd"]\n["a","b","c","d"]\n[1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]', output: '4' },
    { input: '["abc"]\n["a","b","c","d"]\n[1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]', output: '3' },
    { input: '["a"]\n["a","a"]\n[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]', output: '1' },
  ],

  // -------------------------------------------------------------------------
  // FIND THE SHORTEST SUPERSTRING
  // Input:  words (string[])
  // Output: shortest superstring (string) that contains each word as a substring
  // -------------------------------------------------------------------------
  'find-the-shortest-superstring': [
    { input: '["alex","loves","leetcode"]',       output: '"alexlovesleetcode"'   },
    { input: '["catg","ctaagt","gcta","ttca","atgcatc"]', output: '"gctaagttcatgcatc"' },
    { input: '["ab","ba"]',                       output: '"abba"' },
    { input: '["a"]',                             output: '"a"'    },
    { input: '["ab","bc","cd"]',                  output: '"abcd"' },
    { input: '["ab","bcd"]',                      output: '"abcd"' },
    { input: '["abc","bca","cab"]',               output: '"bcabc"' },
    { input: '["a","b","c"]',                     output: '"abc"'  },
    { input: '["abc","def"]',                     output: '"abcdef"' },
    { input: '["aab","aba","bab"]',               output: '"bababaab"' },
  ],

  // -------------------------------------------------------------------------
  // DETERMINE IF TWO STRINGS ARE CLOSE
  // Input:  word1 (string) \n word2 (string)
  // Output: "true" or "false"
  // -------------------------------------------------------------------------
  'determine-if-two-strings-are-close': [
    { input: '"abc"\n"bca"',             output: 'true'  },
    { input: '"a"\n"aa"',               output: 'false' },
    { input: '"cabbba"\n"abbccc"',       output: 'true'  },
    { input: '"cabbba"\n"aabbss"',       output: 'false' },
    { input: '"aab"\n"baa"',             output: 'true'  },
    { input: '"a"\n"a"',                output: 'true'  },
    { input: '"ab"\n"ab"',              output: 'true'  },
    { input: '"ab"\n"aa"',              output: 'false' },
    { input: '"aabc"\n"bbac"',           output: 'true'  },
    { input: '"abbzzca"\n"babzzzcca"',   output: 'false' },
    { input: '"aaaaabbbbbb"\n"bbbbbbaaaaa"', output: 'true' },
    { input: '"abc"\n"xyz"',             output: 'false' },
    { input: '"abbc"\n"bbca"',           output: 'true'  },
    { input: '"aaabbbbccddeeeeefffff"\n"aaaaabbcccdddeeeeffff"', output: 'false' },
    { input: '"abcde"\n"edcba"',         output: 'true'  },
  ],

  // -------------------------------------------------------------------------
  // MINIMUM DELETIONS TO MAKE CHARACTER FREQUENCIES UNIQUE
  // Input:  s (string)
  // Output: minimum deletions (int)
  // -------------------------------------------------------------------------
  'minimum-deletions-to-make-character-frequencies-unique': [
    { input: '"aab"',          output: '0' },
    { input: '"aaabbbcc"',     output: '2' },
    { input: '"ceabaacb"',     output: '2' },
    { input: '"a"',            output: '0' },
    { input: '"aa"',           output: '0' },
    { input: '"aabb"',         output: '1' },
    { input: '"aabbcc"',       output: '2' },
    { input: '"abcabc"',       output: '3' },
    { input: '"aaabbb"',       output: '1' },
    { input: '"aaaaaa"',       output: '0' },
    { input: '"abcde"',        output: '0' },
    { input: '"aaabbbcccc"',   output: '2' },
    { input: '"bbcebab"',      output: '2' },
    { input: '"abababab"',     output: '3' },
    { input: '"eeeeffff"',     output: '1' },
  ],

  // -------------------------------------------------------------------------
  // MINIMUM ROUNDS TO COMPLETE ALL TASKS
  // Input:  tasks (int[])
  // Output: minimum rounds, or -1 if impossible (int)
  // -------------------------------------------------------------------------
  'minimum-rounds-to-complete-all-tasks': [
    { input: '[2,2,3,3,2,4,4,4,4,4]',  output: '4'  },
    { input: '[2,3,3]',                output: '-1' },
    { input: '[2,2,2,2]',              output: '2'  },
    { input: '[2,2,3,3,3,3]',          output: '3'  },
    { input: '[1]',                    output: '-1' },
    { input: '[2]',                    output: '-1' },
    { input: '[3]',                    output: '1'  },
    { input: '[2,2]',                  output: '1'  },
    { input: '[3,3]',                  output: '1'  },
    { input: '[3,3,3]',                output: '1'  },
    { input: '[3,3,3,3]',              output: '2'  },
    { input: '[3,3,3,3,3]',            output: '2'  },
    { input: '[3,3,3,3,3,3]',          output: '2'  },
    { input: '[2,2,2,3,3,3]',          output: '2'  },
    { input: '[2,2,3,3,2,2,3,3]',      output: '4'  },
  ],

  // -------------------------------------------------------------------------
  // NUMBER OF ZERO-FILLED SUBARRAYS
  // Input:  nums (int[])
  // Output: number of subarrays filled with 0 (int)
  // -------------------------------------------------------------------------
  'number-of-zero-filled-subarrays': [
    { input: '[1,3,0,0,2,0,0,4]',    output: '6'  },
    { input: '[0,0,0,2,0,0]',        output: '9'  },
    { input: '[2,10,2019]',          output: '0'  },
    { input: '[0]',                  output: '1'  },
    { input: '[1]',                  output: '0'  },
    { input: '[0,0]',                output: '3'  },
    { input: '[0,0,0]',              output: '6'  },
    { input: '[0,0,0,0]',            output: '10' },
    { input: '[1,0,1,0]',            output: '2'  },
    { input: '[0,1,0,1,0]',          output: '3'  },
    { input: '[0,0,1,0,0,0]',        output: '9'  },
    { input: '[1,1,1]',              output: '0'  },
    { input: '[0,1,2,3,0]',          output: '2'  },
    { input: '[0,0,0,0,0]',          output: '15' },
    { input: '[1,0,0,0,1,0,0,1]',    output: '9'  },
  ],

  // -------------------------------------------------------------------------
  // OPTIMAL PARTITION OF STRING
  // Input:  s (string)
  // Output: minimum number of substrings in partition (int)
  // -------------------------------------------------------------------------
  'optimal-partition-of-string': [
    { input: '"abacaba"',            output: '4' },
    { input: '"ssssss"',             output: '6' },
    { input: '"a"',                 output: '1' },
    { input: '"ab"',                output: '1' },
    { input: '"aa"',                output: '2' },
    { input: '"abcabc"',             output: '2' },
    { input: '"abcde"',              output: '1' },
    { input: '"aabbcc"',             output: '3' },
    { input: '"abcabcabc"',          output: '3' },
    { input: '"zzzzz"',              output: '5' },
    { input: '"abcdefghijklmnopqrstuvwxyz"', output: '1' },
    { input: '"aab"',               output: '2' },
    { input: '"abba"',              output: '2' },
    { input: '"aabbaabb"',          output: '4' },
    { input: '"abcbc"',             output: '2' },
  ],

  // -------------------------------------------------------------------------
  // REMOVING STARS FROM A STRING
  // Input:  s (string)
  // Output: final string (string)
  // -------------------------------------------------------------------------
  'removing-stars-from-a-string': [
    { input: '"leet**cod*e"',       output: '"lecoe"'   },
    { input: '"erase*****"',        output: '""'        },
    { input: '"a"',                output: '"a"'       },
    { input: '"abc"',              output: '"abc"'     },
    { input: '"a*bc"',             output: '"bc"'      },
    { input: '"a**bc"',            output: '"bc"'      },
    { input: '"abc*"',             output: '"ab"'      },
    { input: '"abc**"',            output: '"a"'       },
    { input: '"abc***"',           output: '""'        },
    { input: '"ab*cd*ef*"',        output: '"ace"'     },
    { input: '"aaa*bbb*ccc*"',     output: '"aaabbc"'  },
    { input: '"ab**c"',            output: '"c"'       },
    { input: '"a*a*a*a"',          output: '"a"'       },
    { input: '"abc*def*"',         output: '"abcde"'   },
    { input: '"a*b*c*d*e*"',       output: '""'        },
  ],

};











// =============================================================================
// HELPER — insertTestCases
// =============================================================================
/**
 * Delete all existing test cases for a problem then bulk-insert new ones.
 *
 * @param {string} problemSlug
 *   Slug that uniquely identifies the problem (must match the DB row).
 *
 * @param {Array<{ input: string, output: string }>} casesArray
 *   Ordered list of test cases.  The first 3 are automatically marked as
 *   sample cases (visible on "Run"); the rest are hidden (used on "Submit").
 *
 * @returns {Promise<{ slug: string, inserted: number }>}
 */
async function insertTestCases(problemSlug, casesArray) {
  const SAMPLE_COUNT = 3;

  // 1. Resolve problem ID from slug ─────────────────────────────────────────
  const problem = await prisma.problem.findUnique({
    where:  { slug: problemSlug },
    select: { id: true },
  });

  if (!problem) {
    console.warn(`  ⚠  "${problemSlug}" not found in DB — skipped`);
    return { slug: problemSlug, inserted: 0 };
  }

  // 2. Wipe stale test cases ─────────────────────────────────────────────────
  await prisma.testCase.deleteMany({ where: { problemId: problem.id } });

  // 3. Validate & build records ─────────────────────────────────────────────
  const records = casesArray.map((tc, index) => {
    if (typeof tc.input !== 'string') {
      throw new TypeError(
        `[${problemSlug}] case #${index + 1}: "input" must be a string (got ${typeof tc.input}). ` +
        'Use JSON.stringify() for each argument, then join with "\\n".'
      );
    }
    if (typeof tc.output !== 'string') {
      throw new TypeError(
        `[${problemSlug}] case #${index + 1}: "output" must be a string (got ${typeof tc.output}). ` +
        'Use JSON.stringify() on the expected return value.'
      );
    }

    return {
      problemId: problem.id,
      input:     tc.input,
      output:    tc.output,
      isSample:  index < SAMPLE_COUNT,
    };
  });

  // 4. Bulk insert ───────────────────────────────────────────────────────────
  const { count } = await prisma.testCase.createMany({ data: records });

  return { slug: problemSlug, inserted: count };
}

const NORMALIZE_SORT_SLUGS = new Set([
  'top-k-frequent-elements',
  'find-all-anagrams-in-a-string',
  'word-search-ii',
  'intersection-of-two-arrays',
  'group-anagrams',
]);

function sortPrimitiveArray(values) {
  return [...values].sort((a, b) => {
    if (typeof a === 'number' && typeof b === 'number') return a - b;
    return String(a).localeCompare(String(b));
  });
}

async function normalizeArrayOutputTestCases() {
  let fixed = 0;

  for (const slug of NORMALIZE_SORT_SLUGS) {
    const problem = await prisma.problem.findUnique({ where: { slug } });
    if (!problem) continue;

    const testCases = await prisma.testCase.findMany({ where: { problemId: problem.id } });
    for (const tc of testCases) {
      let expectedValue;
      try {
        expectedValue = JSON.parse(tc.output);
      } catch {
        continue;
      }

      if (!Array.isArray(expectedValue) || expectedValue.some((v) => typeof v === 'object')) {
        continue;
      }

      const normalized = JSON.stringify(sortPrimitiveArray(expectedValue));
      if (normalized === tc.output) continue;

      await prisma.testCase.update({ where: { id: tc.id }, data: { output: normalized } });
      fixed++;
    }
  }

  return fixed;
}

async function fixTopKFrequentElementsTestCases() {
  const problem = await prisma.problem.findUnique({ where: { slug: 'top-k-frequent-elements' } });
  if (!problem) return 0;

  let fixed = 0;
  const testCases = await prisma.testCase.findMany({ where: { problemId: problem.id } });

  for (const tc of testCases) {
    const lines = tc.input.trim().split('\n').filter(Boolean);
    if (lines.length < 2) continue;

    let nums;
    let k;
    try {
      nums = JSON.parse(lines[0]);
      k = JSON.parse(lines[1]);
    } catch {
      continue;
    }

    if (!Array.isArray(nums) || typeof k !== 'number') continue;

    const count = {};
    for (const num of nums) {
      count[num] = (count[num] || 0) + 1;
    }

    const sorted = Object.keys(count)
      .map(Number)
      .sort((a, b) => count[b] - count[a] || a - b);

    const expected = JSON.stringify(sorted.slice(0, k).sort((a, b) => a - b));
    if (expected === tc.output) continue;

    await prisma.testCase.update({ where: { id: tc.id }, data: { output: expected } });
    fixed++;
  }

  return fixed;
}

// =============================================================================
// MAIN
// =============================================================================
async function main() {
  console.log('');
  console.log('======================================================');
  console.log('  seedTestCases.js');
  console.log('======================================================');
  console.log('');

  // Collect all DB slugs for cross-referencing
  const dbProblems = await prisma.problem.findMany({ select: { slug: true } });
  const dbSlugs    = new Set(dbProblems.map((p) => p.slug));
  const libSlugs   = Object.keys(TEST_CASE_LIBRARY);

  if (libSlugs.length === 0) {
    console.warn('  ⚠  TEST_CASE_LIBRARY is empty — nothing to seed.');
    return;
  }

  // Cross-reference warnings ─────────────────────────────────────────────────
  for (const slug of libSlugs) {
    if (!dbSlugs.has(slug)) {
      console.warn(`  ⚠  Library slug "${slug}" has no matching DB problem`);
    }
  }
  for (const slug of dbSlugs) {
    if (!TEST_CASE_LIBRARY[slug]) {
      console.warn(`  ⚠  DB problem "${slug}" has no library entry`);
    }
  }

  // Seed ─────────────────────────────────────────────────────────────────────
  let seeded  = 0;
  let skipped = 0;
  let total   = 0;

  for (const slug of libSlugs) {
    try {
      const { inserted } = await insertTestCases(slug, TEST_CASE_LIBRARY[slug]);

      if (inserted === 0) {
        skipped++;
        continue;
      }

      const sampleCount = Math.min(3, inserted);
      console.log(
        `  ✅  ${slug.padEnd(50)} ` +
        `${String(inserted).padStart(3)} total  ` +
        `(${sampleCount} sample + ${inserted - sampleCount} hidden)`
      );
      seeded += 1;
      total  += inserted;
    } catch (err) {
      console.error(`  ❌  ${slug}: ${err.message}`);
      skipped++;
    }
  }

  const normalizedCount = await normalizeArrayOutputTestCases();
  const topKFixedCount = await fixTopKFrequentElementsTestCases();

  console.log('');
  console.log('------------------------------------------------------');
  console.log(`  Problems seeded : ${seeded}`);
  console.log(`  Problems skipped: ${skipped}`);
  console.log(`  Test cases total: ${total}`);
  console.log(`  Outputs normalized: ${normalizedCount}`);
  console.log(`  Top-K outputs fixed: ${topKFixedCount}`);
  console.log('------------------------------------------------------');
  console.log('');
}

main()
  .catch((err) => {
    console.error('Fatal:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
