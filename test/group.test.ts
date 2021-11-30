// Copyright (c) 2021 Cloudflare, Inc. and contributors.
// Copyright (c) 2021 Cloudflare, Inc.
// Licensed under the BSD-3-Clause license found in the LICENSE file or
// at https://opensource.org/licenses/BSD-3-Clause

import { Group, GroupID } from '../src/index.js'

describe.each([GroupID.P256, GroupID.P384, GroupID.P521])('group', (id: GroupID) => {
    const gg = new Group(id),
        G = gg.generator(),
        order = gg.order()

    describe(`${gg.id}`, () => {
        it('serdeElement', async () => {
            const P = gg.mulBase(await gg.randomScalar())

            for (const compress of [true, false]) {
                const serP = gg.serialize(P, compress),
                    Q = gg.deserialize(serP)
                expect(gg.equal(P, Q)).toBe(true)
            }
        })

        it('serdeElementZero', () => {
            const Z = Group.mul(order, G),
                serZ = gg.serialize(Z),
                Z1 = gg.deserialize(serZ)
            expect(gg.equal(Z, Z1)).toBe(true)
        })

        it('serdeScalar', () => {
            const k = order.sub(1).mod(order),
                serK = gg.serializeScalar(k),
                k1 = gg.deserializeScalar(serK)
            expect(k).toStrictEqual(k1)
        })

        it('serdeScalarZero', () => {
            const z = order.sub(order).mod(order),
                serZ = gg.serializeScalar(z),
                z1 = gg.deserializeScalar(serZ)
            expect(z).toStrictEqual(z1)
        })
    })
})
