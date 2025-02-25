class Calculations {
  // Returns base experience
  static experienceBase (level) {
    return this.experienceNextLevel(level) / this.experienceMultiplier(level);
  }

  // Returns reduced base experience
  static experienceReducedBase (level) {
    return Math.max(1, Math.exp(30090.33 / 5000000 * (level - 99)));
  }

  // Returns experience multiplier
  static experienceMultiplier (level) {
    return 0.75 * Math.max(0, level + 1);
  }

  // Returns curve of experience needed for next level
  static experienceNextLevelCurve () {
    return this.#EXPERIENCE_NEXT;
  }

  // Returns experience needed for specific level
  static experienceNextLevel (level) {
    return this.#EXPERIENCE_NEXT[_clamp(level, 0, 393)];
  }

  // Returns curve of total experience needed for next level
  static experienceTotalLevelCurve () {
    return this.#EXPERIENCE_TOTAL;
  }

  // Returns total experience needed for specific level
  static experienceTotalLevel (level) {
    return this.#EXPERIENCE_TOTAL[_clamp(level, 0, 393)] + Math.max(0, level - 393) * 1500000000;
  }

  // Returns minimum experience reward from quest segment
  static experienceQuestMin (level, book, guildInstructor, runes) {
    return (1 + _clamp(guildInstructor, 0, 200) / 100 + _clamp(book, 0, 100) / 100) * this.experienceBase(level) / 11 / this.experienceReducedBase(level) * (1 + _clamp(runes, 0, 10) / 100);
  }

  // Returns maximum experience reward from quest segment
  static experienceQuestMax (level, book, guildInstructor, runes) {
    return this.experienceQuestMin(level, book, guildInstructor, runes) * 5;
  }

  // Returns experience bonus from stars for expedition
  static expeditionStarBonus(stars) {
    switch (stars) {
      case 0:
        return 0;
      case 1:
        return 0.1;
      case 2:
        return 0.2;
      case 3:
        return 0.35;
    }
  }

  // Returns mount bonus for expedition
  static expeditionMountBonus(mount) {
    switch (mount) {
      case 0:
        return 0;
      case 1:
        return 0.11
      case 2:
        return 0.25
      case 3:
        return 0.42
      case 4:
        return 1
    }
  }

  // Returns experience reward for 25 thirst 
  static experienceExpedition (level, book, guildInstructor, runes, scroll, stars, mount) {
    let base = (1 + _clamp(guildInstructor, 0, 200) / 100 + _clamp(book, 0, 100) / 100 + _clamp(runes, 0, 10) / 100) * this.experienceBase(level) / 11 / this.experienceReducedBase(level) * 15.18;
    if (scroll)
      base *= 1.1;
    return base * (1 + this.expeditionStarBonus(stars)) * (1 + this.expeditionMountBonus(mount));
  }

  // Returns experience from secret mission of the day
  static experienceSecretMission (level, hydra) {
    return this.experienceBase(level) * (1 + 0.25 * _clamp(hydra, 0, 20));
  }

  // Returns experience from arena fight
  static experienceArena (level) {
    return this.experienceBase(level) / 10;
  }

  // Returns experience from multiple wheel book
  static experienceWheelBooks (level) {
    return Math.trunc(this.experienceBase(level) / Calculations.experienceReducedBase(level));
  }

  // Returns experience from wheel book
  static experienceWheelBook (level) {
    return Math.trunc(this.experienceWheelBooks(level) / 2);
  }

  // Returns experience from calendar with books [0, 1, 2]
  static experienceCalendar (level, book) {
    return Math.ceil(this.experienceNextLevel(level) / (5 * (3 - _clamp(book, 0, 2))));
  }

  // Returns experience reward for defeating pet dungeon enemy
  static experiencePetHabitat (level) {
    return 6 * this.experienceMultiplier(level) * this.experienceBase(level) / this.experienceReducedBase(level) / 30;
  }

  // Returns experience reward for defeating twister enemy
  static experienceTwisterEnemy (level) {
      return Math.min(30E6, this.experienceNextLevel(level) / 50);
  }

  // Returns multiplier for experience from academy
  static experienceAcademyMultiplier (academy) {
    switch (_clamp(academy, 1, 20)) {
      case 1: return 1;
      case 2: return 1.1;
      case 3: return 1.2;
      case 4: return 1.3;
      case 5: return 1.4;
      case 6: return 1.5;
      case 7: return 1.6;
      case 8: return 2.0;
      case 9: return 2.4;
      case 10: return 3.2;
      case 11: return 4.0;
      case 12: return 4.8;
      case 13: return 6.4;
      case 14: return 8.0;
      case 15: return 9.6;
      case 16: return 10.0;
      case 17: return 10.4;
      case 18: return 10.8;
      case 19: return 11.2;
      case 20: return 12;
    }
  }

  // Returns hourly output of academy
  static experienceAcademyHourly (level, academy) {
    return _clamp(academy, 1, 20) * this.experienceBase(level) / this.experienceReducedBase(level) / 30;
  }

  // Return capacity of academy
  static experienceAcademyCapacity (level, academy) {
    return this.experienceAcademyHourly(level, academy) * this.experienceAcademyMultiplier(academy);
  }

  // Returns curve of souls gained from lure
  static soulsCurve () {
    return this.#SOULS_CURVE;
  }

  // Returns souls gained from lure
  static souls (level, gate, torture) {
    level = Math.max(level, 0);
    gate = _clamp(gate, 0, 15);
    torture = _clamp(torture, 0, 15);

    return Math.ceil(
      (level < 542 ? (this.#SOULS_CURVE[level] / 7.5) : (464075 + (level - 525) * 8663)) * (1 + 0.1 * torture) * (1 + 0.2 * Math.max(0, gate - 5))
    );
  }

  // Returns basic gold curve
  static goldCurve () {
    return this.GOLD_CURVE;
  }

  // Returns gold
  static gold (level) {
    const value = this.GOLD_CURVE[_clamp(level, 0, 640)];
    
    return typeof value === 'undefined' ? 1E9 : value
  }

  // Returns gold from griffin mount
  static goldEnvironmentalReward (level) {
    return Math.min(10E6, this.goldBase(level));
  }

  // Return base gold
  static goldBase (level) {
    return this.gold(level) * 12 / 1000;
  }

  // Return cost of an attribute
  static goldAttributeCost (attribute) {
    let cost = 0;

    for (let i = 0; i < 5; i++) {
      let num = Math.floor(1 + (attribute + i) / 5);

      cost = num >= 800 ? 5E9 : (cost + this.gold(num));
    }

    cost = 5 * Math.floor(Math.floor(cost / 5) / 5) / 100;
    return cost < 10 ? cost : Math.min(1E7, Math.floor(cost));
  }

  // Return total cost of an attribute
  static goldAttributeTotalCost (attribute) {
    let cost = 0;

    if (attribute > 3200) {
      cost += 1E7 * (attribute - 3200);
      attribute = 3200;
    }

    return cost + (this.GOLD_ATTRIBUTE_TOTAL[attribute - 1] || 0);
  }

  // Returns gold reward from tower enemy
  static goldTowerEnemy (level) {
    return 9 * this.gold(level + 2 ) / 100;
  }

  // Returns gold reward from twister enemy
  static goldTwisterEnemy (level) {
    return 2 * this.gold(level) / 100;
  }

  // Returns maximum gold gained from arena fight
  static goldArena (level) {
    return level > 95 ? Math.trunc(this.goldTwisterEnemy(level) / this.goldArenaMultiplier(level)) : level
  }

  // Returns multiplier for arena gold
  static goldArenaMultiplier (level) {
    if (level >= 300) {
      return 10;
    } else if (level >= 250) {
        return 15;
    } else if (level >= 200) {
        return 20;
    } else if (level >= 150) {
        return 24;
    } else {
        return 28;
    }
  }

  // Get gold from dices [0, 1, 2]
  static goldDice (level, dices) {
    return Math.pow(5, _clamp(dices, 0, 2)) * this.goldBase(level) / 3;
  }

  // Returns gold from guard duty
  static goldGuardDuty (level, tower, guildTreasure) {
    return Math.min(10E6, (this.goldBase(level) / 3) * (1 + _clamp(tower, 0, 100) / 100 + _clamp(guildTreasure, 0, 200) / 100));
  }

  // Returns gold value of a mined gem of sizes [0, 1, 2]
  static goldGem (level, mine, gemSize) {
    return Math.min(10E6, 2 * this.goldGemMineMultiplier(mine) * this.gold(level + _clamp(gemSize, 0, 2) * 5) / 1000)
  }

  // Returns multiplier for gold value of a mined gem
  static goldGemMineMultiplier (mine) {
    switch (_clamp(mine, 1, 14)) {
      case 1: return 1;
      case 2: return 2;
      case 3: return 3;
      case 4: return 4;
      case 5: return 6;
      case 6: return 8;
      case 7: return 10;
      case 8: return 12;
      case 9: return 14;
      case 10: return 16;
      case 11: return 18;
      case 12: return 20;
      case 13: return 22;
      case 14: return 24;
    }
  }

  // Returns cost of witch scroll
  static goldWitchScroll (level) {
    return Math.min(10E6, this.goldBase(level) * 12.5 / 3);
  }

  // Returns gold cost of fortress reroll
  static goldFortressReroll (level) {
    return this.goldBase(level) * 5 / 8;
  }

  // Returns gold value of witch potions
  static goldWitchPotion (level) {
    return this.goldBase(level) * 5 / 6;
  }

  // Returns base potion gold reduced by runes
  static goldPotionBase (level, runes) {
    return (1 + Math.min(1, Math.max(0, (90 - level) / 10))) * this.gold(Math.max(1, level - _clamp(runes, 0, 5))) * 15 / 1000
  }

  // Returns purchase cost of potion size [0, 1, 2]
  static goldPotionCost (level, runes, potionSize) {
    return Math.min(5E6, this.goldPotionBase(level, runes) / Math.pow(2, 2 - _clamp(potionSize, 0, 2)));
  }

  // Returns purchase cost of life potion with mushrooms
  static goldLifePotionCost (level, runes) {
    return Math.min(5E6, this.goldPotionBase(level, runes) / 3);
  }

  // Returns purchase cost of life potion without mushrooms
  static goldLifePotionShroomlessCost (level, runes) {
    return Math.min(10E6, this.goldPotionBase(level, runes));
  }

  // Returns gold from calendar bar
  static goldCalendarBar (level) {
    return 2.5 * this.goldBase(level);
  }

  // Returns gold from 3 calendar bar
  static goldCalendarBars (level) {
    return 25 * this.goldBase(level) / 3;
  }

  // Returns cost of one hourglass
  static goldHourglassCost (level, runes) {
    const value = Math.min(375000, this.goldPotionBase(level, runes) / 6);

    if (value > 37500) {
      return 375000;
    } else {
      return value;
    }
  }

  // Returns cost of 10 hourglasses
  static goldHourglassPackCost (level, runes) {
    return Math.min(3750000, 10 * this.goldHourglassCost(level, runes));
  }

  // Returns hourly production of gold pit
  static goldPitHourly (level, pit) {
    pit = _clamp(pit, 1, 100);

    return (this.goldBase(level) * pit / 75) * (1 + Math.max(0, pit - 15) / 100)
  }

  // Returns gold pit capacity
  static goldPitCapacity (level, pit) {
    pit = _clamp(pit, 1, 100);

    return Math.min(300E6, this.goldPitHourly(level, pit) * pit * Math.max(2, 12 / pit));
  }

  // Returns minimum gold reward from quest segment
  static goldQuestMin (level, tower, guildTreasure, runes) {
    return Math.min(10000000, 1 * (1 + _clamp(guildTreasure, 0, 200) / 100 + _clamp(tower, 0, 100) / 100) * this.goldBase(level) / 11) * (1 + _clamp(runes, 0, 50) / 100);
  }

  // Returns maximum gold reward from quest segment
  static goldQuestMax (level, tower, guildTreasure, runes) {
    return Math.min(10000000, 5 * (1 + _clamp(guildTreasure, 0, 200) / 100 + _clamp(tower, 0, 100) / 100) * this.goldBase(level) / 11) * (1 + _clamp(runes, 0, 50) / 100);
  }

  // Returns expedition final gold reward for 25 thirst 
  static goldExpedition (level, tower, guildTreasure, runes, scroll, mount) {
    let base = this.gold(level) / 60.38647;
    let goldMultiplier = 1 + _clamp(_clamp(guildTreasure, 0, 200) / 100 + _clamp(tower, 0, 100) * 2 / 100, 0, 3) + _clamp(runes, 0, 50) / 100
    if (scroll)
      goldMultiplier *= 1.1;
    
    return _clamp(base * goldMultiplier, 0, 50_000_000) * (1 + this.expeditionMountBonus(mount));
  }

  /*
    Data
  */
  static get GOLD_CURVE () {
    delete this.GOLD_CURVE;

    const array = [0, 25, 50, 75];

    for (let i = array.length; i < 650; i++) {
      array[i] = Math.min(Math.floor((array[i - 1] + Math.floor(array[Math.floor(i / 2)] / 3) + Math.floor(array[Math.floor(i / 3)] / 4)) / 5) * 5, 1E9);
    }

    return (this.GOLD_CURVE = array)
  }

  static get GOLD_ATTRIBUTE_TOTAL () {
    delete this.GOLD_ATTRIBUTE_TOTAL;

    const array = [];

    for (let i = 0; i < 3200; i++) {
      array[i] = (array[i - 1] || 0) + this.goldAttributeCost(i);
    }

    return (this.GOLD_ATTRIBUTE_TOTAL = array)
  }

  static #EXPERIENCE_NEXT = [
    0, 400, 900, 1400, 1800, 2200, 2890, 3580, 4405, 5355, 6435, 7515, 8925, 10335, 11975, 13715, 15730, 17745, 20250, 22755, 25620, 28660, 32060, 35460, 39535, 43610, 48155, 52935,
    58260, 63585, 69760, 75935, 82785, 89905, 97695, 105485, 114465, 123445, 133260, 143425, 154545, 165665, 178210, 190755, 204430, 218540, 233785, 249030, 266140, 283250, 301715,
    320685, 341170, 361655, 384360, 407065, 431545, 456650, 483530, 510410, 540065, 569720, 601435, 633910, 668670, 703430, 741410, 779390, 819970, 861400, 905425, 949450, 997485,
    1045520, 1096550, 1148600, 1203920, 1259240, 1319085, 1378930, 1442480, 1507225, 1575675, 1644125, 1718090, 1792055, 1870205, 1949685, 2033720, 2117755, 2208040, 2298325, 2393690,
    2490600, 2592590, 2694580, 2803985, 2913390, 3028500, 3145390, 3268435, 3391480, 3522795, 3654110, 3792255, 3932345, 4079265, 4226185, 4382920, 4539655, 4703955, 4870500, 5045205,
    5219910, 5405440, 5590970, 5785460, 5982490, 6188480, 6394470, 6613125, 6831780, 7060320, 7291640, 7533530, 7775420, 8031275, 8287130, 8554570, 8825145, 9107305, 9389465, 9687705,
    9985945, 10296845, 10611275, 10939230, 11267185, 11612760, 11958335, 12318585, 12682650, 13061390, 13440130, 13839160, 14238190, 14653230, 15072545, 15508870, 15945195, 16403485,
    16861775, 17338505, 17819980, 18319895, 18819810, 19344795, 19869780, 20414715, 20964770, 21536005, 22107240, 22705735, 23304230, 23925545, 24552535, 25202340, 25852145, 26532725,
    27213305, 27918540, 28630050, 29367610, 30105170, 30875945, 31646720, 32445505, 33251010, 34084530, 34918050, 35789075, 36660100, 37561220, 38469755, 39410080, 40350405, 41330960,
    42311515, 43326065, 44348735, 45405405, 46462075, 47563900, 48665725, 49804020, 50951005, 52136360, 53321715, 54555530, 55789345, 57064175, 58348500, 59673840, 60999180, 62378435,
    63757690, 65180715, 66614100, 68093535, 69572970, 71110105, 72647240, 74233350, 75830465, 77476555, 79122645, 80832985, 82543325, 84305910, 86080505, 87909870, 89739235, 91636870,
    93534505, 95490375, 97459260, 99486380, 101513500, 103616290, 105719080, 107883715, 110062180, 112305475, 114548770, 116872700, 119196630, 121589225, 123996780, 126473000, 128949220,
    131514215, 134079210, 136717090, 139371155, 142101400, 144831645, 147656105, 150480565, 153385655, 156307860, 159310695, 162313530, 165420140, 168526750, 171718645, 174929030,
    178228565, 181528100, 184937365, 188346630, 191849945, 195373130, 198990370, 202607610, 206345275, 210082940, 213920015, 217778100, 221739815, 225701530, 229790630, 233879730,
    238078150, 242299140, 246629445, 250959750, 255429090, 259898430, 264482960, 269091720, 273820565, 278549410, 283425105, 288300800, 293302740, 298330180, 303483865, 308637550,
    313951595, 319265640, 324712695, 330187105, 335799860, 341412615, 347193920, 352975225, 358901970, 364857940, 370959350, 377060760, 383345695, 389630630, 396068325, 402536785,
    409164155, 415791525, 422612215, 429432905, 436420230, 443440385, 450627180, 457813975, 465210300, 472606625, 480177945, 487784290, 495572280, 503360270, 511368340, 519376410,
    527574890, 535810100, 544235725, 552661350, 561325655, 569989960, 578853765, 587756750, 596866840, 605976930, 615337095, 624697260, 634274025, 643892430, 653727435, 663562440,
    673667980, 683773520, 694105920, 704481995, 715093150, 725704305, 736599015, 747493725, 758634285, 769821230, 781254025, 792686820, 804425165, 816163510, 828158780, 840203305,
    852514095, 864824885, 877455675, 890086465, 902995095, 915955220, 929193185, 942431150, 956014120, 969597090, 983470400, 997398375, 1011626725, 1025855075, 1040443405, 1055031735,
    1069933505, 1084893105, 1100166150, 1115439195, 1131099560, 1146759925, 1162747145, 1178794835, 1195180710, 1211566585, 1228357310, 1245148035, 1262290985, 1279497900, 1297057040,
    1314616180, 1332609455, 1350602730, 1368963280, 1387391470, 1406199095, 1425006720, 1444267210, 1463527700, 1483183310, 1500000000
  ];
  
  static #EXPERIENCE_TOTAL = [
    0, 0, 400, 1300, 2700, 4500, 6700, 9590, 13170, 17575, 22930, 29365, 36880, 45805, 56140, 68115, 81830, 97560, 115305, 135555, 158310, 183930, 212590, 244650, 280110, 319645, 363255,
    411410, 464345, 522605, 586190, 655950, 731885, 814670, 904575, 1002270, 1107755, 1222220, 1345665, 1478925, 1622350, 1776895, 1942560, 2120770, 2311525, 2515955, 2734495, 2968280,
    3217310, 3483450, 3766700, 4068415, 4389100, 4730270, 5091925, 5476285, 5883350, 6314895, 6771545, 7255075, 7765485, 8305550, 8875270, 9476705, 10110615, 10779285, 11482715, 12224125,
    13003515, 13823485, 14684885, 15590310, 16539760, 17537245, 18582765, 19679315, 20827915, 22031835, 23291075, 24610160, 25989090, 27431570, 28938795, 30514470, 32158595, 33876685,
    35668740, 37538945, 39488630, 41522350, 43640105, 45848145, 48146470, 50540160, 53030760, 55623350, 58317930, 61121915, 64035305, 67063805, 70209195, 73477630, 76869110, 80391905,
    84046015, 87838270, 91770615, 95849880, 100076065, 104458985, 108998640, 113702595, 118573095, 123618300, 128838210, 134243650, 139834620, 145620080, 151602570, 157791050, 164185520,
    170798645, 177630425, 184690745, 191982385, 199515915, 207291335, 215322610, 223609740, 232164310, 240989455, 250096760, 259486225, 269173930, 279159875, 289456720, 300067995,
    311007225, 322274410, 333887170, 345845505, 358164090, 370846740, 383908130, 397348260, 411187420, 425425610, 440078840, 455151385, 470660255, 486605450, 503008935, 519870710,
    537209215, 555029195, 573349090, 592168900, 611513695, 631383475, 651798190, 672762960, 694298965, 716406205, 739111940, 762416170, 786341715, 810894250, 836096590, 861948735,
    888481460, 915694765, 943613305, 972243355, 1001610965, 1031716135, 1062592080, 1094238800, 1126684305, 1159935315, 1194019845, 1228937895, 1264726970, 1301387070, 1338948290,
    1377418045, 1416828125, 1457178530, 1498509490, 1540821005, 1584147070, 1628495805, 1673901210, 1720363285, 1767927185, 1816592910, 1866396930, 1917347935, 1969484295, 2022806010,
    2077361540, 2133150885, 2190215060, 2248563560, 2308237400, 2369236580, 2431615015, 2495372705, 2560553420, 2627167520, 2695261055, 2764834025, 2835944130, 2908591370, 2982824720,
    3058655185, 3136131740, 3215254385, 3296087370, 3378630695, 3462936605, 3549017110, 3636926980, 3726666215, 3818303085, 3911837590, 4007327965, 4104787225, 4204273605, 4305787105,
    4409403395, 4515122475, 4623006190, 4733068370, 4845373845, 4959922615, 5076795315, 5195991945, 5317581170, 5441577950, 5568050950, 5697000170, 5828514385, 5962593595, 6099310685,
    6238681840, 6380783240, 6525614885, 6673270990, 6823751555, 6977137210, 7133445070, 7292755765, 7455069295, 7620489435, 7789016185, 7960734830, 8135663860, 8313892425, 8495420525,
    8680357890, 8868704520, 9060554465, 9255927595, 9454917965, 9657525575, 9863870850, 10073953790, 10287873805, 10505651905, 10727391720, 10953093250, 11182883880, 11416763610,
    11654841760, 11897140900, 12143770345, 12394730095, 12650159185, 12910057615, 13174540575, 13443632295, 13717452860, 13996002270, 14279427375, 14567728175, 14861030915, 15159361095,
    15462844960, 15771482510, 16085434105, 16404699745, 16729412440, 17059599545, 17395399405, 17736812020, 18084005940, 18436981165, 18795883135, 19160741075, 19531700425, 19908761185,
    20292106880, 20681737510, 21077805835, 21480342620, 21889506775, 22305298300, 22727910515, 23157343420, 23593763650, 24037204035, 24487831215, 24945645190, 25410855490, 25883462115,
    26363640060, 26851424350, 27346996630, 27850356900, 28361725240, 28881101650, 29408676540, 29944486640, 30488722365, 31041383715, 31602709370, 32172699330, 32751553095, 33339309845,
    33936176685, 34542153615, 35157490710, 35782187970, 36416461995, 37060354425, 37714081860, 38377644300, 39051312280, 39735085800, 40429191720, 41133673715, 41848766865, 42574471170,
    43311070185, 44058563910, 44817198195, 45587019425, 46368273450, 47160960270, 47965385435, 48781548945, 49609707725, 50449911030, 51302425125, 52167250010, 53044705685, 53934792150,
    54837787245, 55753742465, 56682935650, 57625366800, 58581380920, 59550978010, 60534448410, 61531846785, 62543473510, 63569328585, 64609771990, 65664803725, 66734737230, 67819630335,
    68919796485, 70035235680, 71166335240, 72313095165, 73475842310, 74654637145, 75849817855, 77061384440, 78289741750, 79534889785, 80797180770, 82076678670, 83373735710, 84688351890,
    86020961345, 87371564075, 88740527355, 90127918825, 91534117920, 92959124640, 94403391850, 95866919550, 97350102860
  ];
  
  static #SOULS_CURVE = [
    0, 2175, 2295, 2415, 2535, 2648, 2768, 2888, 3000, 3120, 3240, 3360, 3473, 3593, 3713, 3825, 3945, 4065, 4185, 4298, 4418, 4538, 4650, 4770, 4890, 5010, 5123, 5243, 5363, 5475, 5595,
    5715, 5835, 5948, 6068, 6188, 6255, 6330, 6398, 6465, 6540, 6608, 6683, 6750, 6825, 6893, 6960, 7035, 7103, 7178, 7245, 7320, 7388, 7455, 7530, 7598, 7673, 7740, 7815, 7883, 7950,
    8025, 8093, 8168, 8235, 8310, 8378, 8445, 8520, 8588, 8663, 8768, 8873, 8978, 9083, 9188, 9300, 9405, 9510, 9615, 9720, 9825, 9930, 10043, 10148, 10253, 10358, 10463, 10568, 10673,
    10785, 10890, 10995, 11100, 11205, 11310, 11415, 11528, 11633, 11738, 11843, 11948, 12053, 12158, 12270, 12375, 12585, 12795, 13013, 13223, 13433, 13643, 13860, 14070, 14280, 14498,
    14708, 14918, 15128, 15345, 15555, 15765, 15983, 16193, 16403, 16613, 16830, 17040, 17250, 17468, 17678, 17888, 18098, 18315, 18525, 18735, 18953, 19163, 19373, 19583, 19800, 20115,
    20438, 20753, 21068, 21390, 21705, 22028, 22343, 22665, 22980, 23295, 23618, 23933, 24255, 24570, 24893, 25208, 25523, 25845, 26160, 26483, 26798, 27120, 27435, 27750, 28073, 28388,
    28710, 29025, 29348, 29663, 29978, 30300, 30615, 30938, 31395, 31853, 32318, 32775, 33233, 33690, 34155, 34613, 35070, 35535, 35993, 36450, 36908, 37373, 37830, 38288, 38753, 39210,
    39668, 40125, 40590, 41048, 41505, 41970, 42428, 42885, 43343, 43808, 44265, 44723, 45188, 45645, 46103, 46560, 47025, 47730, 48435, 49148, 49853, 50558, 51263, 51975, 52680, 53385,
    54098, 54803, 55508, 56213, 56925, 57630, 58335, 59048, 59753, 60458, 61163, 61875, 62580, 63285, 63998, 64703, 65408, 66113, 66825, 67530, 68235, 68948, 69653, 70358, 71063, 71775,
    72728, 73680, 74640, 75593, 76545, 77498, 78458, 79410, 80363, 81323, 82275, 83228, 84180, 85140, 86093, 87045, 88005, 88958, 89910, 90863, 91823, 92775, 93728, 94688, 95640, 96593,
    97545, 98505, 99458, 100410, 101370, 102323, 103275, 104228, 105188, 106598, 108015, 109425, 110843, 112260, 113670, 115088, 116498, 117915, 119325, 120743, 122160, 123570, 124988,
    126398, 127815, 129225, 130643, 132060, 133470, 134888, 136298, 137715, 139125, 140543, 141960, 143370, 144788, 146198, 147615, 149025, 150443, 151860, 153270, 154688, 156810, 158925,
    161048, 163170, 165293, 167415, 169538, 171660, 173775, 175898, 178020, 180143, 182265, 184388, 186510, 188625, 190748, 192870, 194993, 197115, 199238, 201360, 203475, 205598, 207720,
    209843, 211965, 214088, 216210, 218325, 220448, 222570, 224693, 226815, 228938, 232470, 236010, 239543, 243075, 246615, 250148, 253688, 257220, 260760, 264293, 267825, 271365, 274898,
    278438, 281970, 285510, 289043, 292575, 296115, 299648, 303188, 306720, 310260, 313793, 317325, 320865, 324398, 327938, 331470, 335010, 338543, 342075, 345615, 349148, 352688, 357810,
    362940, 368063, 373193, 378323, 383445, 388575, 393698, 398828, 403950, 409080, 414210, 419333, 424463, 429585, 434715, 439838, 444968, 450098, 455220, 460350, 465473, 470603, 475725,
    480855, 485985, 491108, 496238, 501360, 506490, 511613, 516743, 521873, 526995, 532125, 539903, 547680, 555458, 563235, 571013, 578798, 586575, 594353, 602130, 609908, 617685, 625463,
    633248, 641025, 648803, 656580, 664358, 672135, 679913, 687698, 695475, 703253, 711030, 718808, 726585, 734363, 742148, 749925, 757703, 765480, 773258, 781035, 788813, 796598, 804375,
    815865, 827355, 838845, 850335, 861825, 873323, 884813, 896303, 907793, 919283, 930773, 942263, 953760, 965250, 976740, 988230, 999720, 1011210, 1022700, 1034198, 1045688, 1057178,
    1068668, 1080158, 1091648, 1103138, 1114635, 1126125, 1137615, 1149105, 1160595, 1172085, 1183575, 1195073, 1206563, 1271528, 1336500, 1401465, 1466438, 1531403, 1596375, 1661340,
    1726313, 1791278, 1856250, 1921223, 1986195, 2051168, 2116140, 2181113, 2246085, 2311058, 2376030, 2441003, 2505975, 2570948, 2635920, 2700893, 2765865, 2830838, 2895810, 2960783,
    3025755, 3090728, 3155700, 3220673, 3285645, 3350618, 3415590, 3480563, 3545535, 3610508, 3675480, 3740453, 3805425, 3870398, 3935370, 4000343, 4065315, 4130288, 4195260, 4260233,
    4325205, 4390178, 4455150, 4520123
  ];
}

/*
  Item rune to runes conversions
*/
const RUNE_VALUE = {
  GOLD: function (rune) {
      return rune < 2 ? 0 : (3 + 2 * (rune - 2));
  },
  EPIC_FIND: function (rune) {
      return rune < 2 ? 0 : (3 + 2 * (rune - 2));
  },
  ITEM_QUALITY: function (rune) {
      switch (rune) {
          case 1: return 3;
          case 2: return 19;
          case 3: return 50;
          case 4: return 75;
          case 5: return 99;
          default: return 0;
      }
  },
  XP: function (rune) {
      switch (rune) {
          case 1: return 3;
          case 2: return 9;
          case 3: return 25;
          case 4: return 35;
          case 5: return 45;
          case 6: return 55;
          case 7: return 65;
          case 8: return 75;
          case 9: return 85;
          case 10: return 95;
          default: return 0;
      }
  },
  HEALTH: function (rune) {
      switch (rune) {
          case 1: return 3;
          case 2: return 6;
          case 3: return 17;
          case 4: return 23;
          case 5: return 30;
          case 6: return 36;
          case 7: return 43;
          case 8: return 50;
          case 9: return 56;
          case 10: return 64;
          case 11: return 72;
          case 12: return 80;
          case 13: return 88;
          case 14: return 94;
          case 15: return 99;
          default: return 0;
      }
  },
  SINGLE_RESISTANCE: function (rune) {
      if (rune < 2) {
          return 0;
      } else {
          return Math.floor((rune - 0.4) / 0.75);
      }
  },
  TOTAL_RESISTANCE: function (rune) {
      return RUNE_VALUE.SINGLE_RESISTANCE(rune * 3);
  },
  ELEMENTAL_DAMAGE: function (rune) {
      if (rune < 2) {
          return 0;
      } else {
          return Math.floor((rune - 0.3) / 0.6);
      }
  }
}
