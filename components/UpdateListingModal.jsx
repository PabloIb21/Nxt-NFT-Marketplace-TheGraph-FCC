import { useState } from "react";
import { Modal, Input, useNotification } from "web3uikit";
import { useWeb3Contract } from "react-moralis";
import { ethers} from "ethers";
import nftMarketplaceAbi from "../constants/NftMarketplace.json";

export const UpdateListingModal = ({ nftAddress, tokenId, isVisible, marketplaceAddress, onClose }) => {
  const dispatch = useNotification();

  const [priceToUpdateListingWith, setPriceToUpdateListingWith] = useState("");

  const handleUpdateListingSuccess = async tx => {
    await tx.wait();
    dispatch({
      type: "success",
      message: "listing updated",
      title: "Listing updated - please refresh (and move blocks)",
      position: "topR",
    });
    onClose && onClose();
    setPriceToUpdateListingWith("0");
  }

  const { runContractFunction: updateListing } = useWeb3Contract({
    abi: nftMarketplaceAbi,
    contractAddress: marketplaceAddress,
    functionName: "updateListing",
    params: {
      nftAddress,
      tokenId,
      newPrice: ethers.utils.parseEther(priceToUpdateListingWith || "0"),
    }
  });

  return (
    <Modal
      isVisible={isVisible}
      onCancel={onClose}
      onCloseButtonPressed={onClose}
      onOk={() => {
        updateListing({
          onError: (error) => {
            console.log(error)
          },
          onSuccess: handleUpdateListingSuccess,
        })
      }}
    >
      <Input
        label="Update listing price in L1 Currency (ETH)"
        name="New listing price"
        type="number"
        onChange={e => {
          setPriceToUpdateListingWith(e.target.value);
        }}
      />
    </Modal>
  )
}
