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
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import * as Sounds from '../static/audio';
import { Box, LinearProgress } from '@mui/material';


const bingo = 'BINGO';

function generateBingoNumbers(size: number) {
    const bingoNumbers: string[] = [];
    bingo.split('').forEach((letter, index) => {
        for (let i = 1; i <= size / bingo.length; i++) {
            const offset = index * size / bingo.length;
            const number = i + offset;
            bingoNumbers.push(`${letter}${number}`);
        }
    });
    return bingoNumbers;
}

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
let timeout: any;

const BingoGame: React.FC = () => {
    const [size] = React.useState(75);
    const [bingoNumbers, setBingoNumbers] = React.useState(generateBingoNumbers(size))
    const [game, setGame] = React.useState<string[]>(shuffleArray(bingoNumbers));
    const [index, setIndex] = React.useState(0);
    const [pause, setPause] = React.useState(false);
    const [time, setTime] = React.useState(4000);
    const [countdown, setCountdown] = React.useState(time);

    const restartGame = () => {
        if (index < 1) {
            return;
        }
        clearTimeout(timeout);
        timeout = undefined;
        const newGame = shuffleArray(bingoNumbers);
        setGame(newGame);
        setIndex(0);
        setPause(false);
        if (time == countdown) {
            setCountdown(time + 100);
        } else {
            setCountdown(time);
        }
        sayText(newGame[0]);
    }

    const pauseGame = () => {
        if (!pause) {
            clearTimeout(timeout);
            setCountdown(time + 100);
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
        if (index >= game.length) {
            setPause(true);
        } else if (!pause) {
            if (!timeout && index == 0 && countdown == time) {
                sayText(game[index])
            }
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                if (pause) return;
                if (countdown >= -100) {
                    setCountdown(countdown - 100);
                } else {
                    sayText(game[index + 1])
                    setCountdown(time + 700);
                    setIndex(index + 1);
                }
            }, 100);
        }
    }, [countdown, index, pause, game])

    React.useEffect(() => {
        if (size != bingoNumbers.length) {
            setBingoNumbers(generateBingoNumbers(size));
            restartGame()
        }
    }, [size]);

    const onKeydown = (e: any) => {
        switch (e.key) {
            case 'ArrowDown':
                speedUp();
                break;
            case 'ArrowUp':
                slowDown();
                break;
            case ' ':
                pauseGame();
                break;
            case 'Escape':
                restartGame();
        }
    }

    React.useEffect(() => {
        document.addEventListener('keydown', onKeydown);
        return () => {
            document.removeEventListener('keydown', onKeydown)
        }
    }, [onKeydown]);

    const lastCalled = game[index];
    const called: { [key: string]: boolean } = {};
    for (let i = 0; i <= index; i++) {
        const bingoNumber = game[i];
        called[bingoNumber] = true;
    }
    const renderTableRows = () => {
        const rows: any = []
        for (let i = 1; i <= size / bingo.length; i++) {
            rows.push(
                <TableRow key={i}>
                    {bingo.split('').map((letter, index) => {
                        const offset = index  * size / bingo.length;
                        const number = i + offset;
                        const bingoNumber = `${letter}${number}`;
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
                                    padding: 0,
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
                display: 'flex',
                flex: 1,
                width: '100%',
                flexDirection: 'column',
                alignItems:'stretch',
                backgroundColor: 'black',
                position:'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                top: 0,
                padding: 16
            }}>
            <Stack direction="row" style={{ marginBottom: 16 }}>
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
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        color: 'white',
                        flexDirection: 'column'
                    }}>
                        <div style={{ 
                            width: '100%',
                            padding: 8,
                            marginBottom: 8,
                            fontSize: 32,
                            textAlign: 'center',
                            fontWeight: 'bold',
                            color: 'white',
                            backgroundColor: 'red',
                            borderRadius: 16
                        }}>
                            {lastCalled}
                        </div>
                        <Box sx={{ width: '100%' }}>
                            <LinearProgress variant="determinate" value={100 - (100 * countdown / time)} />
                        </Box>
                </div>
                <Stack direction="row" style={{ display: 'flex', flex: 1, justifyContent: 'flex-end', marginRight: 16 }}>
                    <div style={{ color: 'white', alignItems: 'center', display: 'flex' }}>
                        {parseInt(`${time / 1000}`) + 1}s
                    </div>
                    <Stack direction="column">
                        <Button onClick={slowDown}>
                            <KeyboardArrowUpIcon />
                        </Button>
                        <Button onClick={speedUp}>
                            <KeyboardArrowDownIcon />
                        </Button>
                    </Stack>
                </Stack>
            </Stack>
            <div style={{ paddingBottom: 16, paddingRight: 32, display: 'flex', flex: 1 }}>
                <TableContainer component={Paper}>
                    <Table style={{ height: '100%' }}>
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
        </div>
    )
}

export default BingoGame;