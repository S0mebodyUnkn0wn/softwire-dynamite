
const things = ["R","P","S","W","D"];

class Bot {

    constructor () {
        this.roundN = 0;
        this.dynamite_count = 100;
        this.enemy_dynamite_count = 100;
        this.throw_weights  = [6/20, 6/20, 6/20, 1/20, 1/20];
    }

    makeMove(gamestate) {
        let last_enemy_move = null;
        if (this.roundN>0){
            last_enemy_move = gamestate.rounds[gamestate.rounds.length - 1].p2;
        }

        this.roundN++;
        
        if (last_enemy_move==="D"){
            this.enemy_dynamite_count--;
            if (this.enemy_dynamite_count==0){
                this.adjustWeight(3,0);
            }
        }

       

        const pick_index = this.chooseMove(this.throw_weights);

        if (pick_index==4) {
            this.dynamite_count--;
            if (this.dynamite_count==0){
                this.adjustWeight(4,0);
            }
        }
        
        
        

        
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

    adjustWeight(index, new_value) {

        this.throw_weights[index]*=new_value;

        let sum = this.throw_weights.reduce((p,c)=>{return p+c},0);
        for (let i=0;i<this.throw_weights.length;i++){
            this.throw_weights[i]/=sum;
        }
        // console.log(this.throw_weights, sum);

    }
}

module.exports = new Bot();
