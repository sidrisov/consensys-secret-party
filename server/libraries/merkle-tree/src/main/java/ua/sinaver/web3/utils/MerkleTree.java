package ua.sinaver.web3.utils;

import java.util.ArrayList;
import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.bouncycastle.util.encoders.Hex;
import com.google.common.primitives.Bytes;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class MerkleTree {

    final static Logger LOGGER = LogManager.getLogger(MerkleTree.class);
    final static Gson GSON = new GsonBuilder().setPrettyPrinting().create();

    private List<byte[]> _leaves;
    private MerkleTreeHasher _hasher;

    public MerkleTree(List<String> leaves, MerkleTreeHasher hasher) {
        this._hasher = hasher;
        this._leaves = leaves.stream().map(leaf -> this._hasher.hash(leaf.getBytes())).toList();
    }

    public String getRoot() {
        final String merkleTreeRoot = Hex.toHexString(getRoot(_leaves));
        if (LOGGER.isDebugEnabled()) {
            LOGGER.debug("Calculated Merkle Tree Root for leaves {} - {}",
                    GSON.toJson(this._leaves.stream().map(leaf -> Hex.toHexString(leaf)).toList()), merkleTreeRoot);
        }
        return merkleTreeRoot;
    }

    public List<ProofData> getProof(int index) {
        final List<ProofData> proof = getProof(index, this._leaves, new ArrayList<>());
        if (LOGGER.isDebugEnabled()) {
            LOGGER.debug("Calculated Proof for leaf `{}` - {}",
                    Hex.toHexString(this._leaves.get(index)), GSON.toJson(proof));
        }
        return proof;
    }

    private List<ProofData> getProof(int index, List<byte[]> leaves, List<ProofData> proof) {
        /*
         * if there is only one leaf in the tree, we reached the top level,
         * proof generation is complete
         */
        if (leaves.size() == 1) {
            return proof;
        }

        List<byte[]> nextLayer = new ArrayList<>();

        /*
         * Traverse through leaves,
         * if pair is available
         * concatenate & hash pair
         * otherwise pass the leaf as is
         */
        for (int i = 0; i < leaves.size(); i += 2) {
            byte[] left = null;
            byte[] right = null;
            if (i + 1 < leaves.size()) {
                left = leaves.get(i);
                right = leaves.get(i + 1);
                nextLayer.add(this._hasher.hash(Bytes.concat(left, right)));
            } else {
                left = leaves.get(i);
                nextLayer.add(left);
            }

            /*
             * if we are at the index, generate proof for current layer
             */
            if (i == index || i == index - 1) {
                /*
                 * determine the direction of element and its hash data in the pair
                 * relevant to index element
                 */
                final boolean isLeft = (index % 2) != 0;

                if (isLeft) {
                    proof.add(new ProofData(Hex.toHexString(left), isLeft));
                } else if (right != null) {
                    /*
                     * if there is no element on the right, no need to include the proof
                     */
                    proof.add(new ProofData(Hex.toHexString(right), isLeft));

                }
            }
        }

        return getProof(index / 2, nextLayer, proof);
    }

    public boolean verifyProof(List<ProofData> proof, String leaf, String root) {
        byte[] leafData = this._hasher.hash(leaf.getBytes());
        /*
         * Traverse through all proofs and concatanate with previous hash value
         */
        for (int i = 0; i < proof.size(); i++) {
            /*
             * Concatanation order depends on the proof info
             */
            if (proof.get(i).left()) {
                leafData = this._hasher.hash(Bytes.concat(Hex.decode(proof.get(i).data()), leafData));
            } else {
                leafData = this._hasher.hash(Bytes.concat(leafData, Hex.decode(proof.get(i).data())));
            }
        }

        if (LOGGER.isDebugEnabled()) {
            LOGGER.debug("Calculated Merkle Tree Root Hash with proof {} and leaf `{}` - {}",
                    GSON.toJson(proof),
                    leaf,
                    Hex.toHexString(leafData));
        }

        return Hex.toHexString(leafData).equals(root);
    }

    private byte[] getRoot(List<byte[]> leaves) {
        /*
         * if there is only one leaf in the tree, we reached the top level,
         * which is Merkle Tree Root
         */
        if (leaves.size() == 1) {
            return leaves.get(0);
        }

        List<byte[]> nextLayer = new ArrayList<>();

        /*
         * Traverse through leaves,
         * if pair is available
         * concatenate & hash pair
         * otherwise pass the leaf as is
         */
        for (int i = 0; i < leaves.size(); i += 2) {
            if (i + 1 < leaves.size()) {
                nextLayer.add(this._hasher.hash(Bytes.concat(leaves.get(i), leaves.get(i + 1))));
            } else {
                nextLayer.add(leaves.get(i));
            }
        }

        // pass the new layer in recursion to calculate next layer
        return getRoot(nextLayer);
    }
}
