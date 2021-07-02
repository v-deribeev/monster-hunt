function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const app = Vue.createApp({
  data() {
    return {
      pHealth: 100,
      mHealth: 100,
      currentRound: 0,
      specialRound: 0,
      healRound: 0,
      winner: null,
      log: [],
    };
  },
  computed: {
    monsterBarStyles() {
      if (this.mHealth < 0) {
        return { width: "0%" };
      } else {
        return { width: this.mHealth + "%" };
      }
    },
    playerBarStyles() {
      if (this.pHealth < 0) {
        return { width: "0%" };
      } else {
        return { width: this.pHealth + "%" };
      }
    },
    specialUnavailable() {
      return this.specialRound !== 0;
    },
    healUnavailable() {
      return this.healRound !== 0;
    },
  },
  watch: {
    pHealth(value) {
      if (value <= 0 && this.mHealth <= 0) {
        this.winner = "draw";
      } else if (value <= 0) {
        this.winner = "monster";
      }
    },
    mHealth(value) {
      if (value <= 0 && this.pHealth <= 0) {
        this.winner = "draw";
      } else if (value <= 0) {
        this.winner = "player";
      }
    },
  },
  methods: {
    newGame() {
      this.pHealth = 100;
      this.mHealth = 100;
      this.currentRound = 0;
      this.specialRound = 0;
      this.healRound = 0;
      this.winner = null;
      this.log = [];
    },
    attackMonster() {
      this.currentRound++;
      if (this.specialRound > 0) {
        this.specialRound--;
      }
      if (this.healRound > 0) {
        this.healRound--;
      }
      const attackValue = getRandomValue(5, 12);
      this.mHealth -= attackValue;
      this.addLog("player", "attack", attackValue);
      this.attackPlayer();
    },
    attackPlayer() {
      const attackValue = getRandomValue(8, 15);
      this.pHealth -= attackValue;
      this.addLog("monster", "attack", attackValue);
    },
    specialAttack() {
      this.currentRound++;
      if (this.healRound > 0) {
        this.healRound--;
      }
      this.specialRound = 3;
      const attackValue = getRandomValue(10, 25);
      this.mHealth -= attackValue;
      this.addLog("player", "special", attackValue);
      this.attackPlayer();
    },
    heal() {
      this.currentRound++;
      if (this.specialRound > 0) {
        this.specialRound--;
      }
      this.healRound = 5;
      const healValue = getRandomValue(12, 30);
      if (this.pHealth + healValue > 100) {
        this.pHealth = 100;
      } else {
        this.pHealth += healValue;
      }
      this.addLog("player", "heal", healValue);
      this.attackPlayer();
    },
    surrender() {
      this.winner = "monster";
    },
    addLog(who, what, value) {
      this.log.unshift({
        actionBy: who,
        actionType: what,
        actionValue: value,
      });
    },
  },
});
app.mount("#game");
