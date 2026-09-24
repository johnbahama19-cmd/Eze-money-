import { Course, Assignment, Student, Submission } from '../types';

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-cs101',
    name: 'CS 101: Data Structures & Algorithms',
    code: 'CS-101',
    period: 'Period 2',
    term: 'Fall 2026',
    description: 'Foundations of computational problem solving, asymptotic analysis, trees, graphs, and dynamic programming.',
    enrolledCount: 24,
    instructorName: 'Prof. Ezeugo',
  },
  {
    id: 'course-eng302',
    name: 'ENG 302: Comparative World Literature',
    code: 'ENG-302',
    period: 'Period 4',
    term: 'Fall 2026',
    description: 'Critical investigation of mythological archetypes, tragic flaws, and ethical dilemmas across classical and contemporary fiction.',
    enrolledCount: 28,
    instructorName: 'Prof. Ezeugo',
  },
  {
    id: 'course-bio210',
    name: 'BIO 210: Molecular Genetics & Ethics',
    code: 'BIO-210',
    period: 'Period 6',
    term: 'Fall 2026',
    description: 'Investigation of gene expression, CRISPR genome editing techniques, and bioethical policy frameworks.',
    enrolledCount: 22,
    instructorName: 'Prof. Ezeugo',
  },
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-cs1',
    courseId: 'course-cs101',
    title: 'Lab 3: Binary Search Tree Balancing & Traversal',
    description: 'Implement an AVL or Red-Black self-balancing tree and benchmark search latency under worst-case insertion sequences.',
    instructions: `### Assignment Objectives
1. Implement in-order, pre-order, and level-order traversal algorithms.
2. Maintain logarithmic depth guarantee through node rotations.
3. Write an asymptotic analysis explaining rotation trade-offs.
4. Provide unit tests covering corner cases (duplicate keys, single node, skewed insertion).

### Submission Format
Submit your algorithm implementation and an accompanying analytical reflection report in Markdown/code format.`,
    type: 'code',
    dueAt: '2026-10-02T23:59:00',
    maxPoints: 100,
    status: 'active',
    createdAt: '2026-09-18T10:00:00',
    starterSnippet: `class TreeNode {
  int value;
  TreeNode left;
  TreeNode right;
  int height;
  // TODO: Implement rotation balance methods
}`,
    rubric: [
      {
        id: 'crit-cs-1',
        title: 'Algorithmic Correctness & Rotations',
        maxScore: 30,
        description: 'Tree correctly maintains binary search invariant and self-balances with O(log n) height guarantee across all operations.',
        levels: [
          { label: 'Exemplary', scoreRange: '27-30 pts', description: 'Flawless balance logic, handles all single and double rotation edge cases seamlessly.' },
          { label: 'Proficient', scoreRange: '23-26 pts', description: 'Rotations balance correctly for most cases; minor edge case in re-balancing after deletion.' },
          { label: 'Developing', scoreRange: '18-22 pts', description: 'Partial rotation logic; tree remains skewed under specific insertion sequences.' },
          { label: 'Beginning', scoreRange: '0-17 pts', description: 'Incomplete implementation or tree properties violated.' },
        ],
      },
      {
        id: 'crit-cs-2',
        title: 'Asymptotic Analysis & Benchmarking',
        maxScore: 25,
        description: 'Rigorous theoretical complexity derivation backed by empirical runtime benchmarks and graph plots.',
        levels: [
          { label: 'Exemplary', scoreRange: '23-25 pts', description: 'Thorough Big-O proof with tight bounds and realistic benchmark charts comparing against unskewed BST.' },
          { label: 'Proficient', scoreRange: '19-22 pts', description: 'Solid complexity analysis with basic benchmarking data.' },
          { label: 'Developing', scoreRange: '15-18 pts', description: 'States Big-O results without complete derivation or benchmark evidence.' },
          { label: 'Beginning', scoreRange: '0-14 pts', description: 'Superficial complexity claims with errors.' },
        ],
      },
      {
        id: 'crit-cs-3',
        title: 'Code Architecture & Robustness',
        maxScore: 25,
        description: 'Clean modular object-oriented design, memory management, exception handling, and self-documenting code.',
        levels: [
          { label: 'Exemplary', scoreRange: '23-25 pts', description: 'Elegant abstraction, zero memory leaks, thorough defensive checks and clean idiomatic patterns.' },
          { label: 'Proficient', scoreRange: '19-22 pts', description: 'Clean architecture with consistent formatting and sensible naming.' },
          { label: 'Developing', scoreRange: '15-18 pts', description: 'Monolithic methods or inconsistent naming conventions.' },
          { label: 'Beginning', scoreRange: '0-14 pts', description: 'Tangled logic, missing bounds checking.' },
        ],
      },
      {
        id: 'crit-cs-4',
        title: 'Test Coverage & Edge Cases',
        maxScore: 20,
        description: 'Comprehensive automated test harness covering empty trees, duplicate keys, descending sequential inputs, and random fuzzing.',
        levels: [
          { label: 'Exemplary', scoreRange: '18-20 pts', description: 'Extensive test suite with 95%+ branch coverage and edge-case assertions.' },
          { label: 'Proficient', scoreRange: '14-17 pts', description: 'Good coverage of typical cases and major boundaries.' },
          { label: 'Developing', scoreRange: '10-13 pts', description: 'Only tests the standard happy-path inputs.' },
          { label: 'Beginning', scoreRange: '0-9 pts', description: 'Minimal or non-functional test assertions.' },
        ],
      },
    ],
  },
  {
    id: 'asg-eng1',
    courseId: 'course-eng302',
    title: 'Essay: The Architecture of Tragic Hubris in Classical Drama',
    description: 'Compare Sophocles’ Antigone with Chinua Achebe’s Things Fall Apart regarding the destructive collisions between individual pride and communal law.',
    instructions: `### Prompt
Examine how hubris functions not merely as an isolated psychological flaw, but as a systemic catalyst that destabilizes societal equilibria in *Antigone* and *Things Fall Apart*. 

### Requirements
- 1,200 to 1,600 words.
- Formulate a clear, nuanced, arguable thesis in the introduction.
- Direct textual citations from both primary texts with MLA citation style.
- At least two secondary critical scholarly sources.`,
    type: 'essay',
    dueAt: '2026-10-08T23:59:00',
    maxPoints: 100,
    status: 'active',
    createdAt: '2026-09-20T08:30:00',
    rubric: [
      {
        id: 'crit-eng-1',
        title: 'Thesis Strength & Intellectual Originality',
        maxScore: 30,
        description: 'Articulates an arguable, sophisticated thesis that moves beyond plot summary into structural synthesis.',
        levels: [
          { label: 'Exemplary', scoreRange: '27-30 pts', description: 'Brilliant, non-obvious thesis revealing unexpected thematic symmetry across cultural contexts.' },
          { label: 'Proficient', scoreRange: '23-26 pts', description: 'Clear, defensible thesis that establishes a sound comparative framework.' },
          { label: 'Developing', scoreRange: '18-22 pts', description: 'Thesis leans descriptive rather than interpretive.' },
          { label: 'Beginning', scoreRange: '0-17 pts', description: 'Unclear or absent central thesis statement.' },
        ],
      },
      {
        id: 'crit-eng-2',
        title: 'Textual Evidence & Comparative Synthesis',
        maxScore: 30,
        description: 'Skillfully integrates close-reading textual excerpts to substantiate theoretical claims without plot summary padding.',
        levels: [
          { label: 'Exemplary', scoreRange: '27-30 pts', description: 'Surgical textual analysis; parses diction, metaphor, and subtext seamlessly.' },
          { label: 'Proficient', scoreRange: '23-26 pts', description: 'Consistently provides appropriate textual citations to support major claims.' },
          { label: 'Developing', scoreRange: '18-22 pts', description: 'Quotes are inserted without sufficient analytical unpacking.' },
          { label: 'Beginning', scoreRange: '0-17 pts', description: 'Sparse or inaccurate textual references.' },
        ],
      },
      {
        id: 'crit-eng-3',
        title: 'Rhetorical Structure & Transitions',
        maxScore: 20,
        description: 'Logical sequencing of paragraphs with organic transitions between cultural periods and dramatic forms.',
        levels: [
          { label: 'Exemplary', scoreRange: '18-20 pts', description: 'Effortless thematic progression where each paragraph builds inevitably upon the prior.' },
          { label: 'Proficient', scoreRange: '15-17 pts', description: 'Organized clearly with effective topic sentences and bridges.' },
          { label: 'Developing', scoreRange: '11-14 pts', description: 'Abrupt transitions or disjointed comparative blocks.' },
          { label: 'Beginning', scoreRange: '0-10 pts', description: 'Disorganized thoughts requiring restructuring.' },
        ],
      },
      {
        id: 'crit-eng-4',
        title: 'Stylistic Precision & Academic Conventions',
        maxScore: 20,
        description: 'Eloquent prose rhythm, sophisticated vocabulary, accurate grammar, and impeccable citation formatting.',
        levels: [
          { label: 'Exemplary', scoreRange: '18-20 pts', description: 'Polished scholarly voice with distinctive tonal control and zero mechanical errors.' },
          { label: 'Proficient', scoreRange: '15-17 pts', description: 'Fluent writing with very minor punctuation or citation oversights.' },
          { label: 'Developing', scoreRange: '11-14 pts', description: 'Repetitive sentence structures or occasional grammatical hiccups.' },
          { label: 'Beginning', scoreRange: '0-10 pts', description: 'Frequent grammatical errors impeding reader comprehension.' },
        ],
      },
    ],
  },
  {
    id: 'asg-bio1',
    courseId: 'course-bio210',
    title: 'Case Study: CRISPR-Cas9 Off-Target Mutagenesis Protocols',
    description: 'Analyze experimental sequencing data to detect guide RNA off-target frequency and formulate mitigation protocols.',
    instructions: `Review the provided deep-sequencing dataset from HEK293T cell trials. Calculate off-target cleavages, evaluate cellular repair pathways (NHEJ vs HDR), and propose a bioengineered high-fidelity Cas9 variant strategy.`,
    type: 'lab_report',
    dueAt: '2026-10-15T23:59:00',
    maxPoints: 100,
    status: 'active',
    createdAt: '2026-09-21T14:00:00',
    rubric: [
      {
        id: 'crit-bio-1',
        title: 'Data Analysis & Quantitative Accuracy',
        maxScore: 35,
        description: 'Accurate computation of off-target mutation frequencies and statistical significance testing.',
      },
      {
        id: 'crit-bio-2',
        title: 'Mechanism of Action & Biological Insight',
        maxScore: 35,
        description: 'Demonstration of deep comprehension of PAM recognition, guide RNA pairing thermodynamics, and DNA repair kinetics.',
      },
      {
        id: 'crit-bio-3',
        title: 'Bioethical & Translational Discussion',
        maxScore: 30,
        description: 'Nuanced discussion of clinical translation constraints, somatic vs germline governance, and risk mitigation protocols.',
      },
    ],
  },
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-ezeugo',
    name: 'Ezeugo',
    email: 'ezeugo@academy.edu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    courseIds: ['course-cs101', 'course-eng302', 'course-bio210'],
    overallGpa: 3.95,
    overallPercentage: 96.2,
    status: 'excelling',
    skillDimensions: [
      { name: 'Algorithmic Thinking', score: 98, trend: 'up' },
      { name: 'Critical Analysis', score: 95, trend: 'up' },
      { name: 'Empirical Rigor', score: 96, trend: 'up' },
      { name: 'Technical Writing', score: 96, trend: 'up' },
    ],
  },
  {
    id: 'std-1',
    name: 'Maya Lin',
    email: 'maya.lin@academy.edu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    courseIds: ['course-cs101', 'course-eng302'],
    overallGpa: 3.92,
    overallPercentage: 94.8,
    status: 'excelling',
    skillDimensions: [
      { name: 'Algorithmic Thinking', score: 96, trend: 'up' },
      { name: 'Critical Analysis', score: 94, trend: 'stable' },
      { name: 'Empirical Rigor', score: 92, trend: 'up' },
      { name: 'Technical Writing', score: 95, trend: 'up' },
    ],
  },
  {
    id: 'std-2',
    name: 'Alex Chen',
    email: 'alex.chen@academy.edu',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    courseIds: ['course-cs101', 'course-bio210'],
    overallGpa: 3.78,
    overallPercentage: 89.2,
    status: 'on_track',
    skillDimensions: [
      { name: 'Algorithmic Thinking', score: 91, trend: 'up' },
      { name: 'Critical Analysis', score: 85, trend: 'stable' },
      { name: 'Empirical Rigor', score: 93, trend: 'up' },
      { name: 'Technical Writing', score: 86, trend: 'down' },
    ],
  },
  {
    id: 'std-3',
    name: 'Marcus Vance',
    email: 'marcus.v@academy.edu',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    courseIds: ['course-cs101', 'course-eng302'],
    overallGpa: 3.15,
    overallPercentage: 77.4,
    status: 'needs_attention',
    skillDimensions: [
      { name: 'Algorithmic Thinking', score: 79, trend: 'down' },
      { name: 'Critical Analysis', score: 81, trend: 'stable' },
      { name: 'Empirical Rigor', score: 72, trend: 'down' },
      { name: 'Technical Writing', score: 76, trend: 'down' },
    ],
    recentAlert: 'Dropped 8% in Asymptotic Benchmarking; recommended targeted office hours review.',
  },
  {
    id: 'std-4',
    name: 'Elena Rostova',
    email: 'elena.r@academy.edu',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    courseIds: ['course-eng302', 'course-bio210'],
    overallGpa: 3.86,
    overallPercentage: 92.5,
    status: 'excelling',
    skillDimensions: [
      { name: 'Algorithmic Thinking', score: 88, trend: 'stable' },
      { name: 'Critical Analysis', score: 97, trend: 'up' },
      { name: 'Empirical Rigor', score: 90, trend: 'up' },
      { name: 'Technical Writing', score: 96, trend: 'up' },
    ],
  },
  {
    id: 'std-5',
    name: 'Jordan Hayes',
    email: 'jordan.h@academy.edu',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
    courseIds: ['course-cs101', 'course-bio210'],
    overallGpa: 2.82,
    overallPercentage: 69.8,
    status: 'at_risk',
    skillDimensions: [
      { name: 'Algorithmic Thinking', score: 68, trend: 'down' },
      { name: 'Critical Analysis', score: 71, trend: 'stable' },
      { name: 'Empirical Rigor', score: 65, trend: 'down' },
      { name: 'Technical Writing', score: 73, trend: 'down' },
    ],
    recentAlert: 'Missed pre-flight submission check on Lab 2; rubric scores lagging in Edge Cases.',
  },
  {
    id: 'std-6',
    name: 'Sofia Patel',
    email: 'sofia.p@academy.edu',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    courseIds: ['course-eng302', 'course-cs101'],
    overallGpa: 3.65,
    overallPercentage: 88.0,
    status: 'on_track',
    skillDimensions: [
      { name: 'Algorithmic Thinking', score: 86, trend: 'up' },
      { name: 'Critical Analysis', score: 92, trend: 'up' },
      { name: 'Empirical Rigor', score: 84, trend: 'stable' },
      { name: 'Technical Writing', score: 89, trend: 'stable' },
    ],
  },
];

export const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: 'sub-ezeugo-1',
    assignmentId: 'asg-eng1',
    studentId: 'std-ezeugo',
    studentName: 'Ezeugo',
    studentEmail: 'ezeugo@academy.edu',
    submittedAt: '2026-09-22T16:20:00',
    status: 'graded',
    content: `Title: The Mechanics of Nemesis: Hubris as Systemic Fragility in Classical and Post-Colonial Drama

Hubris is customarily conceptualized as an individual psychic inflation—a heroic personality overstepping the bounds of mortal modesty. Yet when we scrutinize Sophocles’ Antigone alongside Chinua Achebe’s Things Fall Apart, hubris reveals itself as a structural fragility embedded within rigid institutional authorities. Creon’s edict denying Polyneices burial rites and Okonkwo’s fatal overcompensation for his father Unoka’s perceived softness both expose a central truth: tyrannical posture is fundamentally a defense mechanism born of institutional panic.

In Antigone, Creon’s assertion that the sovereign’s word supersedes divine cosmological law ("Is the city not held to be the ruler's?") constitutes what Aristotle defined as hamartia driven by autocratic paranoia. Creon cannot separate the welfare of Thebes from his personal authority. Similarly, in Umuofia, Okonkwo’s fear of being viewed as weak drives him to participate in the execution of Ikemefuna, in direct violation of the elder Ezeudu’s solemn counsel: "That boy calls you father. Do not bear a hand in his death." In both narratives, the protagonist’s hubris does not conquer vulnerability; it precipitates the rapid disintegration of the very order they sought to preserve.

Consequently, both texts suggest that hubris is not merely a personal moral flaw, but the fatal refusal of an authority to evolve in an ever-shifting moral universe.`,
    evaluation: {
      totalScore: 99,
      maxScore: 100,
      percentage: 99,
      gradeLetter: 'A+',
      overallSummary: 'An extraordinary piece of comparative literary analysis. Ezeugo weaves textual evidence from Sophocles and Achebe with remarkable nuance, presenting a compelling thesis on hubris as institutional fragility.',
      strengths: [
        'Nuanced, arguable thesis that unites ancient Greek drama with post-colonial fiction seamlessly',
        'Direct close-reading quotes integrated into rhetorical arguments with high academic dexterity',
        'Eloquent, sophisticated scholarly prose without any mechanical defects'
      ],
      growthAreas: [
        'Could briefly explore how the chorus in Antigone mirrors the communal assembly of Umuofia in mediating hubristic tension'
      ],
      nextSteps: [
        'Consider submitting this paper for the Undergraduate Literary Review Symposium',
        'Prepare thesis defense for the comparative literature capstone'
      ],
      gradedAt: '2026-09-22T18:00:00',
      gradedBy: 'AI Auto-Evaluator',
      teacherNotes: 'Flawless comparative synthesis. Well deserved A+.',
      rubricScores: [
        {
          criterionId: 'crit-eng-1',
          criterionTitle: 'Thesis Strength & Intellectual Originality',
          score: 30,
          maxScore: 30,
          feedback: 'Exceptional thesis identifying hubris as a systemic institutional pathology rather than isolated ego.',
          evidenceFound: 'Creon and Okonkwo linked via defense mechanism born of institutional panic.'
        },
        {
          criterionId: 'crit-eng-2',
          criterionTitle: 'Textual Evidence & Comparative Synthesis',
          score: 30,
          maxScore: 30,
          feedback: 'Exemplary textual integration of Creon’s dialogue and Ezeudu’s warning.',
          evidenceFound: 'Ezeudu’s quote paired with Creon’s claim of autocratic rule.'
        },
        {
          criterionId: 'crit-eng-3',
          criterionTitle: 'Rhetorical Structure & Transitions',
          score: 20,
          maxScore: 20,
          feedback: 'Seamless transitions and coherent thematic progression.',
          evidenceFound: 'Natural bridge between classical Athenian polis and Igbo traditional governance.'
        },
        {
          criterionId: 'crit-eng-4',
          criterionTitle: 'Stylistic Precision & Academic Conventions',
          score: 19,
          maxScore: 20,
          feedback: 'Polished academic voice and commanding vocabulary.',
          evidenceFound: 'Sophisticated literary phrasing throughout.'
        }
      ]
    }
  },
  {
    id: 'sub-1',
    assignmentId: 'asg-cs1',
    studentId: 'std-1',
    studentName: 'Maya Lin',
    studentEmail: 'maya.lin@academy.edu',
    submittedAt: '2026-09-22T19:42:00',
    status: 'graded',
    content: `// AVL Tree implementation with self-balancing logarithmic depth guarantees
class AVLTree {
  class Node {
    int key, height;
    Node left, right;
    Node(int d) { key = d; height = 1; }
  }
  
  Node root;

  int height(Node N) {
    if (N == null) return 0;
    return N.height;
  }

  int getBalance(Node N) {
    if (N == null) return 0;
    return height(N.left) - height(N.right);
  }

  Node rightRotate(Node y) {
    Node x = y.left;
    Node T2 = x.right;
    x.right = y;
    y.left = T2;
    y.height = Math.max(height(y.left), height(y.right)) + 1;
    x.height = Math.max(height(x.left), height(x.right)) + 1;
    return x;
  }

  Node leftRotate(Node x) {
    Node y = x.right;
    Node T2 = y.left;
    y.left = x;
    x.right = T2;
    x.height = Math.max(height(x.left), height(x.right)) + 1;
    y.height = Math.max(height(y.left), height(y.right)) + 1;
    return y;
  }

  Node insert(Node node, int key) {
    if (node == null) return new Node(key);
    if (key < node.key) node.left = insert(node.left, key);
    else if (key > node.key) node.right = insert(node.right, key);
    else return node; // duplicate keys ignored

    node.height = 1 + Math.max(height(node.left), height(node.right));
    int balance = getBalance(node);

    // Left Left Case
    if (balance > 1 && key < node.left.key) return rightRotate(node);
    // Right Right Case
    if (balance < -1 && key > node.right.key) return leftRotate(node);
    // Left Right Case
    if (balance > 1 && key > node.left.key) {
      node.left = leftRotate(node.left);
      return rightRotate(node);
    }
    // Right Left Case
    if (balance < -1 && key < node.right.key) {
      node.right = rightRotate(node.right);
      return leftRotate(node);
    }
    return node;
  }
}

### Asymptotic Performance Reflection
In an unskewed BST subjected to monotonic insertions [1..N], depth degenerates to O(N). By enforcing the AVL balance invariant |H_left - H_right| <= 1 at every insertion, maximum tree height is strictly bounded by 1.44 log2(N). Microbenchmarks across 100,000 randomized elements demonstrated consistent search latencies under 0.008ms, outperforming degenerate linear chains by a factor of 124x.`,
    evaluation: {
      totalScore: 97,
      maxScore: 100,
      percentage: 97,
      gradeLetter: 'A+',
      overallSummary: 'Superb implementation with rigorous mathematical justification. The rotation procedures and height recalculations are implemented flawlessly, and the accompanying asymptotic reflection demonstrates deep mastery of balance invariants.',
      strengths: [
        'Precise handling of all 4 rotation quadrants (LL, RR, LR, RL)',
        'Empirical microbenchmark data validates theoretical logarithmic guarantees',
        'Clean, self-documenting Java implementation with clear structural boundaries'
      ],
      growthAreas: [
        'Consider implementing node deletion logic with corresponding rebalancing to complete the ADT lifecycle',
        'Explore iterative traversal variants to eliminate stack overhead for extremely deep graphs'
      ],
      nextSteps: [
        'Proceed to red-black trees comparison in Lab 4',
        'Exemplary submission eligible for course showcase'
      ],
      gradedAt: '2026-09-22T21:10:00',
      gradedBy: 'AI Auto-Evaluator',
      teacherNotes: 'Confirmed by Prof. Vance. Outstanding benchmark verification.',
      rubricScores: [
        {
          criterionId: 'crit-cs-1',
          criterionTitle: 'Algorithmic Correctness & Rotations',
          score: 30,
          maxScore: 30,
          feedback: 'All four rotation cases correctly handled with strict height re-computation.',
          evidenceFound: 'Node rightRotate and leftRotate methods handle pivot switches cleanly.'
        },
        {
          criterionId: 'crit-cs-2',
          criterionTitle: 'Asymptotic Analysis & Benchmarking',
          score: 25,
          maxScore: 25,
          feedback: 'Mathematical bound 1.44 log2(N) cited accurately and verified with 100k random element test.',
          evidenceFound: 'Empirical data demonstrates 124x speedup over degenerate BST.'
        },
        {
          criterionId: 'crit-cs-3',
          criterionTitle: 'Code Architecture & Robustness',
          score: 24,
          maxScore: 25,
          feedback: 'Exceptional code structure. Minor: consider adding immutable node wrappers.',
          evidenceFound: 'Clear class encapsulation with recursive helper methods.'
        },
        {
          criterionId: 'crit-cs-4',
          criterionTitle: 'Test Coverage & Edge Cases',
          score: 18,
          maxScore: 20,
          feedback: 'Duplicate keys handled gracefully; would benefit from explicit null-root guard tests.',
          evidenceFound: 'Unit assertions cover skewed ascending input series.'
        },
      ],
    },
  },
  {
    id: 'sub-2',
    assignmentId: 'asg-cs1',
    studentId: 'std-2',
    studentName: 'Alex Chen',
    studentEmail: 'alex.chen@academy.edu',
    submittedAt: '2026-09-23T11:20:00',
    status: 'submitted',
    content: `class BalancedBST {
  Node root;

  // Basic BST Insertion
  void insert(int val) {
    root = insertRec(root, val);
  }

  Node insertRec(Node root, int val) {
    if (root == null) {
      root = new Node(val);
      return root;
    }
    if (val < root.val) root.left = insertRec(root.left, val);
    else if (val > root.val) root.right = insertRec(root.right, val);
    return root;
  }

  // TODO: Finish balance verification checks
  boolean isBalanced(Node n) {
    if (n == null) return true;
    int lh = height(n.left);
    int rh = height(n.right);
    return Math.abs(lh - rh) <= 1 && isBalanced(n.left) && isBalanced(n.right);
  }

  int height(Node n) {
    if (n == null) return 0;
    return 1 + Math.max(height(n.left), height(n.right));
  }
}

### Analysis
The algorithm tests whether the tree is currently balanced by recursively computing subtree heights. In the worst case, checking every node's height takes O(N^2) if not memoized, but provides a baseline comparison against self-adjusting trees.`,
  },
  {
    id: 'sub-3',
    assignmentId: 'asg-eng1',
    studentId: 'std-4',
    studentName: 'Elena Rostova',
    studentEmail: 'elena.r@academy.edu',
    submittedAt: '2026-09-22T14:35:00',
    status: 'submitted',
    content: `Title: The Fracture of the Sacred: Systemic Hubris in Sophocles and Achebe

Hubris in dramatic tradition is frequently diminished as an isolated psychological vice—an inflated ego blinding an individual monarch to mortal vulnerability. However, in both Sophocles’ *Antigone* and Chinua Achebe’s *Things Fall Apart*, hubris functions primarily as a systemic pathology. It emerges when an authority figure confuses personal edicts with divine or cosmic law. Creon’s decree forbidding Polyneices’ burial and Okonkwo’s dogmatic obsession with hyper-masculinity both stem from an identical defensive impulse: the terrifying fear of appearing weak in the face of structural transformation.

In *Antigone*, Creon’s hubris does not reside simply in his harshness, but in his total usurpation of the unwritten laws of the gods (agrapta nomima). When Antigone declares that Creon’s proclamation lacks divine permanence, she illuminates the state’s overreach. Similarly, Okonkwo’s fatal participation in the ritual slaughter of Ikemefuna represents a catastrophic surrender to social paranoia. Achebe writes that Okonkwo was "afraid of being thought weak," demonstrating that his tragedy is born not of genuine tribal piety, but of an internalized dread of social emasculation.

By contextualizing both protagonists within their respective socio-political crises, we see that hubris is not born in a vacuum; it is the violent symptom of an ossified hierarchy attempting to violently arrest historical change.`,
  },
  {
    id: 'sub-4',
    assignmentId: 'asg-cs1',
    studentId: 'std-3',
    studentName: 'Marcus Vance',
    studentEmail: 'marcus.v@academy.edu',
    submittedAt: '2026-09-23T15:00:00',
    status: 'submitted',
    content: `// Binary Tree Insertion
function insertBST(root, val) {
  if (!root) return { val, left: null, right: null };
  if (val < root.val) root.left = insertBST(root.left, val);
  else root.right = insertBST(root.right, val);
  return root;
}

// Tree rotations attempted below
function rotateLeft(node) {
  let temp = node.right;
  node.right = temp.left;
  temp.left = node;
  return temp;
}

// Test cases
let tree = null;
[10, 20, 30].forEach(n => { tree = insertBST(tree, n); });
console.log("Tree created", tree);`,
  },
  {
    id: 'sub-5',
    assignmentId: 'asg-cs1',
    studentId: 'std-5',
    studentName: 'Jordan Hayes',
    studentEmail: 'jordan.h@academy.edu',
    submittedAt: '2026-09-23T16:15:00',
    status: 'submitted',
    content: `class SimpleBST {
  constructor() {
    this.root = null;
  }
  add(val) {
    if (!this.root) {
      this.root = { val, left: null, right: null };
      return;
    }
  }
}
// Note: Still working on the double rotations and edge cases.`,
  },
];
