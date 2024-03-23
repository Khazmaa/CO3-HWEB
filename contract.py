import smartpy as sp
from smartpy.templates import fa2_lib as fa2


@sp.module
def CO3():
    class SBT(
        main.Admin,  # Admin contract
        main.Nft,  # We want a non-fungible token
        main.MintNft,  # we want to mint nft
        main.BurnNft,  # we want to burn nft after a certain period of time
        main.OnchainviewBalanceOf,  # we want to view the balance of the nft for the API
        main.NoTransfer,  # it's an SBT token, so we don't want to transfer it
    ):
        def __init__(self, admin, metadata, ledger, token_metadata):
            main.OnchainviewBalanceOf.__init__(self)
            main.BurnNft.__init__(self)
            main.MintNft.__init__(self)
            main.Nft.__init__(self, metadata, ledger, token_metadata)
            main.Admin.__init__(self, admin)
            main.Nft.__init__(self, metadata, ledger, token_metadata)
            main.NoTransfer.__init__(self)


@sp.add_test()
def test():
    sc = sp.test_scenario("Nft", [fa2.t, fa2.main, CO3])
    sc.h2("With pre-minted tokens")
    admin = sp.test_account("admin")
    user = sp.test_account("user")
    user2 = sp.test_account("user2")
    NFT = fa2.make_metadata("CO3", "CO3 Certificate", 0)
    SBT = CO3.SBT(admin=admin.address, metadata=sp.big_map(), ledger={0: user.address}, token_metadata=[NFT])
    sc += SBT
    NFT1 = fa2.make_metadata("CO3", "CO3 Certificate", 0)
    SBT.mint([sp.record(to_=user.address, metadata=NFT1)], _sender=admin)
    try:
        SBT.transfer(
            [sp.record(
                from_=user.address,
                txs=[sp.record(to_=user2.address, token_id=0, amount=1)]
            )],
            _sender=user.address,
        )
    except:
        print("Error occured")
    try:
        SBT.transfer(
            [sp.record(
                from_=user.address,
                txs=[sp.record(to_=user2.address, token_id=0, amount=1)]
            )],
            _sender=admin.address,
        )
    except:
        print("Error occured")
