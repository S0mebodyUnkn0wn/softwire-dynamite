

// refactor later: make into an enum?
const possible_throws = ["R","P","S","W","D"];
const percent_modifier = 0.01;
const dynamite_tie_streak_threshold = 3;


class Bot {

    constructor () {
        this.roundN = 0;
        this.dynamite_count = 100;
        this.enemy_dynamite_count = 100;
        this.throw_weights  = [33/100, 33/100, 33/100, 1/100, 0/100];
        this.tie_streak = 0;
        this.streaks = [];
    }

    makeMove(gamestate) {
        let last_enemy_move = null;
        let last_player_move = null;
        if (this.roundN>0){
            const last_round = gamestate.rounds[gamestate.rounds.length - 1];
            last_enemy_move = last_round.p2;
            last_player_move = last_round.p1;
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

        if (this.tie_streak >= dynamite_tie_streak_threshold && this.dynamite_count > 0) {pick_index = 4;}
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
        
        return possible_throws
    [pick_index];
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

        normalize_weights(this.throw_weights)
        // Moved to normalize_weights()
        // let sum = compute_sum(this.throw_weights);
        // for (let i=0;i<this.throw_weights.length;i++){
        //     this.throw_weights[i]/=sum;
        // }
        // console.log(this.throw_weights, sum);

    }
}

module.exports = new Bot();

function normalize_weights(iterable){
    let sum = compute_sum(iterable);
    for (let i=0;i<iterable.length;i++){
        iterable[i]/=sum;
    }
}

function compute_sum(iterable){
    return iterable.reduce((p,c)=>{return p+c},0);
}