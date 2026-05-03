import { useNavigate } from "react-router";

export default function Character({ character }) {
  let navigate = useNavigate();
  console.log(character);
  const voice_actors = character.voice_actors;
  const voice_actor_jpn = voice_actors.find((actor) => actor.language == "Japanese")?.person;
  const classes = {
    name_class:
      "absolute bottom-0 left-0 w-full pointer-events-none text-3xs bg-amethyst-smoke-200/70 text-text-light dark:bg-dark-amethyst-smoke-200/70 dark:text-text-dark max-lines-1 cutoff-text-abs",
    role_class: "absolute top-0 right-0 text-3xs bg-amethyst-smoke-200/70 text-text-light dark:bg-dark-amethyst-smoke-200/70 dark:text-text-dark",
    image_class: "w-full aspect-square object-cover hover:cursor-pointer",
  };
  return (
    <>
      <div className="flex flex-col w-1/6 min-w-18 shrink-0">
        <div className="relative">
          <a href={`/character/${character.character.mal_id}`}>
            <img className={classes.image_class} src={character.character.images.jpg.image_url} alt={character.character.name} />
            <div className={classes.name_class}>{character.character.name}</div>
            <div className={classes.role_class}>{character.role}</div>
          </a>
        </div>
        {voice_actor_jpn && (
          <div className="relative">
            <a href={`/people/${voice_actor_jpn.mal_id}`}>
              <img className={classes.image_class} src={voice_actor_jpn.images.jpg.image_url} alt="" />
              <div className={classes.name_class}>{voice_actor_jpn.name}</div>
            </a>
          </div>
        )}
      </div>
    </>
  );
}
