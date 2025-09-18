export class XionManager {
    private signingClient: any;
    private queryClient: any;
    private address: string;
    private contractAddress: string;

    constructor(signingClient: any, queryClient: any, address: string, contractAddress: string) {
        this.signingClient = signingClient;
        this.queryClient = queryClient;
        this.address = address;
        this.contractAddress = contractAddress;
    }

    async storeDocument(collection: string, documentId: string, data: any) {
        return this.executeSet(collection, documentId, data, `Store ${collection} doc`);
    }

    async updateDocument(collection: string, documentId: string, data: any) {
        return this.executeSet(collection, documentId, data, `Update ${collection} doc`);
    }

    private async executeSet(collection: string, documentId: string, data: any, memo: string) {
        if (!this.signingClient) throw new Error('Signing client not available');

        try {
            const result = await this.signingClient.execute(
                this.address,
                this.contractAddress,
                {
                    Set: {
                        collection,
                        document: documentId,
                        data: JSON.stringify(data),
                    },
                },
                'auto',
                memo,
            );

            return { success: true, transactionHash: result.transactionHash, error: null };
        } catch (error) {
            return {
                success: false,
                transactionHash: null,
                error: error instanceof Error ? error.message : 'Set failed',
            };
        }
    }

    async queryDocuments(collection: string, owner?: string) {
        if (!this.queryClient) throw new Error('Query client not available');

        try {
            const response = await this.queryClient.queryContractSmart(this.contractAddress, {
                UserDocuments: {
                    owner: owner || this.address,
                    collection,
                },
            });

            return { success: true, documents: response?.documents || [], error: null };
        } catch (error) {
            return { success: false, documents: [], error: error instanceof Error ? error.message : 'Query failed' };
        }
    }
}
