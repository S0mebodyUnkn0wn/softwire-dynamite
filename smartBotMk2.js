// Version two of the smart bot, this one tries to adjsut percentages to follow the oponnents throws (so if they favor one of the throws this will couteract them)
// This bot will also try to throw dynomite after 3 ties

// Smart Bot Mark 2 wins consistently against smart bot Mk1 and rockBot

// refactor later: make into an enum?
const things = ["R","P","S","W","D"];

class Bot {

    constructor () {
        this.roundN = 0;
        this.dynamite_count = 100;
        this.enemy_dynamite_count = 100;
        this.throw_weights  = [6/20, 6/20, 6/20, 1/20, 1/20];
        this.tie_streak = 0;
        this.streaks = [];
    }

    makeMove(gamestate) {
        let last_enemy_move = null;
        let last_player_move = null;
        if (this.roundN>0){
            last_enemy_move = gamestate.rounds[gamestate.rounds.length - 1].p2;
            last_player_move = gamestate.rounds[gamestate.rounds.length - 1].p1;
        }

        if (last_enemy_move == last_player_move) {
            this.tie_streak++;
        } else if (this.tie_streak > 0) {
            this.streaks.push(this.tie_streak);
            // console.log(this.streaks.length, this.tie_streak)
            // console.log(this.streaks.reduce((p,c)=>{return p+c},0)/this.streaks.length);
            this.tie_streak = 0;
        }



        this.roundN++;

        const percent_modifier = 0.01;
        switch (last_enemy_move) { // refactor later: can we roll this into one/two ifs
            case "R":
                this.adjustWeight([1, 2, 3], [1+percent_modifier, 1-percent_modifier, 1-percent_modifier]);
                break;
            case "P":
                this.adjustWeight([2, 0, 3], [1+percent_modifier, 1-percent_modifier, 1-percent_modifier]);
                break;
            case "S":
                this.adjustWeight([0, 1, 3], [1+percent_modifier, 1-percent_modifier, 1-percent_modifier]);
                break;
            case "W":
                this.adjustWeight([4], [1-percent_modifier]);
                break;
            case "D":
                this.enemy_dynamite_count--;
                if (this.enemy_dynamite_count==0){
                    this.adjustWeight([3],[0]);
                }
                this.adjustWeight([3], [1+percent_modifier]);
                break;
        }


        let pick_index = null;

        if (this.tie_streak == 3 && this.dynamite_count > 0) {pick_index = 4;}
        else {pick_index = this.chooseMove(this.throw_weights);}

        if (pick_index==4) {
            this.dynamite_count--;
            if (this.dynamite_count==0){
                // console.log("Ran out!", this.roundN, this.throw_weights);
                this.adjustWeight([4],[0]);
            }
        }
        
        
        
        // console.log(this.throw_weights);
        // console.log(this.dynamite_count, this.enemy_dynamite_count);
        
        return things[pick_index];
    }

    chooseMove(weights) {
        
        let random_roll = Math.random();
        let pick=0;
        while (random_roll>0){
            random_roll-=weights[pick];
            pick++;
        }
        return pick-1;

    }

    adjustWeight(indices, new_values) {

        for (let i=0; i<indices.length; i++) {
            this.throw_weights[indices[i]]*=new_values[i];
        }

        let sum = this.throw_weights.reduce((p,c)=>{return p+c},0);
        for (let i=0;i<this.throw_weights.length;i++){
            this.throw_weights[i]/=sum;
        }
        // console.log(this.throw_weights, sum);

    }
}

module.exports = new Bot();
