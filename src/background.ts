import { Storage } from "@plasmohq/storage"

import type { Group } from "~type"

class AutoGroup {
  private groups: Group[] = []

  constructor() {
    this.subscribeGroupsConfig()
    this.subscribeTabUpdate()
  }

  async subscribeGroupsConfig() {
    const storage = new Storage()
    this.groups = await storage.get("groups")
    // 注册监听
    storage.watch({
      groups: (change) => {
        this.groups = change.newValue
        this.groupTabs()
      }
    })
  }

  subscribeTabUpdate() {
    chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
      if (changeInfo.url) {
        this.groupTabs()
      }
    })
  }

  async groupTabs() {
    const tabs = await chrome.tabs.query({ currentWindow: true })
    const groupsMap: Record<string, number[]> = tabs.reduce((prev, cur) => {
      const { id } = cur
      const groupTitle = this.findTabGroup(cur)
      // 当前标签页属于哪个分组
      if (groupTitle) {
        if (!prev[groupTitle]) {
          prev[groupTitle] = []
        }
        prev[groupTitle].push(id)
      }
      return prev
    }, {})

    for (const title of Object.keys(groupsMap)) {
      const groupId = await chrome.tabs.group({ tabIds: groupsMap[title] })
      await chrome.tabGroups.update(groupId, {
        title
        // color: "cyan"
      })
    }
  }

  findTabGroup(tab: chrome.tabs.Tab): string | undefined {
    const { url } = tab
    // 遍历分组配置
    for (const group of this.groups) {
      const { title, regExp } = group
      if (new RegExp(regExp).test(url)) {
        return title
      }
    }
  }
}

new AutoGroup()
