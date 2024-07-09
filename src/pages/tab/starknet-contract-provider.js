import { useAccount, useBalance, useContractRead, useContractWrite ,useNetwork} from "@starknet-react/core";

export default function useAllowanceRead(abi,contractAddress,owner, spender) {
    const { data, isError, isLoading, error } = useContractRead({
      functionName: "allowance",
      args: [owner, spender],
      abi,
      address: contractAddress,
      watch: true,
    });
  
    return { data, isError, isLoading, error };


    
  }


