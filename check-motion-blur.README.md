# Motion Blur Analysis Script

This script automates the analysis of whether a commit added motion blur functionality to the codebase.

## Purpose

The script performs the following checks on a given commit:

1. **Commit Message Analysis**: Checks if the commit message mentions "motion blur"
2. **File Changes**: Lists all files modified in the commit
3. **Keyword Search**: Searches for motion blur related terms like:
   - motion
   - blur
   - velocity
   - temporal
4. **File Pattern Analysis**: Checks for:
   - Blur-related files (files with "blur" in the name)
   - Shader files (`.glsl`, `.hlsl`, `.vert`, `.frag`)
   - Motion blur implementation keywords in the diff

## Usage

### Check the last commit (default)

```bash
./check-motion-blur.sh
```

### Check a specific commit

```bash
./check-motion-blur.sh <commit-sha>
```

### Examples

```bash
# Check the last commit
./check-motion-blur.sh

# Check a specific commit by SHA
./check-motion-blur.sh 3a95ce1

# Check a commit by branch name
./check-motion-blur.sh origin/main
```

## Output

The script provides:

- The commit message
- List of modified files
- Motion blur related terms found in the commit
- A detailed analysis summary with checkmarks (✓) and crosses (✗)
- A final conclusion about whether motion blur functionality was likely added

## Example Output

```text
============================================
Motion Blur Functionality Analysis
Analyzing commit: 3a95ce1
============================================

1. Commit Message:
----------------------
3a95ce1 Merge pull request #201: Implement motion blur

2. Files Modified in Commit:
--------------------------------
src/components/effects/Blur/BlurSection.js
src/components/effects/Blur/bodyScroll.ts
...

3. Motion Blur Related Terms in Commit:
-------------------------------------------
✓ Found motion blur related terms in the commit

4. Analysis Summary:
-------------------
✓ Commit message mentions motion blur
✓ Blur-related files were modified:
  src/components/effects/Blur/BlurSection.js
  src/components/effects/Blur/bodyScroll.ts
  ...
✓ Found motion blur implementation keywords in changes

============================================
CONCLUSION: This commit likely ADDED motion blur functionality
============================================
```

## Requirements

- Git repository
- Bash shell
- Standard Unix tools (grep)

## Notes

This script is based on the analysis approach described in the project's problem statement for determining if motion blur functionality was added to a commit.
