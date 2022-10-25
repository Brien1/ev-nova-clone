import React, { Component } from "react";
class Ship extends React.Component {
    constructor() {
        super()
        this.state = {
            v1: { dir: 0, spd: 0},
            v2: { dir: 0, spd: 0},
            result: { dir: 0, spd: 0},
            accelerating: false,
            rotating_left: false,
            rotating_right: false,
            stop_dir: undefined
        }
        this.ShipStyle = {
            backgroundColor: "red",
            width: "30px",
            padding: "5px",
            position: "absolute",
            top: "50%",
            left: "50%",
        }

    }
    getorientation() {
        return this.state.orientation
    }
    componentDidMount() {
        document.addEventListener("keydown", (e) => {
            if (e.key === "ArrowLeft") {
                this.setState((state) => {
                    return this.leftRotation(state);
                })
            }
            if (e.key === "ArrowRight") {
                this.setState((state) => {
                    return this.leftRotation(state)
                })
            }
            if (e.key === "ArrowDown") {
                console.log("stopping", "dir ", this.radians_to_degrees(Math.atan(this.state.y_speed / this.state.x_speed)))
                this.setState((state) => {
                    return (state.dir <= 180) ?
                        { stop_dir: Math.round(state.dir + 180) } :
                        { stop_dir: Math.round(state.dir - 180) };

                });


                this.setState((state) => {
                    console.log(state.stop_dir, state.orientation)
                    if (Math.round(state.stop_dir) !== state.orientation) {

                        return this.leftRotation(state);
                    }
                })

            }
        })
        document.addEventListener("keydown", (e) => {
            if (e.key === "ArrowUp") {
                this.setState(() => { return { accelerating: true } }, () => {
                    // if (this.state.rotating_left) {
                    //     this.setState((state) => { return this.leftRotation(state); })
                    //     console.log(this.state.orientation, this.state.speed)
                    // }
                    if (!this.state.rotating_left || !this.state.rotating_right) {
                        this.setState((state) => {
                          
                            return{ 
                                v1:{
                                    spd:state.v1.spd +1,
                                    dir:state.v1.dir
                                },
                                v2: {
                                    spd:(state.v2.spd > 0) ? state.v2.spd - 1: state.v2.spd,
                                    dir:state.v2.dir
                                }
                                
                            }

                            
                            
                            
                        }, () => {
                            this.setState((state)=>{
                                return {
                                    result:{
                                    dir: this.calculateVectorDirection(state.v1, state.v2),
                                    spd: this.calculateVectorMag(state.v1, state.v2)
                                }}
                            }) 
                        })
                    }

                })
            }
        }, () => {});
        document.addEventListener("keyup", (e) => {
            if (e.key === "ArrowUp") {
                this.setState(() => { return { accelerating: false } })
            }
            if (e.key === "ArrowDown") {
                this.setState(() => { return { rotating_left: false, rotating_right: false } })
            }
            if (e.key === "ArrowLeft") {
                this.setState(() => { return { rotating_left: false } })
            }
        });
    }


    leftRotation(state) {
        let turn_speed = 45;

        let new_orientation = state.v1.dir + turn_speed;
        if (new_orientation >= 360) {
            new_orientation -= 360;
        }
        if (state.accelerating) {
        }
        return { 
            v1: {dir:new_orientation, spd:0},
            rotating_left: true, 
            v2: state.result
        }
    }


    getOppAdj(v1,v2) {
        let adj = 0;
        adj += Math.cos(this.degrees_to_radians(v1.dir)) * v1.spd;
        adj += Math.cos(this.degrees_to_radians(v2.dir)) * v2.spd;
        let opp = 0;
        opp += Math.sin(this.degrees_to_radians(v1.dir)) * v1.spd;
        opp += Math.sin(this.degrees_to_radians(v2.dir)) * v2.spd;
        return {opp,adj}
    }
    calculateVectorDirection(v1,v2) {
        let {opp,adj} = this.getOppAdj(v1,v2)
        let dir = this.radians_to_degrees(Math.atan2(opp,adj));
        if (Math.abs(dir)!==dir) {
            dir = 360 + dir
        }
        return dir;
    }
    calculateVectorMag(v1,v2) {
        let {opp,adj} = this.getOppAdj(v1,v2)
        let mag = Math.sqrt(opp**2 + adj**2);
        return mag;
    }
    radians_to_degrees(radians) {
        var pi = Math.PI;
        var deg = radians * (180 / pi)
        return deg;
    }
    degrees_to_radians(degrees) {
        var pi = Math.PI;
        return degrees * (pi / 180)
    }

    render() {
        let mp = JSON.stringify(this.state, undefined, "\n")
        let setrotation = { transform: `rotate(${this.state.v1.dir}deg)` };
        let ship = <div style={{ position: "relative", height: "600px", width: "400px" }}><div style={{ ...this.ShipStyle, ...setrotation }}> =====+   </div></div>
        return (<><div>{mp}</div><div>{ship}</div></>)
    }
}

export default Ship