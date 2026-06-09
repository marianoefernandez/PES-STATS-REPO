import PES6Player from './jugador.js'

export function parsePES6PlayersFromCSV(csvContent) {
  const lines = csvContent
    .split("\n")
    .map(l => l.trim())
    .filter(l => l.length > 0);

  const headers = lines[0].split(",");

  const get = (row, key) => {
    const idx = headers.indexOf(key);
    return idx !== -1 ? row[idx]?.trim() : "";
  };

  const toInt = (val) => val ? parseInt(val, 10) : 0;

  const positionKeys = ["GK","CWP","CBT","SB","DM","WB","CM","SM","AM","WG","SS","CF"];

  const specialSkillKeys = [
    "dribbling","tacticalDribble","positioning","reaction","playmaking",
    "passing","scoring","oneOnOneScoring","postPlayer","lines",
    "middleShooting","side","centre","penalties","oneTouchPass",
    "outside","marking","sliding","covering","dLineControl",
    "penaltyStopper","oneOnOneStopper","longThrow",
  ];

  return lines.slice(1).map(line => {
    const row = line.split(",");

    // --- Posiciones ---
    const positionsRaw = get(row, "positions").toUpperCase().split("-").map(s => s.trim());
    const positions = {};
    positionKeys.forEach(p => {
      positions[p] = positionsRaw.includes(p);
    });

    // --- Special Skills ---
    
    const skillsRaw = get(row, "specialSkills").split("-").map(s => s.trim());
    const specialSkills = {};
    specialSkillKeys.forEach(s => {
      specialSkills[s] = skillsRaw.includes(s);
    });

    return new PES6Player({
      id:                  get(row, "id")               || null,
      clubId:             get(row, "clubId")           || null,
      name:                get(row, "name"),
      lastName:            get(row, "lastName"),
      nationality:         get(row, "nationality"),
      age:                 toInt(get(row, "age")),
      height:              toInt(get(row, "height")),
      weight:              toInt(get(row, "weight")),
      foot:                get(row, "foot")              || "R",
      side:                get(row, "side")              || "R",
      injuryTolerance:     get(row, "injuryTolerance")   || "B",
      registeredPosition:  get(row, "registeredPosition")|| "CF",
      positions,
      attack:              toInt(get(row, "attack")),
      defence:             toInt(get(row, "defence")),
      balance:             toInt(get(row, "balance")),
      stamina:             toInt(get(row, "stamina")),
      speed:               toInt(get(row, "speed")),
      acceleration:        toInt(get(row, "acceleration")),
      response:            toInt(get(row, "response")),
      agility:             toInt(get(row, "agility")),
      dribbleAccuracy:     toInt(get(row, "dribbleAccuracy")),
      dribbleSpeed:        toInt(get(row, "dribbleSpeed")),
      shortPassAccuracy:   toInt(get(row, "shortPassAccuracy")),
      shortPassSpeed:      toInt(get(row, "shortPassSpeed")),
      longPassAccuracy:    toInt(get(row, "longPassAccuracy")),
      longPassSpeed:       toInt(get(row, "longPassSpeed")),
      shotAccuracy:        toInt(get(row, "shotAccuracy")),
      shotPower:           toInt(get(row, "shotPower")),
      shotTechnique:       toInt(get(row, "shotTechnique")),
      freeKickAccuracy:    toInt(get(row, "freeKickAccuracy")),
      swerve:              toInt(get(row, "swerve")),
      heading:             toInt(get(row, "heading")),
      jump:                toInt(get(row, "jump")),
      technique:           toInt(get(row, "technique")),
      aggression:          toInt(get(row, "aggression")),
      mentality:           toInt(get(row, "mentality")),
      gkSkills:            toInt(get(row, "gkSkills")),
      teamwork:            toInt(get(row, "teamwork")),
      consistency:         toInt(get(row, "consistency")),
      condition:           toInt(get(row, "condition")),
      weakFootAccuracy:    toInt(get(row, "weakFootAccuracy")),
      weakFootFrequency:   toInt(get(row, "weakFootFrequency")),
      specialSkills,
    });
  });
}


export function parsePES6PlayerFromTxt(txtContent) {
  const lines = txtContent
    .split("\n")
    .map(l => l.trim())
    .filter(l => l.length > 0);

  // Helpers
  const findValue = (key) => {
    const line = lines.find(l =>
      l.toLowerCase().startsWith(key.toLowerCase() + ":")
    );
    return line ? line.split(":").slice(1).join(":").trim() : null;
  };

  const toInt = (val) => val ? parseInt(val, 10) : 0;

  // --- Alias de posiciones ---
  const normalizePosition = (p) => {
    const aliases = {
      "WF": "WG",
    };
    return aliases[p] || p;
  };

  // --- Nombre y apellido ---
  const fullName = findValue("Name") || "";
  const nameParts = fullName.split(" ");
  const lastName = nameParts.pop() || "";
  const name = nameParts.join(" ");

  // --- Nationality ---
  const nationality = findValue("Nationality") || "";

  // --- Age / Height / Weight ---
  const age    = toInt(findValue("Age"));
  const height = toInt(findValue("Height"));
  const weight = toInt(findValue("Weight"));

  // --- Injury Tolerance / Foot / Side ---
  const injuryTolerance = findValue("Injury Tolerance") || "B";
  const foot = findValue("Foot") || "R";
  const side = findValue("Side") || "R";

  // --- Posiciones ---
  const positionsRaw = findValue("Positions") || "";
  const positionKeys = ["GK","CWP","CBT","SB","DM","WB","CM","SM","AM","WG","SS","CF"];
  const positions = {};
  positionKeys.forEach(p => {
    positions[p] = positionsRaw
      .toUpperCase()
      .split(",")
      .map(s => normalizePosition(s.trim()))
      .includes(p);
  });

  // --- Registered Position ---
  const regRaw = findValue("Registred Positions") || findValue("Registered Positions") || "";
  const registeredPosition = normalizePosition(regRaw.replace("★", "").trim()) || "CF";

  // --- Stats grupo 1 (1-99) ---
  const statMap1 = {
    attack:            "Attack",
    defence:           "Defence",
    balance:           "Balance",
    stamina:           "Stamina",
    speed:             "Speed",
    acceleration:      "Acceleration",
    response:          "Response",
    agility:           "Agility",
    dribbleAccuracy:   "Dribble Accuracy",
    dribbleSpeed:      "Dribble Speed",
    shortPassAccuracy: "Short Pass Accuracy",
    shortPassSpeed:    "Short Pass Speed",
    longPassAccuracy:  "Long Pass Accuracy",
    longPassSpeed:     "Long Pass Speed",
    shotAccuracy:      "Shot Accuracy",
    shotPower:         "Shot Power",
    shotTechnique:     "Shot Technique",
    freeKickAccuracy:  "Free Kick Accuracy",
    swerve:            "Swerve",
    heading:           "Heading",
    jump:              "Jump",
    technique:         "Technique",
    aggression:        "Aggression",
    mentality:         "Mentality",
    gkSkills:          "GK Skills",
    teamwork:          "Team work",
  };

  const stats1 = {};
  for (const [prop, label] of Object.entries(statMap1)) {
    stats1[prop] = toInt(findValue(label));
  }

  // --- Stats grupo 2 (1-8) ---
  const consistency       = toInt(findValue("Consistency"));
  const conditionRaw      = findValue("Condition") || findValue("Condition/Fitness");
  const condition         = toInt(conditionRaw);
  const weakFootAccuracy  = toInt(findValue("Weak Foot Accuracy"));
  const weakFootFrequency = toInt(findValue("Weak Foot Frequency"));

  // --- Special Skills ---
  const specialSkillsMap = {
    dribbling:       "Dribbling",
    tacticalDribble: "Tactical dribble",
    positioning:     "Positioning",
    reaction:        "Reaction",
    playmaking:      "Playmaking",
    passing:         "Passing",
    scoring:         "Scoring",
    oneOnOneScoring: "1-1 Scoring",
    postPlayer:      "Post player",
    lines:           "Lines",
    middleShooting:  "Middle shooting",
    side:            "Side",
    centre:          "Centre",
    penalties:       "Penalties",
    oneTouchPass:    "1-Touch pass",
    outside:         "Outside",
    marking:         "Marking",
    sliding:         "Sliding",
    covering:        "Covering",
    dLineControl:    "D-Line control",
    penaltyStopper:  "Penalty stopper",
    oneOnOneStopper: "1-On-1 stopper",
    longThrow:       "Long throw",
  };

  const activeSkillLines = lines
    .filter(l => l.startsWith("★"))
    .map(l => l.replace("★", "").trim().toLowerCase());

  const specialSkills = {};
  for (const [prop, label] of Object.entries(specialSkillsMap)) {
    specialSkills[prop] = activeSkillLines.includes(label.toLowerCase());
  }

  // --- Instanciar ---
  return new PES6Player({
    name,
    lastName,
    nationality,
    age,
    height,
    weight,
    foot,
    side,
    injuryTolerance,
    registeredPosition,
    positions,
    ...stats1,
    consistency,
    condition,
    weakFootAccuracy,
    weakFootFrequency,
    specialSkills,
  });
}