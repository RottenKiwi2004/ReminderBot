const genFree = require("./genFree");
const fs = require("fs");

const day = [31,28,31,30,31,30,31,31,30,31,30,31];
const month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

module.exports = function(message,date1,date2)
{
    let id = message.author.id;
    let dir = `../../freetime/${id}`;
    let date = new Date();
    let start_d = date1.getDate();
    let stop_d = date2.getDate();
    let start_m = date1.getMonth();
    let stop_m = date2.getMonth();
    let start_y = date1.getUTCFullYear();
    let stop_y = date2.getUTCFullYear();
    let totolTime = {
        hour:0,
        minutes:0
    }
    for(let y=start_y; y<=stop_y;y++)
    {
        for(let m=(y == start_y ? start_m : 0 ); m<= (y == stop_y ? stop_m : 11) ; m++)
        {
            let isFebLeap = ((m==1)&&(y%4==0)?1:0)
            for(let d = (y == start_y ?( m == start_m ? start_d: 1): 1 );
                d <= (y == stop_y ? (m == stop_m ? stop_d : day[m]+isFebLeap) : day[m]+isFebLeap);
                d++)
            {
                genFree(d,month[m],y,message);
                let dir2 = `../Reminder/freetime/${message.author.id}/${month[m]} ${d}, ${y}`
                dir3 = fs.readdirSync(dir2);
                for(file of dir3)
                {
                    time = fs.readFileSync(`${dir2}/${file}`);
                    time = JSON.parse(time);
                    time = time.time;
                    totolTime.hour+=time.hour;
                    totolTime.minutes+=time.minute;
                    totolTime.hour+=parseInt(totolTime.minutes/60);
                    totolTime.minutes%=60;
                    // console.log(totolTime);
                }
            }
        }
    }
    return totolTime;
}