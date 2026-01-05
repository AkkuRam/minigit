function Git(name) {
    this.name = name;
    this.lastCommitId = -1;
    this.branches = [];

    var master = new Branch("master", null);
    this.branches.push(master);

    this.HEAD = master
}

function Commit(id, parent, message) {
    this.id = id;
    this.parent = parent
    this.message = message;
    
}

function Branch(name, commit) {
  this.name = name;
  this.commit = commit;
}

Git.prototype.commit = function (message) {
    var commit = new Commit(
        ++this.lastCommitId,
        this.HEAD.commit,  
        message
    );
    this.HEAD.commit = commit;
    return commit;
};

Git.prototype.log = function () {
    var commit = this.HEAD.commit,
        history = [];
    
    while (commit){
        history.push(commit)
        commit = commit.parent
    }
    return history
}

/**
 * Switches branches or creates a new one
 */
Git.prototype.checkout = function (branchName) {
  for (var i = this.branches.length; i--; ) {
    if (this.branches[i].name === branchName) {
      console.log("Switched to existing branch: " + branchName);
      this.HEAD = this.branches[i];
      return this;
    }
  }

  var newBranch = new Branch(branchName, this.HEAD.commit);
  this.branches.push(newBranch);
  this.HEAD = newBranch;

  console.log("Switched to new branch: " + branchName);
  return this;

};

/**
 * Creates or lists branches
 */
Git.prototype.branch = function (name) {
  if (!name) {
    return this.branches.map(b => b.name);
  }

  for (var i = 0; i < this.branches.length; i++) {
    if (this.branches[i].name === name) {
      throw new Error("Branch already exists");
    }
  }

  var newBranch = new Branch(name, this.HEAD.commit);
  this.branches.push(newBranch);
  return newBranch;
};

Git.prototype.status = function () {
  return {
    branch: this.HEAD.name,
    lastCommit: this.HEAD.commit
      ? this.HEAD.commit.message
      : "No commits yet"
  };
};

/**
 * Merging another branch into current branch
 */
Git.prototype.merge = function (branchName) {
  var target = null;

  for (var i = 0; i < this.branches.length; i++) {
    if (this.branches[i].name === branchName) {
      target = this.branches[i];
      break;
    }
  }

  if (!target) {
    throw new Error("Branch not found");
  }

  if (this.HEAD.commit === target.commit) {
    return "Already up to date";
  }

  var commit = new Commit(
    ++this.lastCommitId,
    this.HEAD.commit,
    "Merge branch '" + branchName + "'"
  );

  commit.mergeParent = target.commit;
  this.HEAD.commit = commit;

  return commit;
};

/**
 * Difference between two commits
 */
Git.prototype.diff = function (commitA, commitB) {
  if (!commitA || !commitB) return "Nothing to diff";

  return {
    from: commitA.message,
    to: commitB.message
  };
};

console.log("===== Git Simulator Demo =====");
var repo = new Git("demo-repo");

/* --------------------------------
 * Initial commit on master
 * -------------------------------- */
console.log("\n--- Initial commit ---");
repo.commit("Initial commit");

console.log(repo.status());
// { branch: 'master', lastCommit: 'Initial commit' }

/* --------------------------------
 * Create and switch branches
 * -------------------------------- */
console.log("\n--- Branch creation & checkout ---");
repo.branch("dev");
repo.checkout("dev");
repo.commit("Add core feature");

repo.checkout("master");
repo.branch("hotfix");
repo.checkout("hotfix");
repo.commit("Critical hotfix");

console.log("Branches:", repo.branch());
// ["master", "dev", "hotfix"]

/* --------------------------------
 * Commit history per branch
 * -------------------------------- */
console.log("\n--- Commit history (hotfix) ---");
repo.log().forEach(c => {
  console.log(`#${c.id}: ${c.message}`);
});

/* --------------------------------
 * Merge branches
 * -------------------------------- */
console.log("\n--- Merge hotfix into master ---");
repo.checkout("master");
repo.merge("hotfix");

repo.log().forEach(c => {
  console.log(`#${c.id}: ${c.message}`);
});

/* --------------------------------
 * Merge dev branch
 * -------------------------------- */
console.log("\n--- Merge dev into master ---");
repo.merge("dev");

/* --------------------------------
 * Diff between commits
 * -------------------------------- */
console.log("\n--- Diff between commits ---");
var history = repo.log();
console.log(repo.diff(history[1], history[0]));

/* --------------------------------
 * Final status
 * -------------------------------- */
console.log("\n--- Final status ---");
console.log(repo.status());



