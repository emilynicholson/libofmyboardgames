const grid = document.querySelector('#grid');
const search = document.querySelector('#search');
const playerSelect = document.querySelector('#players');
const timeSelect = document.querySelector('#time');
const resultCount = document.querySelector('#result-count');
const empty = document.querySelector('#empty');
const gameDialog = document.querySelector('#game-dialog');
const closeDialogButton = document.querySelector('.dialog-close');

const descriptions = {
  'super-mario-labyrinth': 'Race through a shifting maze to find familiar Super Mario characters and treasures. Plan your route carefully as the paths change.',
  'operation': 'Use the tweezers to remove silly ailments from the patient without touching the sides and setting off the buzzer.',
  'codenames': 'Two teams compete to find their secret agents. Give one word clues that connect several words on the table, while avoiding the assassin.',
  'munchkin-adventure-time': 'A humorous fantasy card adventure in the Land of Ooo. Fight monsters, collect loot, and try to be the first to reach level 10.',
  'oh-my-pigeons': 'A lighthearted pigeon-filled party game. Play cards to attract pigeons and try to fill your bench before the other players do.',
  'adventure-time-card-wars': 'A two-player card battle between Finn and Jake. Build up your lands, summon creatures, and use cards to outwit your opponent.',
  'fake-swords': 'A silly, energetic party game built around pretend sword fights and quick challenges. Clear a little space and get ready to move.',
  'bananagrams': 'Race to build your own crossword grid from letter tiles. Rearrange your words as often as you like, and shout “Peel” when you use them all.',
  'cheating-moth': 'A sneaky card game where players try to get rid of their cards. Cheating is allowed—as long as the watchful guard does not catch you.',
  'cockroach-poker': 'A bluffing game of passing cards and calling bluffs. Give an opponent a card face down and claim it is an animal; they must decide whether to believe you.',
  'taco-cat-goat-cheese-pizza-on-the-flip-side': 'Take turns saying the five words in the title while flipping cards. If the spoken word matches the card, slap the pile—just watch for special cards.',
  'dobble-connect': 'Spot the one matching symbol between cards and connect them to your team’s line. Quick eyes and quick hands help you win.',
  'uno-no-mercy': 'A tougher, more chaotic take on UNO, with extra draw cards and harsher penalties. Play matching cards and try to empty your hand first.',
  'waddingtons-playing-cards': 'A standard deck of playing cards for familiar games such as snap, rummy, or patience. The player count and length depend on the game you choose.',
  'horse-playing-cards': 'A standard deck featuring horses. Use it for classic card games; the number of players and play time depend on which game you play.',
  'jenga': 'Take turns removing and stacking blocks while trying to keep the tower standing. The player who makes it topple loses.',
  'exploding-kittens-nsfw': 'A strategic, silly card game of avoiding the exploding kitten. Draw cards, use action cards, and try to stay in the game longer than everyone else.',
  'kittin': 'Description coming soon',
  'rainbow-rage': 'Description coming soon.',
  'cat-card-game-tin': 'Description coming soon.',
  'barbecubes': 'Description coming soon.',
  'tinderblox': 'Description coming soon.',
  'tic-tac-trek': 'Description coming soon.',
  'the-mind': 'Work together to play numbered cards in ascending order without speaking or sharing information about your hands. Try to complete every level as a team.',
  'adventure-time-top-trumps': 'Compare the characters’ stats and decide which one gives you the best chance of winning each round.',
  'uno-flip': 'A double-sided version of UNO. Play matching cards as usual, but a Flip card turns over everyone’s hands and the draw pile to reveal a tougher side.',
  'taco-cat-card-game': 'Description coming soon.',
  'giddy-up': 'Description coming soon',
  'horses-ponies-playing-cards': 'A standard deck of playing cards decorated with horses and ponies. Choose a familiar card game to play; player count and length will vary.',
  'kluster': 'Description coming soon.',
  'beat-that': 'Take on quick, ridiculous physical challenges using everyday objects. Predict how well you will do, then see who can beat the challenge.',
  'p-for-pizza': 'A fast, cheesy word game. Race to think of words that fit the letter and category prompts and build your pizza.',
  'four-in-a-row': 'Drop counters into the grid and try to be the first to make a line of four horizontally, vertically, or diagonally.',
  'good-face-bad-face': 'A party game about reading expressions and judging reactions. The box supports 2–5 players; follow its cards to see who reads the room best.',
  'you-cant-say-umm': 'Describe strange things without saying “umm” or hesitating while your team tries to guess. Keep talking until the timer runs out.',
  'calm-your-tits': 'A silly card game for adults. The photo describes it as a pairs game; check the rules for how to make and score pairs.',
  'throw-throw-burrito': 'Collect matching sets of cards, then duck, dodge, and throw the soft burritos when a burrito battle starts.',
  'bears-vs-babies': 'Build strange monsters from cards to fight the invading babies. Make your creations powerful enough to win the battles.',
  'linkee-4': 'A trivia party game: solve a set of questions, then work out the link between the answers. Be the first team to call out the connection.',
  'herd-mentality': 'Try to write the same answer as everyone else. Match the herd to score cows, but avoid being the odd one out.',
  'next-station-london': 'Draw a route through London’s stations on your map, aiming to connect useful stops and score the most points over several rounds.',
  'colour-brain': 'Answer trivia questions using colours rather than words. Work out which colours match the clues and score points for correct answers.',
  'block-party': 'Build a shape from blocks while another player tries to guess what you are making. Grab pieces, create, and see who can communicate best.',
  'chicken-vs-hotdog': 'A lively family action game where players flick the chicken and hotdog characters and race to stick them to the target.',
  'buffet-boss': 'Stack a tower of food without letting it topple. Keep your hands steady as the buffet grows taller.',
  'six-second-scribbles': 'Draw a prompt in just six seconds and see if the others can guess what you sketched. Fast doodles and quick guesses win.',
  'penguin-trap': 'Spin the wheel and carefully break away ice blocks while trying not to make the penguin fall through.',
};

function canPlayWith(playerRange, count) {
  if (/^varies/i.test(playerRange)) return count >= 2;
  if (/^multi-player/i.test(playerRange)) return count >= 2;

  const match = playerRange.match(/(\d+)\s*(?:[–—-]\s*(\d+))?\s*(\+)?/);
  if (!match) return false;

  const minimum = Number(match[1]);
  const maximum = match[3] ? Infinity : Number(match[2] || match[1]);

  return count >= minimum && count <= maximum;
}
let activeTag = 'all';

function render() {
  const query = search.value.trim().toLowerCase();
  const selectedPlayers = playerSelect.value;
  const selectedTime = timeSelect.value;

  const games = GAMES.filter((game) => {
    const matchesSearch = game.title.toLowerCase().includes(query);
    const matchesPlayers =
      selectedPlayers === 'all' ||
      canPlayWith(game.players, Number(selectedPlayers));

    const matchesTime =
      selectedTime === 'all' ||
      (game.minutes !== null &&
        (selectedTime === '15'
          ? game.minutes <= 15
          : selectedTime === '30'
            ? game.minutes > 15 && game.minutes <= 30
            : selectedTime === '60'
              ? game.minutes > 30 && game.minutes <= 60
              : game.minutes > 60));

    const matchesTag = activeTag === 'all' || game.tags.includes(activeTag);

    return matchesSearch && matchesPlayers && matchesTime && matchesTag;
  });

  grid.innerHTML = games
    .map(
      (game) => `
        <article
          class="game-card"
          id="${game.id}"
          role="button"
          tabindex="0"
          aria-haspopup="dialog"
          aria-label="View details for ${game.title}"
        >
          <div class="game-image">
            <img
              src="images/photo-${String(game.image).padStart(2, '0')}.jpg"
              alt="${game.title} game box"
              loading="lazy"
            >
          </div>
          <div class="game-body">
            <div class="game-type">${game.tags.join(' · ')}</div>
            <h3>${game.title}</h3>
            <div class="meta">
              <span>♟ &nbsp;<b>${game.players}</b> players</span>
              <span>◷ &nbsp;<b>${game.time}</b></span>
            </div>
            <span class="card-hint">Tap for details ↗</span>
          </div>
        </article>
      `,
    )
    .join('');

  resultCount.textContent = `${games.length} ${games.length === 1 ? 'game' : 'games'}`;
  empty.hidden = games.length > 0;
}

function openGameDetails(gameId) {
  const game = GAMES.find((item) => item.id === gameId);
  if (!game) return;

  const image = document.querySelector('#dialog-image');
  image.src = `images/photo-${String(game.image).padStart(2, '0')}.jpg`;
  image.alt = `${game.title} game box`;
  document.querySelector('#dialog-tag').textContent = game.tags.join(' · ');
  document.querySelector('#dialog-title').textContent = game.title;
  document.querySelector('#dialog-players').textContent = game.players;
  document.querySelector('#dialog-time').textContent = game.time;
  document.querySelector('#dialog-description').textContent =
    descriptions[game.id] || 'Description coming soon.';

  gameDialog.showModal();
}

grid.addEventListener('click', (event) => {
  const card = event.target.closest('.game-card');
  if (card) openGameDetails(card.id);
});

grid.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  const card = event.target.closest('.game-card');
  if (!card) return;

  event.preventDefault();
  openGameDetails(card.id);
});

closeDialogButton.addEventListener('click', () => gameDialog.close());
gameDialog.addEventListener('click', (event) => {
  if (event.target === gameDialog) gameDialog.close();
});

search.addEventListener('input', render);
playerSelect.addEventListener('change', render);
timeSelect.addEventListener('change', render);

document.querySelector('#clear').addEventListener('click', () => {
  search.value = '';
  playerSelect.value = 'all';
  timeSelect.value = 'all';
  activeTag = 'all';

  document.querySelectorAll('.chip').forEach((chip) => {
    chip.classList.toggle('active', chip.dataset.tag === 'all');
  });

  render();
});

document.querySelectorAll('.chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    activeTag = chip.dataset.tag;

    document.querySelectorAll('.chip').forEach((item) => {
      item.classList.toggle('active', item === chip);
    });

    render();
  });
});

const gameId = new URLSearchParams(location.search).get('game');

render();

if (gameId) {
  setTimeout(() => {
    const gameCard = document.getElementById(gameId);

    gameCard?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    gameCard?.classList.add('highlight');
  }, 250);
}


