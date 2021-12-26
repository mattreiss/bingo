import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
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
    const renderTableRows = () => {
        const rows: any = []
        for (let i = 1; i <= size / bingo.length; i++) {
            rows.push(
                <TableRow key={i}>
                    {bingo.split('').map((letter, index) => {
                        const offset = index  * size / bingo.length;
                        const number = i + offset;
                        const bingoNumber = `${letter}${number}`;
                        console.log('bingoNumber', bingoNumber);
                        const isCalled = called[bingoNumber];
                        const isLastCalled = lastCalled === bingoNumber;
                        return (
                            <TableCell
                                key={number} 
                                style={{ 
                                    border: '1px solid black', 
                                    backgroundColor: isCalled ? isLastCalled ? 'red' : 'green' : 'rgb(64,64,64)',
                                    color: 'white',
                                    height: 48,
                                    fontSize: 32,
                                    textAlign: 'center',
                                    padding: 0
                                }}>
                                {isCalled ? number : ''}
                            </TableCell>
                        )
                    })}
                </TableRow>
            )
        }
        return rows;
    }

    return (
        <div 
            style={{
                justifyContent: 'center', 
                alignItems:'center',
                backgroundColor: 'black',
                position:'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                top: 0,
                padding: 16
            }}>
            <Stack direction="row" style={{ display: 'flex', flex: 1}}>
                <Stack spacing={2} direction="row" style={{ display: 'flex', flex: 1, justifyContent: 'flex-start' }}>
                    <Button variant="contained" color="error" onClick={restartGame}>
                        <RestartAltIcon />
                    </Button>
                    <Button variant="contained" onClick={pauseGame}>
                        {pause ? <PlayArrowIcon /> : <PauseIcon />}
                    </Button>
                </Stack>
                <div
                    style={{ 
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        color: 'white',
                        padding: 8,
                    }}>
                    {countdown / 1000} second{countdown != 1000 ? 's' : ''}
                </div>
                <Stack spacing={2} direction="row" style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>
                    <Button variant="outlined" onClick={speedUp}>
                        <RemoveIcon />
                    </Button>
                    <div style={{ color: 'white', alignItems: 'center', display: 'flex' }}>
                        {time / 1000} second{time !== 1000 ? 's' : ''}
                    </div>
                    <Button variant="outlined" onClick={slowDown}>
                        <AddIcon />
                    </Button>
                </Stack>
            </Stack>
            <div
                style={{ 
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <div style={{ 
                        padding: 8,
                        margin: 8,
                        fontSize: 48,
                        textAlign: 'center',
                        fontWeight: 'bold',
                        color: 'white',
                        backgroundColor: 'red'
                    }}>
                        {lastCalled}
                    </div>
            </div>
            <TableContainer component={Paper}>
                <Table style={{justifyContent: 'space-evenly'}}>
                    <TableHead>
                        <TableRow>
                            {bingo.split('').map((letter) => (
                                <TableCell 
                                    key={letter} 
                                    style={{ 
                                        minWidth: 40,
                                        textAlign: 'center', 
                                        fontWeight: 'bold',
                                        fontSize: 32,
                                        backgroundColor: 'rgb(232,232,232)'
                                    }}>
                                    {letter}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {renderTableRows()}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default BingoGame;