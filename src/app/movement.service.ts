import { Injectable } from '@angular/core';
import * as anime from "animejs";
import {randomIntClamp} from "./random.utils";
import { AppearanceService } from './appearance.service';

var cache = [];
class Bezier{
  cache = cache;
  selector:string;
  ns:string;
  target:Element;
  uid:number = 0;
	constructor(){
		let ns = "http://www.w3.org/2000/svg"; 
		this.ns = ns;
		this.selector = "generated"
		let svg = document.createElementNS (ns, "svg");
		svg.setAttribute("id",this.selector);
		this.selector = "#"+this.selector;
		svg.setAttribute("height", window.innerHeight.toString());
		svg.setAttribute("width", window.innerWidth.toString());
		document.body.appendChild(svg);
		this.target = document.querySelector(this.selector);
	}
	draw(draw){
		let oldPath = this.target.querySelector("path");
		if(oldPath){
			//start at the end of the last
			let d = oldPath.getAttribute("d").split(" ").pop().split(",")
			cache.shift()
			let followOn = {
				start:{
					top:parseInt(d[1]),
					left:parseInt(d[0])
				},
				end:draw.end
			} 
			cache.push(followOn);
			return this.perfectCurve(followOn);
		}
		else{//first run
			cache.push(draw);
			return this.perfectCurve(draw);
		}
		
	}
	perfectCurve(draw):number{
    this.uid++;
    let oldPath = this.target.querySelector("path");
		if(oldPath){
			 this.target.removeChild(oldPath)
		}
		let path = document.createElementNS(this.ns, "path");
		let threshold = draw.end.top > (innerHeight / 2);
		
		let dir:"up"|"down" = threshold? "up":"down";
    let ctrl2 = dir === "up"? `${draw.start.left},${draw.end.top}`:`${draw.end.left},${draw.start.top}`;
    path.setAttribute('id','mp-'+this.uid);
    path.setAttributeNS(null, "d", `M${draw.start.left},${draw.start.top} Q${ctrl2} ${draw.end.left},${draw.end.top}`);
		const pathLen = (path as any).getTotalLength();
		this.target.appendChild( path );
		return pathLen;
	}
}

//expose our curve as a dependency
let b = new Bezier()

//The shit that counts
interface Coordinate{
  top:number,
  left:number
}

@Injectable()
export class MovementService{
  
  get wrapper(){
		return document.querySelector('#avatar-size') as Element;
	}
	public bezier = b;
	
	//gives a Distance
	public rateDistance(n):string{
		let rating;
		n = Math.round(n);
		console.log('R',n, n < 100)

		if(n > 0){
			rating = 'v-short';
		}
		if(n > 200){
			rating = 'short';
		}
		if(n > 300){
			rating = 'medium';
		}
		if(n > 400){
			rating = 'long';
		}
		if(n > 800){
			rating = 'v-short';
		}

		return rating;
	}

	public rateSpeed(n){

	}

	public async fromTo(coordinateStart?:Coordinate, coordinateEnd?:Coordinate, speed:number = 3000){
		this.bezier.draw({
			start:coordinateStart,
			end:coordinateEnd
		})
		let path = anime.path('#generated path');
		return new Promise(resolve=>{
			anime({
				targets: '#move-wrapper',
				translateX: path('x'),
				translateY: path('y'),
				easing: 'linear',
				duration: speed,
				loop: false,
				complete(){
					resolve();
				}
			});
		});
	}

  public async to(coordinate?:Coordinate, speed:number = 3000){

		if(!coordinate){
			coordinate = <Coordinate>{
				top:window.innerWidth / 2,
				left:window.innerHeight / 2
			}
		}
		let wrapperCoordianate = this.wrapper.getBoundingClientRect();
		
		let distance = this.bezier.draw({
			start:{
				top:wrapperCoordianate.top||0,
				left:wrapperCoordianate.left||0
			},
			end:{
				top:randomIntClamp(0,innerHeight - wrapperCoordianate.height),
				left:randomIntClamp(0,innerWidth  - wrapperCoordianate.height)
			}
		})
		
		let path = anime.path('#generated path');
		
		return new Promise(resolve=>{

			anime({
				targets: '#move-wrapper',
				translateX: path('x'),
				translateY: path('y'),
				easing: 'linear',
				duration: speed,
				loop: false,
				complete:()=>{
					console.log( this.rateDistance(distance) )
					resolve();
				}
			});
		});
	}
	
	public async toElement(selector:string, alignTo:'top'|'left'|'right'|'bottom', speed:number = 3000){
		
		let wrapperCoordianate = this.wrapper.getBoundingClientRect();
		let toTarget = <Element>document.querySelector(selector);
		let targetCoordinate = toTarget.getBoundingClientRect();
		let end:Coordinate;

		if(alignTo === 'top'){
			end = {
				top:targetCoordinate.top - AppearanceService.publicAvatar.size,
				left:targetCoordinate.left + (targetCoordinate.width / 2) - (AppearanceService.publicAvatar.size / 2)
			}
		}

		if(alignTo === 'left'){
			end = {
				top:targetCoordinate.top + (targetCoordinate.height / 2) - (AppearanceService.publicAvatar.size / 2),
				left:targetCoordinate.left - AppearanceService.publicAvatar.size
			}
		}

		if(alignTo === 'right'){
			end = {
				top:targetCoordinate.top + (targetCoordinate.height / 2) - (AppearanceService.publicAvatar.size / 2),
				left:targetCoordinate.right
			}
		}

		if(alignTo === 'bottom'){
			end = {
				top:targetCoordinate.bottom + 5,
				left:targetCoordinate.left + (targetCoordinate.width / 2) - (AppearanceService.publicAvatar.size / 2)
			}
		}

		let distance = this.bezier.draw({
			start:{
				top:wrapperCoordianate.top||0,
				left:wrapperCoordianate.left||0
			},
			end:end
		})
		
		let path = anime.path('#generated path');
		
		return new Promise(resolve=>{

			anime({
				targets: '#move-wrapper',
				translateX: path('x'),
				translateY: path('y'),
				easing: 'linear',
				duration: speed,
				loop: false,
				complete:()=>{
					console.log( this.rateDistance(distance) )
					resolve();
				}
			});
		});
	}
  
}
