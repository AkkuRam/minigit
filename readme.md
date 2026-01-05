# Git Simulator Demo 

## Initial commit 
- { branch: 'master', lastCommit: 'Initial commit' }

## Branch creation & checkout
- Switched to existing branch: dev
- Switched to existing branch: master
- Switched to existing branch: hotfix
- Branches: [ 'master', 'dev', 'hotfix' ]

## Commit history (hotfix) 
- #2: Critical hotfix
- #0: Initial commit

## Merge hotfix into master 
- Switched to existing branch: master
- #3: Merge branch 'hotfix'
- #0: Initial commit

## Merge dev into master 
--

## Diff between commits 
- { from: "Merge branch 'hotfix'", to: "Merge branch 'dev'" }

## Final status 
- { branch: 'master', lastCommit: "Merge branch 'dev'" }






--- Merge dev into master ---

--- Diff between commits ---
{ from: "Merge branch 'hotfix'", to: "Merge branch 'dev'" }

--- Final status ---
{ branch: 'master', lastCommit: "Merge branch 'dev'" }
