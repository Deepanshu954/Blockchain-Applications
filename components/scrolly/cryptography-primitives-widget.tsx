"use client";

import React from "react"

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Hash,
  GitBranch,
  KeyRound,
  ArrowRight,
  RefreshCw,
  Plus,
  Trash2,
  Check,
  X,
  Fingerprint,
  ShieldCheck,
  AlertCircle,
  Lock,
} from "lucide-react";

// Simple SHA-256 implementation for browser
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

// Simplified hash for display (shorter)
async function shortHash(message: string): Promise<string> {
  const full = await sha256(message);
  return full.substring(0, 16);
}

// ============================================
// HASHING TAB COMPONENT
// ============================================

function HashingTab() {
  const [input, setInput] = useState("Hello, Blockchain!");
  const [hash, setHash] = useState("");
  const [prevInput, setPrevInput] = useState("");
  const [prevHash, setPrevHash] = useState("");
  const [isComparing, setIsComparing] = useState(false);

  useEffect(() => {
    sha256(input).then(setHash);
  }, [input]);

  const handleCompare = async () => {
    setPrevInput(input);
    setPrevHash(hash);
    setIsComparing(true);
  };

  const handleReset = () => {
    setIsComparing(false);
    setPrevInput("");
    setPrevHash("");
  };

  // Calculate how many characters changed in the hash
  const changedChars = isComparing
    ? hash.split("").filter((char, i) => char !== prevHash[i]).length
    : 0;

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-charcoal">
          Input Message
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-4 bg-warm-gray border-2 border-charcoal font-mono text-sm resize-none h-24 focus:outline-none focus:border-primary transition-colors"
          placeholder="Type any message..."
        />
      </div>

      {/* Hash Output */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-semibold text-charcoal">
            SHA-256 Hash Output
          </label>
          <span className="text-xs font-mono text-muted-foreground">
            256 bits / 64 hex characters
          </span>
        </div>
        <div className="p-4 bg-charcoal border-2 border-charcoal overflow-x-auto">
          <code className="font-mono text-sm break-all leading-relaxed">
            {isComparing ? (
              hash.split("").map((char, i) => (
                <span
                  key={i}
                  className={cn(
                    "transition-all duration-300",
                    char !== prevHash[i] ? "text-yellow-400 font-bold" : "text-green-400"
                  )}
                >
                  {char}
                </span>
              ))
            ) : (
              <span className="text-green-400">{hash}</span>
            )}
          </code>
        </div>
      </div>

      {/* Comparison Section */}
      {!isComparing ? (
        <button
          onClick={handleCompare}
          className="w-full p-3 bg-primary text-white font-semibold border-2 border-charcoal shadow-[3px_3px_0_#1A1A2E] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0_#1A1A2E] transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Fingerprint className="w-4 h-4" />
          Lock Current Hash for Comparison
        </button>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-warm-gray border-2 border-charcoal">
            <div className="text-xs font-mono text-muted-foreground mb-2">
              Previous Input:
            </div>
            <div className="text-sm font-mono text-charcoal truncate">
              &quot;{prevInput}&quot;
            </div>
            <div className="text-xs font-mono text-muted-foreground mt-3 mb-2">
              Previous Hash:
            </div>
            <div className="text-xs font-mono text-muted-foreground break-all">
              {prevHash}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-card border-2 border-charcoal text-center">
              <div className="text-3xl font-bold text-primary mb-1">
                {changedChars}
              </div>
              <div className="text-xs text-muted-foreground">
                Characters Changed
              </div>
            </div>
            <div className="p-4 bg-card border-2 border-charcoal text-center">
              <div className="text-3xl font-bold text-primary mb-1">
                {Math.round((changedChars / 64) * 100)}%
              </div>
              <div className="text-xs text-muted-foreground">
                Hash Difference
              </div>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="w-full p-3 bg-warm-gray text-charcoal font-semibold border-2 border-charcoal shadow-[3px_3px_0_#1A1A2E] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0_#1A1A2E] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Reset Comparison
          </button>
        </div>
      )}

      {/* Educational Info */}
      <div className="p-4 border-l-4 border-primary bg-primary/5">
        <h5 className="font-semibold text-charcoal mb-2">Key Properties</h5>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
            <span><strong>Deterministic:</strong> Same input always produces the same hash</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
            <span><strong>Avalanche Effect:</strong> Tiny input changes cause ~50% hash change</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
            <span><strong>One-way:</strong> Computationally infeasible to reverse</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

// ============================================
// MERKLE TREE TAB COMPONENT
// ============================================

interface TreeNode {
  hash: string;
  label: string;
  children?: [TreeNode, TreeNode];
}

function MerkleTreeTab() {
  const [transactions, setTransactions] = useState<string[]>([
    "TX: Alice → Bob: 10 BTC",
    "TX: Bob → Carol: 5 BTC",
    "TX: Dave → Eve: 3 BTC",
    "TX: Eve → Alice: 2 BTC",
  ]);
  const [tree, setTree] = useState<TreeNode | null>(null);
  const [newTx, setNewTx] = useState("");
  const [highlightedPath, setHighlightedPath] = useState<string[]>([]);

  // Build Merkle tree
  const buildTree = useCallback(async (txs: string[]): Promise<TreeNode | null> => {
    if (txs.length === 0) return null;

    // Pad to power of 2
    let leaves = [...txs];
    while (leaves.length > 1 && (leaves.length & (leaves.length - 1)) !== 0) {
      leaves.push(leaves[leaves.length - 1]);
    }

    // Create leaf nodes
    let nodes: TreeNode[] = await Promise.all(
      leaves.map(async (tx, i) => ({
        hash: await shortHash(tx),
        label: `L${i}`,
      }))
    );

    // Build tree bottom-up
    let level = 0;
    while (nodes.length > 1) {
      const newNodes: TreeNode[] = [];
      for (let i = 0; i < nodes.length; i += 2) {
        const left = nodes[i];
        const right = nodes[i + 1] || nodes[i];
        const combinedHash = await shortHash(left.hash + right.hash);
        newNodes.push({
          hash: combinedHash,
          label: `N${level}-${i / 2}`,
          children: [left, right],
        });
      }
      nodes = newNodes;
      level++;
    }

    return nodes[0];
  }, []);

  useEffect(() => {
    buildTree(transactions).then(setTree);
  }, [transactions, buildTree]);

  const addTransaction = () => {
    if (newTx.trim()) {
      setTransactions([...transactions, newTx.trim()]);
      setNewTx("");
    }
  };

  const removeTransaction = (index: number) => {
    if (transactions.length > 2) {
      setTransactions(transactions.filter((_, i) => i !== index));
    }
  };

  // Render a tree node recursively
  const renderNode = (node: TreeNode, depth: number = 0, isRoot: boolean = true): React.ReactNode => {
    const isHighlighted = highlightedPath.includes(node.hash);

    return (
      <div className="flex flex-col items-center" key={node.label}>
        {/* Node */}
        <div
          className={cn(
            "px-3 py-2 border-2 font-mono text-xs transition-all cursor-pointer",
            isRoot
              ? "bg-primary text-white border-charcoal shadow-[3px_3px_0_#1A1A2E]"
              : node.children
                ? "bg-royal-blue-light text-white border-charcoal"
                : "bg-warm-gray text-charcoal border-charcoal",
            isHighlighted && "ring-2 ring-yellow-400 ring-offset-2"
          )}
          onMouseEnter={() => {
            // Highlight path to root
            const path: string[] = [];
            const findPath = (n: TreeNode, target: string): boolean => {
              path.push(n.hash);
              if (n.hash === target) return true;
              if (n.children) {
                if (findPath(n.children[0], target) || findPath(n.children[1], target)) {
                  return true;
                }
              }
              path.pop();
              return false;
            };
            if (tree) findPath(tree, node.hash);
            setHighlightedPath(path);
          }}
          onMouseLeave={() => setHighlightedPath([])}
        >
          {node.hash.substring(0, 8)}...
        </div>

        {/* Children */}
        {node.children && (
          <>
            {/* Connecting lines */}
            <div className="flex items-center h-6">
              <div className="w-px h-full bg-charcoal" />
            </div>
            <div className="flex gap-4 relative">
              {/* Horizontal connector */}
              <div className="absolute top-0 left-1/4 right-1/4 h-px bg-charcoal" />
              <div className="flex gap-8">
                {node.children.map((child, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-px h-4 bg-charcoal" />
                    {renderNode(child, depth + 1, false)}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Transaction List */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-charcoal">
          Transaction Blocks ({transactions.length})
        </label>
        <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
          {transactions.map((tx, i) => (
            <div
              key={i}
              className="flex items-center gap-2 p-2 bg-warm-gray border border-charcoal text-sm"
            >
              <span className="w-6 h-6 bg-primary text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                {i + 1}
              </span>
              <span className="font-mono text-xs flex-1 truncate">{tx}</span>
              <button
                onClick={() => removeTransaction(i)}
                disabled={transactions.length <= 2}
                className={cn(
                  "p-1 transition-colors cursor-pointer",
                  transactions.length <= 2
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-red-500 hover:bg-red-50"
                )}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Transaction */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newTx}
            onChange={(e) => setNewTx(e.target.value)}
            placeholder="TX: Sender → Receiver: Amount"
            className="flex-1 p-2 bg-white border-2 border-charcoal font-mono text-xs focus:outline-none focus:border-primary"
            onKeyDown={(e) => e.key === "Enter" && addTransaction()}
          />
          <button
            onClick={addTransaction}
            className="px-4 bg-primary text-white border-2 border-charcoal shadow-[2px_2px_0_#1A1A2E] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0_#1A1A2E] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tree Visualization */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-semibold text-charcoal">
            Merkle Tree Structure
          </label>
          <span className="text-xs text-muted-foreground">
            Hover to trace verification path
          </span>
        </div>
        <div className="p-6 bg-card border-2 border-charcoal overflow-x-auto">
          <div className="flex justify-center min-w-fit">
            {tree ? renderNode(tree) : (
              <div className="text-muted-foreground text-sm">
                Add transactions to build tree
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Root Hash */}
      {tree && (
        <div className="p-4 bg-charcoal text-white border-2 border-charcoal">
          <div className="text-xs text-gray-400 mb-1">Merkle Root Hash</div>
          <code className="font-mono text-green-400 text-sm">{tree.hash}</code>
        </div>
      )}

      {/* Educational Info */}
      <div className="p-4 border-l-4 border-primary bg-primary/5">
        <h5 className="font-semibold text-charcoal mb-2">How It Works</h5>
        <p className="text-sm text-muted-foreground">
          Each transaction is hashed individually (leaves). Pairs of hashes are combined and hashed again, building upward until a single root hash remains. Changing any transaction cascades changes up to the root, enabling efficient verification with O(log n) proofs.
        </p>
      </div>
    </div>
  );
}

// ============================================
// DIGITAL SIGNATURES TAB COMPONENT
// ============================================

function DigitalSignaturesTab() {
  const [message, setMessage] = useState("I authorize the transfer of 5 BTC to Bob");
  const [privateKey] = useState(() =>
    Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join("")
  );
  const [publicKey, setPublicKey] = useState("");
  const [signature, setSignature] = useState("");
  const [verifyMessage, setVerifyMessage] = useState("");
  const [verifySignature, setVerifySignature] = useState("");
  const [verificationResult, setVerificationResult] = useState<"valid" | "invalid" | null>(null);
  const [isSigning, setIsSigning] = useState(false);

  // Generate "public key" from private key
  useEffect(() => {
    sha256(privateKey).then((hash) => setPublicKey(hash.substring(0, 40)));
  }, [privateKey]);

  // Sign message
  const signMessage = async () => {
    setIsSigning(true);
    await new Promise((r) => setTimeout(r, 500)); // Simulate processing
    const sig = await sha256(privateKey + message);
    setSignature(sig);
    setVerifyMessage(message);
    setVerifySignature(sig);
    setIsSigning(false);
  };

  // Verify signature
  const verifySignatureFunc = async () => {
    const expectedSig = await sha256(privateKey + verifyMessage);
    setVerificationResult(expectedSig === verifySignature ? "valid" : "invalid");
  };

  return (
    <div className="space-y-6">
      {/* Key Pair Display */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 bg-red-50 border-2 border-red-300">
          <div className="flex items-center gap-2 mb-2">
            <KeyRound className="w-4 h-4 text-red-500" />
            <span className="text-xs font-semibold text-red-700">PRIVATE KEY (Secret)</span>
          </div>
          <code className="font-mono text-xs text-red-600 break-all">
            {privateKey.substring(0, 16)}...{privateKey.substring(privateKey.length - 8)}
          </code>
        </div>
        <div className="p-4 bg-green-50 border-2 border-green-300">
          <div className="flex items-center gap-2 mb-2">
            <KeyRound className="w-4 h-4 text-green-500" />
            <span className="text-xs font-semibold text-green-700">PUBLIC KEY (Shared)</span>
          </div>
          <code className="font-mono text-xs text-green-600 break-all">
            {publicKey.substring(0, 16)}...{publicKey.substring(publicKey.length - 8)}
          </code>
        </div>
      </div>

      {/* Signing Section */}
      <div className="p-4 bg-card border-2 border-charcoal">
        <h5 className="font-semibold text-charcoal mb-4 flex items-center gap-2">
          <span className="w-6 h-6 bg-primary text-white text-xs font-bold flex items-center justify-center">1</span>
          Sign a Message
        </h5>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-3 bg-warm-gray border-2 border-charcoal font-mono text-sm resize-none h-20 focus:outline-none focus:border-primary mb-3"
          placeholder="Enter message to sign..."
        />
        <button
          onClick={signMessage}
          disabled={isSigning || !message}
          className={cn(
            "w-full p-3 font-semibold border-2 border-charcoal shadow-[3px_3px_0_#1A1A2E] transition-all flex items-center justify-center gap-2 cursor-pointer",
            isSigning || !message
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-primary text-white hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0_#1A1A2E]"
          )}
        >
          {isSigning ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Signing...
            </>
          ) : (
            <>
              <Fingerprint className="w-4 h-4" />
              Sign with Private Key
            </>
          )}
        </button>

        {signature && (
          <div className="mt-4 p-3 bg-charcoal">
            <div className="text-xs text-gray-400 mb-1">Digital Signature</div>
            <code className="font-mono text-xs text-yellow-400 break-all">{signature}</code>
          </div>
        )}
      </div>

      {/* Verification Section */}
      <div className="p-4 bg-card border-2 border-charcoal">
        <h5 className="font-semibold text-charcoal mb-4 flex items-center gap-2">
          <span className="w-6 h-6 bg-primary text-white text-xs font-bold flex items-center justify-center">2</span>
          Verify Signature
        </h5>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">
              Message to Verify
            </label>
            <textarea
              value={verifyMessage}
              onChange={(e) => {
                setVerifyMessage(e.target.value);
                setVerificationResult(null);
              }}
              className="w-full p-2 bg-warm-gray border-2 border-charcoal font-mono text-xs resize-none h-16 focus:outline-none focus:border-primary"
              placeholder="Paste message..."
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">
              Signature to Verify
            </label>
            <input
              type="text"
              value={verifySignature}
              onChange={(e) => {
                setVerifySignature(e.target.value);
                setVerificationResult(null);
              }}
              className="w-full p-2 bg-warm-gray border-2 border-charcoal font-mono text-xs focus:outline-none focus:border-primary"
              placeholder="Paste signature..."
            />
          </div>
          <button
            onClick={verifySignatureFunc}
            disabled={!verifyMessage || !verifySignature}
            className={cn(
              "w-full p-3 font-semibold border-2 border-charcoal shadow-[3px_3px_0_#1A1A2E] transition-all flex items-center justify-center gap-2 cursor-pointer",
              !verifyMessage || !verifySignature
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-charcoal text-white hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0_#1A1A2E]"
            )}
          >
            <ShieldCheck className="w-4 h-4" />
            Verify with Public Key
          </button>
        </div>

        {/* Verification Result */}
        {verificationResult && (
          <div
            className={cn(
              "mt-4 p-4 border-2 flex items-center gap-3",
              verificationResult === "valid"
                ? "bg-green-50 border-green-500"
                : "bg-red-50 border-red-500"
            )}
          >
            {verificationResult === "valid" ? (
              <>
                <div className="w-10 h-10 bg-green-500 text-white flex items-center justify-center flex-shrink-0">
                  <Check className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-semibold text-green-700">Signature Valid</div>
                  <div className="text-sm text-green-600">
                    The message was signed by the owner of the public key
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="w-10 h-10 bg-red-500 text-white flex items-center justify-center flex-shrink-0">
                  <X className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-semibold text-red-700">Signature Invalid</div>
                  <div className="text-sm text-red-600">
                    The message or signature has been tampered with
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Educational Info */}
      <div className="p-4 border-l-4 border-primary bg-primary/5">
        <h5 className="font-semibold text-charcoal mb-2">Security Guarantees</h5>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
            <span><strong>Authenticity:</strong> Only the private key holder can create valid signatures</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
            <span><strong>Integrity:</strong> Any change to the message invalidates the signature</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
            <span><strong>Non-repudiation:</strong> Signer cannot deny creating the signature</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function CryptographyPrimitivesWidget() {
  return (
    <div className="brutalist-card p-0 overflow-hidden">
      {/* Header */}
      <div className="bg-primary text-white p-4 border-b-2 border-charcoal">
        <h3 className="text-lg font-bold flex items-center gap-3">
          <Lock className="w-5 h-5" />
          Cryptographic Primitives
        </h3>
        <p className="text-sm text-white/80 mt-1">
          Interactive exploration of blockchain security foundations
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="hashing" className="w-full">
        <TabsList className="w-full rounded-none border-b-2 border-charcoal bg-warm-gray p-0 h-auto">
          <TabsTrigger
            value="hashing"
            className="flex-1 rounded-none border-r border-charcoal/20 py-3 data-[state=active]:bg-white data-[state=active]:shadow-none cursor-pointer"
          >
            <Hash className="w-4 h-4 mr-2" />
            Hashing
          </TabsTrigger>
          <TabsTrigger
            value="merkle"
            className="flex-1 rounded-none border-r border-charcoal/20 py-3 data-[state=active]:bg-white data-[state=active]:shadow-none cursor-pointer"
          >
            <GitBranch className="w-4 h-4 mr-2" />
            Merkle Trees
          </TabsTrigger>
          <TabsTrigger
            value="signatures"
            className="flex-1 rounded-none py-3 data-[state=active]:bg-white data-[state=active]:shadow-none cursor-pointer"
          >
            <KeyRound className="w-4 h-4 mr-2" />
            Digital Signatures
          </TabsTrigger>
        </TabsList>

        <div className="p-6 bg-card">
          <TabsContent value="hashing" className="mt-0">
            <HashingTab />
          </TabsContent>
          <TabsContent value="merkle" className="mt-0">
            <MerkleTreeTab />
          </TabsContent>
          <TabsContent value="signatures" className="mt-0">
            <DigitalSignaturesTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
