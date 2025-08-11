push:
	git add . && git commit -m 'chore' && git push origin

wakeup-tibybase-project:
	cd tinybase-mockup && npm run ios

# =============================================================================
# GIT & BRANCH MANAGEMENT
# =============================================================================

base:
	git switch develop && git pull origin develop

c: format commit
commit:
	git add  . && git commit -m 'chore'

s:
	git switch -c "$$(( ( RANDOM % 9000 ) + 1000 ))"

r:
	git switch develop && git pull origin develop && git switch -c "$$(( ( RANDOM % 9000 ) + 1000 ))"

b-clean:
	git branch --merged | grep -v "\*" | xargs git branch -d

# =============================================================================
# WORKFLOW DEBUGGING WITH ACT
# =============================================================================

# Debug the CI workflow locally
debug-ci:
	act -W .github/workflows/tinybase-mockup-ci.yml

# Debug the test coverage workflow locally  
debug-coverage:
	act -W .github/workflows/tinybase-mockup-test-coverage.yml

# Debug the status check workflow locally (requires workflow_run event)
debug-status:
	act workflow_run -W .github/workflows/tinybase-mockup-status-check.yml -e workflow_run_event.json

# Debug all workflows
debug-all:
	act --list

# Create a sample workflow_run event file for testing status check
create-workflow-event:
	echo '{"workflow_run": {"conclusion": "success", "name": "CI", "head_branch": "develop", "head_sha": "$(shell git rev-parse HEAD)", "id": "12345"}}' > workflow_run_event.json

# Create failure event for testing
create-failure-event:
	echo '{"workflow_run": {"conclusion": "failure", "name": "CI", "head_branch": "develop", "head_sha": "$(shell git rev-parse HEAD)", "id": "12345"}}' > workflow_run_failure_event.json

# Create cancelled event for testing
create-cancelled-event:
	echo '{"workflow_run": {"conclusion": "cancelled", "name": "CI", "head_branch": "develop", "head_sha": "$(shell git rev-parse HEAD)", "id": "12345"}}' > workflow_run_cancelled_event.json

# Debug with verbose output
debug-verbose:
	act -v -W .github/workflows/tinybase-mockup-ci.ymldeb