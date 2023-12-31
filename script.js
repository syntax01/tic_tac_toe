let player1;
let player2;
let game;

// Character type selection
const character_select = document.querySelector('#character-select');
character_select.addEventListener('change', function(el) {
    // Reset any input/selection
    const player_name = document.querySelectorAll('.player-name');
    player_name.forEach(el => el.textContent = '');
    const button_start = document.querySelector('.game-start');
    button_start.classList.add('hide');
    // change images
    console.log(this.value);
    const player_grid = document.querySelectorAll('.player-grid');
    if(this.value === 'heros') {
        player_grid[0].innerHTML = `
        <img src="./img/captain_america.png" alt="">
        <img src="./img/black_panther.png" alt="">
        <img src="./img/hulk.png" alt="">
        <img src="./img/black_widow.png" alt="">`
        player_grid[1].innerHTML = `
        <img src="./img/spiderman.png" alt="">
        <img src="./img/she_hulk.png" alt="">
        <img src="./img/groot.png" alt="">
        <img src="./img/ironman.png" alt="">`
    } else {
        player_grid[0].innerHTML = `
        <img src="./img/hedgehog.png" alt="">
        <img src="./img/llama.png" alt="">
        <img src="./img/dinosaur.png" alt="">
        <img src="./img/octopus.png" alt="">`
        player_grid[1].innerHTML = `
        <img src="./img/raccoon.png" alt="">
        <img src="./img/tiger.png" alt="">
        <img src="./img/giraffe.png" alt="">
        <img src="./img/chick.png" alt="">`
    }
    addPlayerSelectionAction();
})

// Game start/reset button
const button_start = document.querySelector('.game-start');
button_start.addEventListener('click', function() {
    if(!game) {
        // Create player objects
        const players = document.querySelectorAll('.player-name');
        player1 = new Player(players[0].textContent, players[0].getAttribute('data-img-src'));
        player2 = new Player(players[1].textContent, players[1].getAttribute('data-img-src'));
        game = new GameBoard(player1, player2);
        // From now on, this button will just restart the game
        this.textContent = 'Restart Game';     
    }
    game.startGame();
})

function addPlayerSelectionAction() {
    const player_select_img = document.querySelectorAll('.player-grid > img');
    player_select_img.forEach(function(el) {
        el.addEventListener('click', function() {
            // closests means "look up for this element"
            // Parse image name into display name (underscore=space, upper-case first letter)
            const player_selection = this.closest('.player-selection');
            const player_name = player_selection.querySelector('.player-name');
            let img_name = this.getAttribute('src');
            player_name.setAttribute('data-img-src', img_name);
            img_name = img_name.replace('./img/','').replace('.png','').replace('_', ' ');
            img_name_split = img_name.split(' ');
            img_name = null;
            img_name_split.forEach(function(s) {
                s = s.substr(0, 1).toUpperCase() + s.substr(1).toLowerCase();
                if(img_name) {
                    img_name += ' ' + s;
                } else {
                    img_name = s;
                }
            });
            player_name.textContent = img_name;
            // Check to enable start game - have both players selected
            const player_names = document.querySelectorAll('.player-name');
            let count = 0;
            player_names.forEach(function(el) {
                if(el.textContent.length > 0) {
                    count++
                }
            });
            if(count === 2) {
                button_start.textContent = 'Start Game';
                button_start.classList.remove('hide');
            }
        })
    })
}
addPlayerSelectionAction();


// Game functionality
function GameBoard(player1, player2) {
    let game_cells;
    let currentPlayer;
    let isGameOver;
    let plays_count;
    const game_container = document.querySelector('.container-game');
    const game_board = document.createElement('div');
    game_board.classList.add('game-board');
    game_container.innerHTML = '';
    game_container.appendChild(game_board);
    const game_status = document.querySelector('.game-status');
    const plays_max = 9;
    
    function startGame() {
        // Reset game board/state
        isGameOver = false;
        button_start.classList.add('hide');
        game_board.innerHTML = '';
        currentPlayer = player1;
        game_status.textContent = 'Current Player: ' + currentPlayer.player_name;
        game_cells = [];
        player1.game_positions = [];
        player2.game_positions = [];
        plays_count = 0;
        // Create game cell divs
        for(let i = 1; i < 10; i++) {
            // Create game_cell
            const game_cell = document.createElement('div');
            game_cell.classList.add('game-cell');
            game_cell.classList.add('cell-hover');
            game_cell.setAttribute('data-cell', i);
            game_board.appendChild(game_cell);
            // game_cell click
            game_cell.addEventListener('click', function() {
                gameCellClick(game_cell);
            });
            game_cells.push(game_cell);
        }
    }

    function gameCellClick(game_cell) {
        if(isGameOver) {
            console.log('Game is over');
            return;
        }
        // Check if img element exists, if so, do nothing
        const ignoreClick = game_cell.hasAttribute('data-player');
        if(ignoreClick) {
            console.log('player already assigned, do nothing');
            return;
        }
        // Increment play count
        plays_count++;
        // Create img element
        const cell_img = document.createElement('img');
        cell_img.setAttribute('src', currentPlayer.player_img);
        game_cell.appendChild(cell_img);
        // Remove hover effect (cant select this cell again)
        game_cell.classList.remove('cell-hover');
        // Add cell id to player position list
        const cell_id = game_cell.getAttribute('data-cell');
        currentPlayer.game_positions.push(cell_id);
        // Check for game winner
        const game_winner = checkGameStatus();
        if(game_winner) {
            endGame(currentPlayer.player_name + ' Wins!');
        } else if(plays_count === plays_max) {
            endGame('Tie Game!');
        } else {
            // Switch current player
            currentPlayer = currentPlayer === player1 ? player2 : player1;
            game_status.textContent = 'Current Player: ' + currentPlayer.player_name;
        }
    }

    function checkGameStatus() {

        const winners = ['123','456','789','147','258','369','159','357'];
        for(let i = 0; i < winners.length; i++) {
            const winner_split = winners[i].split('');
            const isWinner = winner_split.every(el => currentPlayer.game_positions.includes(el));
            if(isWinner) {
                return currentPlayer;
            }
        }

    }

    function endGame(status_message) {
        isGameOver = true;
        game_cells.forEach(el => el.classList.remove('cell-hover'));
        button_start.classList.remove('hide');
        game_status.textContent = status_message;
    }

    return {
        startGame
    }
}

function Player(player_name, player_img) {
    this.player_name = player_name,
    this.player_img = player_img,
    this.game_positions = [];
}