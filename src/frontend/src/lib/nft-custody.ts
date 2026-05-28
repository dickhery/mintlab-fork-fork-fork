import type { Collection, WalletLocation, WalletNFT } from "@/types";

export const WITHDRAW_TO_EXTERNAL_WALLET_LABEL = "Withdraw to external wallet";
export const VAULTED_PURCHASE_NOTICE =
  "Buying this vaulted NFT keeps it in Mintlab custody until you withdraw it.";

export function nftCustodyLabel(location: WalletLocation): string {
  if (location === "Registered") return "Registered external wallet NFT";
  if (location === "Vaulted") return "Vaulted in Mintlab";
  return "Mintlab-created NFT";
}

export function nftCustodyClass(location: WalletLocation): string {
  if (location === "Registered") {
    return "bg-muted/80 text-muted-foreground border-border/60";
  }
  if (location === "Vaulted") {
    return "bg-primary/10 text-primary border-primary/20";
  }
  return "bg-accent/10 text-accent border-accent/20";
}

export function nftCustodyDescription(
  nft: Pick<WalletNFT, "location">,
  collection?: Collection,
): string {
  if (nft.location === "Registered") {
    return "Mintlab is showing a registered wallet record for an external NFT that remains in your wallet on the original collection canister.";
  }

  if (nft.location === "Vaulted") {
    return "The original external NFT is held by the Mintlab canister vault. The in-app owner can withdraw it to an external wallet principal.";
  }

  const collectionName = collection?.name ?? "its Mintlab collection";
  return `This NFT was created by Mintlab and transfers through ${collectionName}.`;
}

export function isVaultedInMintlab(
  nft: Pick<WalletNFT, "location"> | null | undefined,
): boolean {
  return nft?.location === "Vaulted";
}
