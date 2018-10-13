'use strict';

const mercedesColor = '1e8d24';
const bmwColor = '1d28dc';
const toyotaColor = 'db8513';
const lexusColor = '3887c8';
const audiColor = 'black';
const asphaltColor = 'd8d8d8';
const groundColor = 'd9d1a1';
const iceColor = 'c5f1f2';

let mercedes = new Mercedes(48, mercedesColor);
let bmw = new Bmw(50, bmwColor);
let toyota = new Toyota(47, toyotaColor);
let lexus = new Lexus(51, lexusColor);
let audi = new Audi(49,  audiColor);
let asphalt = new Asphalt (asphaltColor, 1.2);
let ice = new Ice (iceColor, 0.7);
let ground = new Ground (groundColor, 1.0);

class App {
	constructor() {
		this.carList = [mercedes, bmw, toyota, lexus, audi];
		this.selectedCars = [];
		this.trackList = [asphalt, ice, ground];
		this.isTableSeen = false;
		this.track = null;
		this.selectedAll = 0;
		this.getSelectedCars = this.getSelectedCars.bind(this);
		this.getSelectedTrack = this.getSelectedTrack.bind(this);
		this.allCarsMoveStart = this.allCarsMoveStart.bind(this);
		this.intervalId;
	}
	trackAreaRender() {
		let i = 0;
		let tracksArea = document.querySelector('.tracks-area');
		this.trackList.forEach(track => {
			let flexChild = document.createElement('div');
			flexChild.setAttribute('class', 'flex-child');
			flexChild.setAttribute('id', 'track' + i);
			let trackArea = document.createElement('div');
			trackArea.setAttribute('class', 'track');
			trackArea.style.backgroundColor = '#' + track.color;
			let dashedLine = document.createElement('div');
			dashedLine.setAttribute('class', 'dashed-line');
			trackArea.appendChild(dashedLine);
			let trackName = document.createElement('span');
			let nameTextNode = document.createTextNode(track.name);
			trackName.appendChild(nameTextNode);
			let br = document.createElement('br');
			let factor = document.createElement('span');
			let factorTextNode = document.createTextNode(track.factor);
			factor.appendChild(factorTextNode);
			flexChild.appendChild(trackArea);
			flexChild.appendChild(trackName);
			flexChild.appendChild(br);
			flexChild.appendChild(factor);
			flexChild.addEventListener('click', this.getSelectedTrack);
			tracksArea.appendChild(flexChild);
			i++;
		});
	}
	carAreaRender() {
		let i = 0;
		let carsArea = document.querySelector('.cars-area');
		this.carList.forEach(car => {
			let flexChild = document.createElement('div');
			flexChild.setAttribute('class', 'flex-child');
			flexChild.setAttribute('id', 'car'+ i);
			let iconArea = document.createElement('div');
			iconArea.innerHTML = car.icon;
			let carMark = document.createElement('span');
			let markTextNode = document.createTextNode(car.name);
			carMark.appendChild(markTextNode);
			let carSpeed = document.createElement('div');
			let speedTextNode = document.createTextNode(car.speed + ' px/s');
			carSpeed.appendChild(speedTextNode);
			flexChild.appendChild(iconArea);
			flexChild.appendChild(carMark);
			flexChild.appendChild(carSpeed);
			flexChild.addEventListener('click', this.getSelectedCars)
			carsArea.appendChild(flexChild);
			i++;
		})
	}
	tracesHidden() {
		let traces = document.querySelectorAll('.trace');
		traces.forEach(trace => {
			trace.style.visibility = 'hidden';
		})
	}
	tracesVisible() {
		let traces = document.querySelectorAll('.trace');
		traces.forEach(trace => {
			trace.style.visibility = 'visible';
		})
	}
	getTraceCarDiv(car) {
		let iconWithTrace = document.createElement('div');
		iconWithTrace.setAttribute('class', 'icon-with-trace');
		let traceDiv = this.track.getTrace();
		iconWithTrace.appendChild(traceDiv);
		let iconDiv = car.getCarIcon();
		iconWithTrace.appendChild(iconDiv);
		return iconWithTrace;
	}
	getSelectedCars(event) {
		let carId = +event.currentTarget.id.slice(3); 
		let selectedCarId = this.selectedCars.indexOf(this.carList[carId]);
		let gameArea = document.querySelector('#game');
		let allTd = gameArea.querySelectorAll('.first-td');
		let iconWithTrace;
		if (this.selectedCars.length < 3 && !this.carList[carId].selected) {
			this.selectedAll++;
			this.carList[carId].selected = true;
			this.selectedCars.push(this.carList[carId]);
			event.currentTarget.setAttribute('class', 'flex-child selected-element')
			
			for (let i = 0; i < allTd.length; i++) {
				if (this.isTableSeen) {
					if (!allTd[i].innerHTML) {
						if (this.selectedCars.indexOf(this.carList[carId]) === -1) {
							this.selectedCars.push(this.carList[carId]);
							this.selectedAll++;
						}
						iconWithTrace = this.getTraceCarDiv(this.carList[carId]);
						iconWithTrace.setAttribute('id', 'car-id' + i);
						allTd[i].appendChild(iconWithTrace);
						allTd[i].setAttribute('id', 'car-td' + carId);
						break;
					}
				} else {
					this.selectedCars.push(this.carList[carId]);
					this.selectedAll++;
				}
			} 
		} else if (this.selectedAll !== 0 && this.carList[carId].selected) {
			this.carList[carId].selected = false;
			this.selectedCars.splice(selectedCarId, 1);
			this.selectedAll--;
			event.currentTarget.setAttribute('class', 'flex-child');
			if (this.isTableSeen) {
				let emptyTd = document.querySelector('#car-td' + carId);
				emptyTd.innerHTML = '';
			}
		}
		this.chackIfAllSelected();
	
	}
	chackIfAllSelected() {
		if (this.selectedAll === 3 && this.track) {
			if (!this.isTableSeen) {
				this.isTableSeen = true;
				this.gameAreaRender();
			}
			this.startEbaled();
		} else {
			this.startDesabled();
		}
	}	
	changeTracesColor() {
		let allTraces = document.querySelectorAll('.trace');
		allTraces.forEach(trace => {
		    trace.setAttribute('class', 'trace ' + this.track.traceClass);
		})
	}
	changeGameAreaColor() {
		let game = document.querySelector('#game');
		game.style.backgroundColor = '#' + this.track.color;
	}
	getSelectedTrack(event) {
		let trackId = +event.currentTarget.id.slice(5); 
		let tracksArea = document.querySelector('.tracks-area');
		let tracks = tracksArea.querySelectorAll('.flex-child');
		tracks.forEach(track => {
		    this.track = this.trackList[trackId];
		    track.setAttribute('class', 'flex-child');
		})
		event.currentTarget.setAttribute('class', 'flex-child selected-element');
		this.changeTracesColor();
		this.changeGameAreaColor();
		this.chackIfAllSelected();
	}
	removeEventListeners() {
		let carsArea = document.querySelector('.cars-area');
		let tracksArea = document.querySelector('.tracks-area');
		let	allCars = carsArea.querySelectorAll('.flex-child');
		let allTracks = tracksArea.querySelectorAll('.flex-child');
		allCars.forEach(car => {
			car.removeEventListener('click', this.getSelectedCars);
		})
		allTracks.forEach(track => {
			track.removeEventListener('click', this.getSelectedTrack);
		})
	}
	startDesabled() {
		let startBtn = document.querySelector('.start');
		startBtn.setAttribute('class', 'start');
		startBtn.removeEventListener('click', this.allCarsMoveStart);
	}
	startEbaled() {
		let startBtn = document.querySelector('.start');
		startBtn.setAttribute('class', 'start button-enabled');
		startBtn.addEventListener('click', this.allCarsMoveStart);
	}
	gameAreaRender() {
		let gameArea = document.querySelector('.game-area');
		let game = document.querySelector('#game');
		game.style.backgroundColor = '#' + this.track.color;
		gameArea.style.display = 'block';
		let start = document.createElement('span');
		let startTextNode = document.createTextNode('START');
		let finish = document.createElement('span');
		let finishTextNode = document.createTextNode('FINISH');
		start.appendChild(startTextNode);
		start.setAttribute('class', 'road-start vertical-text');
		finish.appendChild(finishTextNode);
		finish.setAttribute('class', 'road-start vertical-text');

		for (let i = 0; i < this.selectedCars.length; i++) {
			let tr = document.createElement('tr');
			let firstTd = document.createElement('td');
			firstTd.setAttribute('class', 'first-td');
			firstTd.setAttribute('id', 'car-td' + this.carList.indexOf(this.selectedCars[i]));
			let iconWithTrace = this.getTraceCarDiv(this.selectedCars[i]);
			iconWithTrace.setAttribute('id', 'car-id' + i);
			firstTd.appendChild(iconWithTrace);
			let secondTd = document.createElement('td');
			let thirdTd = document.createElement('td');
			if (i === 1) {
				secondTd.appendChild(start);
				thirdTd.appendChild(finish);
			}
			tr.appendChild(firstTd);
			tr.appendChild(secondTd);
			tr.appendChild(thirdTd);
			game.appendChild(tr);
		}
	}
	winnerDiv(carName) {
		let winner = document.querySelector('.winner-text');
		winner.style.display = 'block';
		winner.textContent = 'The winner is ' + carName;
	}
	clearCarsIntervaId() {
		this.selectedCars.forEach(car => {
			clearInterval(car.timerId);
			
		})
	}
	allCarsMoveStart() {
		this.removeEventListeners();
		let newPromise = new Promise((resolve, reject) => {
			setTimeout(this.tracesVisible, 200);
			for (let i = 0; i < this.selectedCars.length; i++) {
				this.selectedCars[i].move('car-id' + i, this.track.factor);
				this.intervalId = setInterval(() => {

					if (this.selectedCars[i].x >= screen.width - screen.width * 15 / 100) {
						this.winnerDiv(this.selectedCars[i].name);
						this.clearCarsIntervaId();	
						this.startDesabled();
						this.tracesHidden();
						resolve(this.intervalId);
					}
				}, 400);
			}

		})
		.then(intervalId => {
			clearInterval(intervalId);
		})
	}
}

let gameApp = new App();
gameApp.trackAreaRender();
gameApp.carAreaRender();
