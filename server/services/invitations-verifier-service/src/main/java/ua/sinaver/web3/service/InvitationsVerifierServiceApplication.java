package ua.sinaver.web3.service;

import java.security.MessageDigest;
import java.util.Collections;
import java.util.List;

import org.apache.commons.lang3.RandomStringUtils;
import org.bouncycastle.jcajce.provider.digest.Keccak;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import ua.sinaver.web3.utils.MerkleTree;
import ua.sinaver.web3.utils.ProofData;

@SpringBootApplication
@CrossOrigin // default - allow all origins
@RestController
public class InvitationsVerifierServiceApplication {

	private static Logger LOGGER = LoggerFactory.getLogger(InvitationsVerifierServiceApplication.class);

	private String hardcodedMerkleTreeRoot;

	public static void main(String[] args) {
		SpringApplication.run(InvitationsVerifierServiceApplication.class, args);
	}

	@PostMapping(value = "/update")
	public void updateRoot(@RequestBody VerifierConfig config) {
		hardcodedMerkleTreeRoot = config.root;
		LOGGER.info("Merle Tree Root was updated to {}", hardcodedMerkleTreeRoot);
	}

	@PostMapping(value = "/verify")
	public ResponseEntity<String> verifyInvitation(@RequestBody InvitationProof invite) {
		MerkleTree merkleTree = new MerkleTree(Collections.emptyList(), (data) -> {
			MessageDigest digest256 = new Keccak.Digest256();
			return digest256.digest(data);
		});
		if (merkleTree.verifyProof(invite.proof, invite.name, hardcodedMerkleTreeRoot)) {
			return ResponseEntity.ok("Welcome to Secret ConsenSys Party 🎉🎉🎉");
		}
		return ResponseEntity.badRequest().body("You're not invited 🚫");
	}

	@PostMapping(value = "/code")
	public String generateCode(@RequestBody String address) {
		String code = RandomStringUtils.random(6, false, true);
		LOGGER.info("Generated Code {} for address {}", code, address);
		return code;
	}

	public record InvitationProof(String name, List<ProofData> proof) {
	}

	public record VerifierConfig(String root) {
	}
}
