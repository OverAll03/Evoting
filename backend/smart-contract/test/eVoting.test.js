const EVoting = artifacts.require("EVoting");

contract("EVoting", (accounts) => {
  let evoting;
  const owner = accounts[0];
  const voter1 = accounts[1];
  const voter2 = accounts[2];
  const nonAuthority = accounts[3];

  beforeEach(async () => {
    evoting = await EVoting.new({ from: owner });
  });

  describe("Electoral Authorities", () => {
    it("should allow the owner to add new electoral authorities", async () => {
      await evoting.addElectoralAuthority(voter1, { from: owner });
      // Since we can't directly check if voter1 is an authority, we'll test it indirectly
      // by having voter1 perform an action only authorities can do
      await evoting.addElectoralAuthority(voter2, { from: voter1 });
      // If this doesn't throw, we know voter1 was successfully added as an authority
    });

    it("should not allow non-authorities to add new authorities", async () => {
      try {
        await evoting.addElectoralAuthority(voter2, { from: nonAuthority });
        assert.fail("The transaction should have thrown an error");
      } catch (err) {
        assert.include(err.message, "revert", "The error message should contain 'revert'");
      }
    });
  });

  describe("Election Creation", () => {
    it("should create a new public election", async () => {
      const now = Math.floor(Date.now() / 1000);
      const startDate = now + 3600; // 1 hour from now
      const endDate = now + 86400; // 1 day from now

      const tx = await evoting.createElection(
        "Test Election",
        "A test election",
        startDate,
        endDate,
        false,
        [],
        { from: owner }
      );

      assert.equal(tx.logs[0].event, 'ElectionCreated', "ElectionCreated event should be emitted");
      assert.equal(tx.logs[0].args.electionId.toNumber(), 1, "Election ID should be 1");
      assert.equal(tx.logs[0].args.name, "Test Election", "Election name should match");
      assert.equal(tx.logs[0].args.isPrivate, false, "Election should be public");
      assert.equal(tx.logs[0].args.startDate.toNumber(), startDate, "Start date should match");
      assert.equal(tx.logs[0].args.endDate.toNumber(), endDate, "End date should match");

      const electionCount = await evoting.electionCount();
      assert.equal(electionCount, 1, "Election count should be 1");
    });

    it("should create a new private election", async () => {
      const now = Math.floor(Date.now() / 1000);
      const startDate = now + 3600; // 1 hour from now
      const endDate = now + 86400; // 1 day from now

      const voters = [
        { id: 1, name: "Alice", surname: "Smith", email: "alice@example.com", hasVoted: false },
        { id: 2, name: "Bob", surname: "Jones", email: "bob@example.com", hasVoted: false }
      ];

      const tx = await evoting.createElection(
        "Private Test Election",
        "A private test election",
        startDate,
        endDate,
        true,
        voters,
        { from: owner }
      );

      assert.equal(tx.logs[0].event, 'ElectionCreated', "ElectionCreated event should be emitted");
      assert.equal(tx.logs[0].args.electionId.toNumber(), 1, "Election ID should be 1");
      assert.equal(tx.logs[0].args.name, "Private Test Election", "Election name should match");
      assert.equal(tx.logs[0].args.isPrivate, true, "Election should be private");
      assert.equal(tx.logs[0].args.startDate.toNumber(), startDate, "Start date should match");
      assert.equal(tx.logs[0].args.endDate.toNumber(), endDate, "End date should match");

      const electionDetails = await evoting.getElectionDetails(1);
      assert.equal(electionDetails.isPrivate, true, "Election should be private");
      assert.equal(electionDetails.voters.length, 2, "Should have 2 registered voters");
    });
  });

  describe("Candidate Management", () => {
    beforeEach(async () => {
      const now = Math.floor(Date.now() / 1000);
      await evoting.createElection(
        "Test Election",
        "A test election",
        now + 3600,
        now + 86400,
        false,
        [],
        { from: owner }
      );
    });

    it("should add a candidate to an election", async () => {
      const tx = await evoting.addCandidate(1, "Candidate 1", "Candidate 1's program", { from: owner });

      assert.equal(tx.logs[0].event, 'CandidateAdded', "CandidateAdded event should be emitted");
      assert.equal(tx.logs[0].args.electionId.toNumber(), 1, "Election ID should be 1");
      assert.equal(tx.logs[0].args.candidateId.toNumber(), 1, "Candidate ID should be 1");
      assert.equal(tx.logs[0].args.name, "Candidate 1", "Candidate name should match");
      assert.equal(tx.logs[0].args.program, "Candidate 1's program", "Candidate program should match");

      const electionDetails = await evoting.getElectionDetails(1);
      assert.equal(electionDetails.candidates.length, 1, "Should have 1 candidate");
      assert.equal(electionDetails.candidates[0].name, "Candidate 1", "Candidate name should match");
    });

    it("should not allow non-authorities to add candidates", async () => {
      try {
        await evoting.addCandidate(1, "Candidate 2", "Candidate 2's program", { from: nonAuthority });
        assert.fail("The transaction should have thrown an error");
      } catch (err) {
        assert.include(err.message, "revert", "The error message should contain 'revert'");
      }
    });
  });

  describe("Voting Process", () => {
    beforeEach(async () => {
      const now = Math.floor(Date.now() / 1000);
      await evoting.createElection(
        "Test Election",
        "A test election",
        now + 3600,
        now + 86400,
        false,
        [],
        { from: owner }
      );
      await evoting.addCandidate(1, "Candidate 1", "Candidate 1's program", { from: owner });
      await evoting.addCandidate(1, "Candidate 2", "Candidate 2's program", { from: owner });
    });

    it("should not allow voting when session is closed", async () => {
      try {
        await evoting.vote(1, 1, "Voter", "One", "voter@example.com", { from: voter1 });
        assert.fail("The transaction should have thrown an error");
      } catch (err) {
        assert.include(err.message, "revert", "The error message should contain 'revert'");
      }
    });

    it("should allow voting when session is open", async () => {
      await evoting.openVotingSession(1, { from: owner });

      const tx = await evoting.vote(1, 1, "Voter", "One", "voter@example.com", { from: voter1 });

      assert.equal(tx.logs[0].event, 'Voted', "Voted event should be emitted");
      assert.equal(tx.logs[0].args.electionId.toNumber(), 1, "Election ID should be 1");
      assert.equal(tx.logs[0].args.voterId.toNumber(), 1, "Voter ID should be 1");
      assert.equal(tx.logs[0].args.candidateId.toNumber(), 1, "Candidate ID should be 1");

      const electionDetails = await evoting.getElectionDetails(1);
      assert.equal(electionDetails.candidates[0].voteCount, 1, "Candidate should have 1 vote");
    });

    it("should not allow voting for non-existent candidates", async () => {
      await evoting.openVotingSession(1, { from: owner });

      try {
        await evoting.vote(1, 3, "Voter", "Two", "voter2@example.com", { from: voter2 });
        assert.fail("The transaction should have thrown an error");
      } catch (err) {
        assert.include(err.message, "revert", "The error message should contain 'revert'");
      }
    });
  });

  describe("Election Management", () => {
    beforeEach(async () => {
      const now = Math.floor(Date.now() / 1000);
      await evoting.createElection(
        "Test Election",
        "A test election",
        now + 3600,
        now + 86400,
        false,
        [],
        { from: owner }
      );
    });

    it("should open voting session", async () => {
      await evoting.openVotingSession(1, { from: owner });
      const electionDetails = await evoting.getElectionDetails(1);
      assert.isTrue(electionDetails.votingSessionOpen, "Voting session should be open");
    });

    it("should close voting session", async () => {
      await evoting.openVotingSession(1, { from: owner });
      await evoting.closeVotingSession(1, { from: owner });
      const electionDetails = await evoting.getElectionDetails(1);
      assert.isFalse(electionDetails.votingSessionOpen, "Voting session should be closed");
    });

    it("should get ongoing elections", async () => {
      await evoting.openVotingSession(1, { from: owner });
      const ongoingElections = await evoting.getOnGoingElections();
      assert.equal(ongoingElections.length, 1, "Should have 1 ongoing election");
      assert.equal(ongoingElections[0].toNumber(), 1, "Ongoing election ID should be 1");
    });

    it("should get completed elections", async () => {
      await evoting.openVotingSession(1, { from: owner });
      await evoting.closeVotingSession(1, { from: owner });
      const completedElections = await evoting.getCompletedElections();
      assert.equal(completedElections.length, 1, "Should have 1 completed election");
      assert.equal(completedElections[0].toNumber(), 1, "Completed election ID should be 1");
    });
  });
});