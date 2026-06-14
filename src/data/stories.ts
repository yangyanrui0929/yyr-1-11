import type { Story } from '@/types'

export const STORIES: Story[] = [
  {
    id: 's1',
    title: '侠客行·江湖恩怨',
    tags: ['武侠', '热血', '江湖'],
    heat: 70,
    summary: '少年侠客闯荡江湖，遭遇师门血仇，踏上复仇之路',
    branches: [
      {
        id: 's1-b1',
        title: '第一章：深山学艺',
        content: '话说在昆仑深山之中，有一少年名为李云飞，自幼父母双亡，被昆仑派掌门收为弟子...',
        tags: ['武侠', '成长'],
        heatModifier: 5,
      },
      {
        id: 's1-b2',
        title: '第一章：下山遇仇',
        content: '李云飞艺成下山，初入江湖便遇上了当年的仇人，一场恶战在所难免...',
        tags: ['武侠', '热血'],
        heatModifier: 10,
      },
    ],
  },
  {
    id: 's2',
    title: '牡丹亭·儿女情长',
    tags: ['爱情', '才子佳人', '婉约'],
    heat: 55,
    summary: '官家小姐与穷书生的一段凄美爱情传奇',
    branches: [
      {
        id: 's2-b1',
        title: '第一折：游园惊梦',
        content: '杜丽娘春日游园，梦中与一书生相遇于牡丹亭下，醒来后郁郁寡欢...',
        tags: ['爱情', '婉约'],
        heatModifier: 0,
      },
      {
        id: 's2-b2',
        title: '第一折：私会西厢',
        content: '小姐隔墙吟诗，书生闻声而动，两人月下私定终身...',
        tags: ['爱情', '才子佳人'],
        heatModifier: 8,
      },
    ],
  },
  {
    id: 's3',
    title: '三国演义·群雄逐鹿',
    tags: ['历史', '战争', '谋略'],
    heat: 85,
    summary: '东汉末年，天下大乱，群雄并起，逐鹿中原',
    branches: [
      {
        id: 's3-b1',
        title: '第一回：桃园结义',
        content: '话说天下大势，分久必合，合久必分。东汉末年，黄巾起义，刘备、关羽、张飞三人于桃园结义...',
        tags: ['历史', '义气'],
        heatModifier: 12,
      },
      {
        id: 's3-b2',
        title: '第一回：孟德献刀',
        content: '董卓专权，满朝文武敢怒不敢言，曹操挺身而出，借七星宝刀欲行刺董卓...',
        tags: ['历史', '谋略'],
        heatModifier: 10,
      },
    ],
  },
  {
    id: 's4',
    title: '聊斋志异·狐仙传说',
    tags: ['神怪', '灵异', '悬疑'],
    heat: 60,
    summary: '穷书生夜遇狐仙，人狐之间展开一段奇缘',
    branches: [
      {
        id: 's4-b1',
        title: '卷一：书斋夜话',
        content: '书生王生夜读，忽有一绝色女子推门而入，自称姓胡，愿与君共度良宵...',
        tags: ['神怪', '爱情'],
        heatModifier: 6,
      },
      {
        id: 's4-b2',
        title: '卷一：荒山鬼宅',
        content: '赶考书生夜宿荒山古宅，夜半闻女子哭泣声，循声而去...',
        tags: ['神怪', '悬疑'],
        heatModifier: 9,
      },
    ],
  },
  {
    id: 's5',
    title: '官场现形记',
    tags: ['讽刺', '官场', '世情'],
    heat: 50,
    summary: '揭露清朝官场的种种黑暗与荒唐',
    branches: [
      {
        id: 's5-b1',
        title: '第一回：捐官上任',
        content: '富家子弟花钱捐了个知县，走马上任后第一件事就是盘算如何捞回本...',
        tags: ['讽刺', '官场'],
        heatModifier: 4,
      },
      {
        id: 's5-b2',
        title: '第一回：官场应酬',
        content: '新任知府设宴，大小官员纷纷前来送礼，席间丑态百出...',
        tags: ['讽刺', '世情'],
        heatModifier: 7,
      },
    ],
  },
  {
    id: 's6',
    title: '西游记·取经之路',
    tags: ['神怪', '冒险', '励志'],
    heat: 90,
    summary: '唐僧师徒四人西天取经，历经九九八十一难',
    branches: [
      {
        id: 's6-b1',
        title: '第一回：猴王出世',
        content: '东胜神洲傲来国花果山，有一仙石吸收日月精华，产下一石猴...',
        tags: ['神怪', '冒险'],
        heatModifier: 15,
      },
      {
        id: 's6-b2',
        title: '第一回：大闹天宫',
        content: '孙悟空被封弼马温，得知官职微小后大怒，反下天庭，自封齐天大圣...',
        tags: ['神怪', '热血'],
        heatModifier: 18,
      },
    ],
  },
]
