import * as React from 'react';
// import AudioPlayer from '../util/AudioPlayer';
import * as Sounds from '../static/audio';


const bingo = 'BINGO';
const size = 80;

const bingoNumbers: string[] = [];
bingo.split('').forEach((letter, index) => {
    for (let i = 1; i <= size / bingo.length; i++) {
        const offset = index * size / bingo.length;
        const number = i + offset;
        bingoNumbers.push(`${letter}${number}`);
    }
});

function shuffleArray(_array: string[]) {
	const array = [..._array];
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
	return array;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let timeout1: any, timeout2: any;

const BingoGame: React.FC = () => {
	const [game, setGame] = React.useState<string[]>(shuffleArray(bingoNumbers));
	const [index, setIndex] = React.useState(0);
    const [pause, setPause] = React.useState(false);
	const [time, setTime] = React.useState(5000);
    const [countdown, setCountdown] = React.useState(time);

    const restartGame = () => {
        clearTimeout(timeout1);
        clearTimeout(timeout2);
        setGame(shuffleArray(bingoNumbers));
        setIndex(0);
        setPause(false);
        setCountdown(time);
    }

    const pauseGame = () => {
        if (!pause) {
            clearTimeout(timeout1);
            clearTimeout(timeout2);
            setCountdown(0);
        }
        setPause(!pause)
    }

    const slowDown = () => {
        if (time + 1000 < 30000) {
            setTime(time + 1000);
        }
    }

    const speedUp = () => {
        if (time - 1000 > 0) {
            setTime(time - 1000);
        }
    }

	const sayText = (text: string) => {
        console.log('text', text);
        const audio = new Audio((Sounds as any)[text]);
        audio.play();
	}

	React.useEffect(() => {
		if (!pause && index < game.length) {
            sayText(game[index])
            setCountdown(time);
			timeout1 = setTimeout(() => {
                if (!pause) {
                    setIndex(index + 1);
                }
			}, time);
		}
	}, [index, pause]);

    React.useEffect(() => {
		if (!pause) {
			timeout2 = setTimeout(() => {
                if (pause) return;
                if (countdown - 1000 > 0) {
                    setCountdown(countdown - 1000);
                }
			}, 1000);
		}
    }, [countdown])

    const lastCalled = game[index];
	const called: { [key: string]: boolean } = {};
	for (let i = 0; i <= index; i++) {
		const bingoNumber = game[i];
		called[bingoNumber] = true;
	}
	console.log('called', called);

    return (
        <div 
            style={{
                justifyContent: 'center', 
                alignItems:'center'
            }}>
            <div style={{ display: 'flex', justifyContent: 'space-evenly', padding: 16 }}>
                <button onClick={restartGame}>New Game</button>
                <button onClick={pauseGame}>{pause ? 'Play' : 'Pause'}</button>
                <button onClick={slowDown}>Slow Down</button>
                <button onClick={speedUp}>Hurry Up</button>
            </div>
            <div
                style={{ 
                    padding: '16px 0px',
                    textAlign: 'center',
                }}>
                {countdown / 1000} second{countdown != 1000 ? 's' : ''}
            </div>
            <div
                style={{ 
                    fontSize: '32pt',
                    padding: '16px 0px',
                    textAlign: 'center',
                    backgroundColor: 'red',
                    color: 'white'
                }}>
                {lastCalled}
            </div>
            <table
                style={{ 
                    display: 'flex',
                    flex: 1,
                    justifyContent: 'space-evenly', 
                    alignItems:'center',
                    fontSize: '24pt',
                    textAlign: 'center',
                    backgroundColor: 'white'
                }}>
                <tbody style={{
                    display: 'flex',
                    flex: 1,
                    justifyContent: 'space-evenly', 
                    alignItems:'center'}}>
                {bingo.split('').map((letter, index) => {
                    const boxes = []
                    for (let i = 1; i <= size / bingo.length; i++) {
                        const offset = index * size / bingo.length;
                        const number = i + offset;
                        const bingoNumber = `${letter}${number}`;
                        const isCalled = called[bingoNumber];
                        const isLastCalled = lastCalled === bingoNumber;
                        boxes.push(
                            <td
                                key={number} 
                                style={{ 
                                    border: '1px solid black', 
                                    padding: '8px',
                                    minWidth: '40px',
                                    minHeight: '40px',
                                    backgroundColor: isCalled ? isLastCalled ? 'red' : 'green' : 'transparent',
                                    color: 'white'
                                }}>
                                {isCalled ? number : ''}
                            </td>
                        )
                    }
                    return (
                        <td>
                            <th style={{ textAlign: 'left', minWidth: '40px', padding: '8px' }}>
                                {letter}
                            </th>
                            <td style={{ display: 'flex', flexDirection: 'column'}}>
                                {boxes}
                            </td>
                        </td>
                    )
                })}
                </tbody>
            </table>
        </div>
    )
}

export default BingoGame;