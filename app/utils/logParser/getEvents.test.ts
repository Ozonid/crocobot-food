import { describe, it, expect } from 'vitest'
import {
  getAssistsEvent,
  getAttackEvent,
  getBombDefusedEvent,
  getBombPlantedEvent,
  getKillEvent,
  getLeftBuyzoneEvent,
  getPurchaseEvent,
  getThrowEvent,
} from './getEvents'

describe('getEvents', () => {
  describe('getLeftBuyzoneEvent', () => {
    it('parses left buyzone event correctly', () => {
      const line =
        '11/28/2021 - 20:41:32: "b1t<32><STEAM_1:0:143170874><TERRORIST>" left buyzone with [ weapon_knife_m9_bayonet weapon_glock weapon_hegrenade ]'
      const event = getLeftBuyzoneEvent(line)

      expect(event.type).toBe('leftBuyzone')
      expect(event.timestamp).toEqual(new Date('2021-11-28T20:41:32'))
      expect(event.player).toEqual({
        name: 'b1t',
        steamId: 'STEAM_1:0:143170874',
      })
      expect(event.loadout).toEqual(['weapon_knife_m9_bayonet', 'weapon_glock', 'weapon_hegrenade'])
    })
  })

  describe('getPurchaseEvent', () => {
    it('parses purchase event correctly', () => {
      const line =
        '11/28/2021 - 20:41:11: "b1t<13><STEAM_1:0:143170874><TERRORIST>" money change 800-300 = $500 (tracked) (purchase: weapon_p250)'
      const event = getPurchaseEvent(line)

      expect(event.type).toBe('purchase')
      expect(event.timestamp).toEqual(new Date('2021-11-28T20:41:11'))
      expect(event.player).toEqual({
        name: 'b1t',
        steamId: 'STEAM_1:0:143170874',
      })
      expect(event.item).toBe('weapon_p250')
      expect(event.price).toBe(300)
    })
  })

  describe('getThrowEvent', () => {
    it('parses throw event correctly', () => {
      const line =
        '11/28/2021 - 20:41:40: "b1t<32><STEAM_1:0:143170874><TERRORIST>" threw hegrenade [252 -1340 -414] (1000 damage)'
      const event = getThrowEvent(line)

      expect(event.type).toBe('throw')
      expect(event.timestamp).toEqual(new Date('2021-11-28T20:41:40'))
      expect(event.player).toEqual({
        name: 'b1t',
        steamId: 'STEAM_1:0:143170874',
      })
      expect(event.item).toBe('hegrenade')
    })
  })

  describe('getAttackEvent', () => {
    it('parses attack event correctly', () => {
      const line =
        '11/28/2021 - 20:41:48: "Boombl4<29><STEAM_1:0:92970669><TERRORIST>" [223 -1551 -35] attacked "ZywOo<26><STEAM_1:1:76700232><CT>" [1183 -1948 -416] with "glock" (damage "9") (damage_armor "5") (health "91") (armor "94") (hitgroup "chest")'
      const event = getAttackEvent(line)

      expect(event.type).toBe('attack')
      expect(event.timestamp).toEqual(new Date('2021-11-28T20:41:48'))
      expect(event.player).toEqual({
        name: 'Boombl4',
        steamId: 'STEAM_1:0:92970669',
      })
      expect(event.target).toEqual({
        name: 'ZywOo',
        steamId: 'STEAM_1:1:76700232',
      })
      expect(event.item).toBe('glock')
      expect(event.damage).toBe(9)
      expect(event.damageArmor).toBe(5)
      expect(event.hitgroup).toBe('chest')
    })
  })

  describe('getKillEvent', () => {
    it('parses kill event correctly', () => {
      const line =
        '11/28/2021 - 20:41:49: "ZywOo<26><STEAM_1:1:76700232><CT>" [1186 -1862 -416] killed "s1mple<30><STEAM_1:1:36968273><TERRORIST>" [181 -2121 -370] with "usp_silencer" (headshot) '
      const event = getKillEvent(line)

      expect(event.type).toBe('kill')
      expect(event.timestamp).toEqual(new Date('2021-11-28T20:41:49'))
      expect(event.player).toEqual({
        name: 'ZywOo',
        steamId: 'STEAM_1:1:76700232',
      })
      expect(event.target).toEqual({
        name: 's1mple',
        steamId: 'STEAM_1:1:36968273',
      })
      expect(event.item).toBe('usp_silencer')
      expect(event.isHeadShot).toBe(true)
    })
  })

  describe('getAssistsEvent', () => {
    it('parses assists event correctly', () => {
      const line =
        '11/28/2021 - 20:45:07: "apEX<25><STEAM_1:1:14739219><CT>" assisted killing "b1t<32><STEAM_1:0:143170874><TERRORIST>" '
      const event = getAssistsEvent(line)

      expect(event.type).toBe('assist')
      expect(event.timestamp).toEqual(new Date('2021-11-28T20:45:07'))
      expect(event.player).toEqual({
        name: 'apEX',
        steamId: 'STEAM_1:1:14739219',
      })
      expect(event.target).toEqual({
        name: 'b1t',
        steamId: 'STEAM_1:0:143170874',
      })
    })
  })

  describe('getBombPlantedEvent', () => {
    it('parses bomb planted event correctly', () => {
      const line =
        '11/28/2021 - 20:45:04: "b1t<32><STEAM_1:0:143170874><TERRORIST>" triggered "Planted_The_Bomb" at bombsite B '
      const event = getBombPlantedEvent(line)

      expect(event.type).toBe('bombPlanted')
      expect(event.timestamp).toEqual(new Date('2021-11-28T20:45:04'))
      expect(event.player).toEqual({
        name: 'b1t',
        steamId: 'STEAM_1:0:143170874',
      })
      expect(event.bombsite).toBe('B')
    })
  })

  describe('getBombDefusedEvent', () => {
    it('parses bomb defused event correctly', () => {
      const line =
        '11/28/2021 - 20:45:36: "Kyojin<34><STEAM_1:1:22851120><CT>" triggered "Defused_The_Bomb"'
      const event = getBombDefusedEvent(line)

      expect(event.type).toBe('bombDefused')
      expect(event.timestamp).toEqual(new Date('2021-11-28T20:45:36'))
      expect(event.player).toEqual({
        name: 'Kyojin',
        steamId: 'STEAM_1:1:22851120',
      })
    })
  })
})
