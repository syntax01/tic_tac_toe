const game_cells = document.querySelectorAll('.game-cell');
const button_reset = document.querySelector('.game-reset');
let player_id = 0;
const player_img = ['/img/hulk.png', '/img/thanos.png'];


button_reset.addEventListener('click', function() {
    player_id = 0;
    game_cells.forEach((div) => {
        div.innerHTML = '';
    })
})

game_cells.forEach(function(div) {
    div.addEventListener('click', function() {
        const img_el = this.querySelector('img');
        if(img_el) return;
        gameClick(this);
    })
})

function gameClick(div) {
    const img_hulk = document.createElement('img');
    img_hulk.setAttribute('src', player_img[player_id]);
    div.appendChild(img_hulk);

    if(player_id === 0) {
        player_id = 1;
    } else {
        player_id = 0;
    }
}