import smartpy as sp
from smartpy.templates import fa2_lib as fa2


@sp.module
def CO3():
    class SBT(
        main.Admin,  # Admin contract
        main.Nft,  # We want a non-fungible token
        main.ChangeMetadata,  # we will use the metadata to track the nbr of CO3 point
        main.MintNft,  # we want to mint nft
        main.BurnNft,  # we want to burn nft after a certain period of time
        main.OffchainviewTokenMetadata,  # so we can get metadata from our frontend
        main.NoTransfer,  # it's an SBT token, so we don't want to transfer it
    ):
        def __init__(self, metadata, ledger, token_metadata):
            main.OffchainviewTokenMetadata.__init__(self)
            main.BurnNft.__init__(self)
            main.MintNft.__init__(self)
            main.ChangeMetadata.__init__(self)
            main.Nft.__init__(self, metadata, ledger, token_metadata)
            main.NoTransfer.__init__(self)
            main.Admin.__init__(self, sp.address('tz1UM4Pb6B7h74nrgGWCAyGGrQwJ9BhrPzrE'))

        @sp.entrypoint
        def set_token_metadata(self, token_id, token_metadata):
            assert self.is_administrator_(), "FA2_NOT_ADMIN"
            self.data.token_metadata[token_id] = token_metadata


def bytes_of_string(s):
    return sp.bytes("0x" + s.encode('utf-8').hex())


@sp.add_test()
def test():
    admin_address = sp.address('tz1UM4Pb6B7h74nrgGWCAyGGrQwJ9BhrPzrE')
    sc = sp.test_scenario("Nft", [fa2.t, fa2.main, CO3])
    SBT = CO3.SBT(metadata=sp.big_map(), ledger={}, token_metadata=[])
    sc += SBT
