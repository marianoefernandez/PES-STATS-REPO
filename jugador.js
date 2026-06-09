export default class PES6Player {
  constructor({
    // Identificadores
    id = null,
    clubId = null,

    // Atributos personales
    name = "",
    lastName = "",
    nationality = "",
    age = 0,
    height = 0,
    weight = 0,
    foot = "R",
    side = "R",
    injuryTolerance = "B",

    // Posición registrada (una sola)
    registeredPosition = "CF",

    // Posiciones habilitadas
    positions = {},

    // Stats grupo 1 (1–99)
    attack = 50,
    defence = 50,
    balance = 50,
    stamina = 50,
    speed = 50,
    acceleration = 50,
    response = 50,
    agility = 50,
    dribbleAccuracy = 50,
    dribbleSpeed = 50,
    shortPassAccuracy = 50,
    shortPassSpeed = 50,
    longPassAccuracy = 50,
    longPassSpeed = 50,
    shotAccuracy = 50,
    shotPower = 50,
    shotTechnique = 50,
    freeKickAccuracy = 50,
    swerve = 50,
    heading = 50,
    jump = 50,
    technique = 50,
    aggression = 50,
    mentality = 50,
    gkSkills = 50,
    teamwork = 50,

    // Stats grupo 2 (1–8)
    consistency = 4,
    condition = 4,
    weakFootAccuracy = 4,
    weakFootFrequency = 4,

    // Habilidades especiales
    specialSkills = {},
  } = {}) {

    this.id = id;
    this.clubId = clubId;

    this.name = name;
    this.lastName = lastName;
    this.nationality = nationality;
    this.age = age;
    this.height = height;
    this.weight = weight;
    this.foot = foot;
    this.side = side;
    this.injuryTolerance = injuryTolerance;

    this.registeredPosition = registeredPosition;

    this.positions = {
      GK:  false,
      CWP: false,
      CBT: false,
      SB:  false,
      DM:  false,
      WB:  false,
      CM:  false,
      SM:  false,
      AM:  false,
      WG:  false,
      SS:  false,
      CF:  false,
      ...positions,
    };

    this.attack            = attack;
    this.defence           = defence;
    this.balance           = balance;
    this.stamina           = stamina;
    this.speed             = speed;
    this.acceleration      = acceleration;
    this.response          = response;
    this.agility           = agility;
    this.dribbleAccuracy   = dribbleAccuracy;
    this.dribbleSpeed      = dribbleSpeed;
    this.shortPassAccuracy = shortPassAccuracy;
    this.shortPassSpeed    = shortPassSpeed;
    this.longPassAccuracy  = longPassAccuracy;
    this.longPassSpeed     = longPassSpeed;
    this.shotAccuracy      = shotAccuracy;
    this.shotPower         = shotPower;
    this.shotTechnique     = shotTechnique;
    this.freeKickAccuracy  = freeKickAccuracy;
    this.swerve            = swerve;
    this.heading           = heading;
    this.jump              = jump;
    this.technique         = technique;
    this.aggression        = aggression;
    this.mentality         = mentality;
    this.gkSkills          = gkSkills;
    this.teamwork          = teamwork;

    this.consistency       = consistency;
    this.condition         = condition;
    this.weakFootAccuracy  = weakFootAccuracy;
    this.weakFootFrequency = weakFootFrequency;

    this.specialSkills = {
      dribbling:       false,
      tacticalDribble: false,
      positioning:     false,
      reaction:        false,
      playmaking:      false,
      passing:         false,
      scoring:         false,
      oneOnOneScoring: false,
      postPlayer:      false,
      lines:           false,
      middleShooting:  false,
      side:            false,
      centre:          false,
      penalties:       false,
      oneTouchPass:    false,
      outside:         false,
      marking:         false,
      sliding:         false,
      covering:        false,
      dLineControl:    false,
      penaltyStopper:  false,
      oneOnOneStopper: false,
      longThrow:       false,
      ...specialSkills,
    };
  }

  get fullName() {
    return `${this.name} ${this.lastName}`.trim();
  }

  get activePositions() {
    return Object.entries(this.positions)
      .filter(([, active]) => active)
      .map(([pos]) => pos);
  }

  get activeSpecialSkills() {
    return Object.entries(this.specialSkills)
      .filter(([, active]) => active)
      .map(([skill]) => skill);
  }

  getOverallRating()
  {
    //CF --> default    
    let values = [ 10, 0, 5, 1, 4, 4, 9, 0, 4, 1, 3,1, 0, 0, 17, 8, 5, 10, 4, 8, 6, 0];
    switch(this.registeredPosition)
    {
      case "SS":
        values = [9, 0, 4, 2, 6, 7, 8, 0, 7, 2, 5,1, 0, 0, 13, 7, 5, 5, 2, 10, 7, 0]
        break;
      case "WG":
        values = [6, 0, 1, 3, 7, 7, 5, 3, 12, 7, 5,1, 2, 1, 8, 5, 5, 0, 2, 12, 8, 0]
        break;
      case "AM":
        values = [6, 0, 0, 2, 4, 5, 4, 6, 11, 4, 15, 3, 6, 2, 5, 2, 7, 0, 0, 15, 3, 0]
        break;
      case "CM":
        values = [4, 5, 2, 9, 2, 2, 6, 0, 7, 2, 15, 3, 13, 3, 2, 3, 6, 0, 0, 15, 1, 0];
        break;
      case "SM":
        values = [5, 0, 0, 6, 7, 7, 3, 3, 12, 6, 7,3, 8, 5, 3, 2, 4, 0, 0, 12, 7, 0];
        break;
      case "SB":
      case "WB":
        values = [3, 6, 2, 16, 9, 9, 4, 3, 3, 5, 6, 2, 10, 6, 0, 0, 0, 2, 3, 7, 4, 0];
        break;
      case "CBT":
      case "CWP":
        values = [0, 40, 15, 1, 3, 0, 18, 0, 0, 0, 2,0, 1, 0, 0, 0, 0, 12, 5, 3, 0, 0]
        break;
    }
    const overallRating = this.getRating(values.map(value => value / 100));

    return overallRating
  }

  getRating(values)
  {
    return Math.round((
        this.attack * values[0] +
        this.defence * values[1] +
        this.balance * values[2] +
        this.stamina * values[3] +
        this.speed * values[4] +
        this.acceleration * values[5] +
        this.response * values[6] +
        this.agility * values[7] +
        this.dribbleAccuracy * values[8] +
        this.dribbleSpeed * values[9] +
        this.shortPassAccuracy * values[10] +
        this.shortPassSpeed * values[11] +
        this.longPassAccuracy * values[12] +
        this.longPassSpeed * values[13] +
        this.shotAccuracy * values[14] +
        this.shotPower * values[15] +
        this.shotTechnique * values[16] +
        this.heading * values[17] +
        this.jump * values[18] +
        this.technique * values[19] +
        this.aggression * values[20] +
        this.gkSkills * values[21]
    ));
  }

  async getCardObject(rating = 1)
  {
    const clubFoto = `fotos/clubes/${this.clubId}.webp`;
    const fotoPais = `fotos/nacionalidades/${this.nationality}.png`;
    let foto = `fotos/jugadores/${this.id}.webp`;

    const fotoStatus = (await fetch(foto)).status;

    if(fotoStatus == 404)
    {
      foto = `fotos/jugadores/0.webp`;
    }

    const PAC = Math.round((this.speed * 1.01 + this.acceleration * 0.99) / 2);
    const DRI = Math.round((this.dribbleAccuracy * 1.2 + this.dribbleSpeed * 0.6 + this.agility + this.technique * 1.2) / 4);
    const SHO = Math.round((this.attack * 1.2 + this.shotAccuracy * 1.2 + this.shotPower + this.shotTechnique * 0.8 + this.aggression * 0.8) / 5);
    const PAS = Math.round((this.shortPassAccuracy * 1.5 + this.shortPassSpeed * 0.5 + this.longPassAccuracy * 1.5 + this.longPassSpeed * 0.5 + this.freeKickAccuracy + this.swerve) / 6);
    const DEF = Math.round((this.defence * 1.5 + this.response * 0.5) / 2);
    const PHY = Math.round((this.balance * 1.4 + this.stamina * 1.4 + this.jump * 0.6 + this.response * 0.6) / 4);
    const WF = Math.round(((this.weakFootAccuracy * 1.5 + this.weakFootFrequency * 0.5) / 2) / 1.6);

    return { name: this.lastName, photo:foto,clubLogo:clubFoto,nationLogo:fotoPais,rating: rating, pos: this.registeredPosition,  pac: PAC, sho: SHO, pas: PAS, dri: DRI, def: DEF, phy: PHY, weakFoot: WF, dominantFoot:this.foot };

  }

}