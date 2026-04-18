const GEMINI_API_KEY = "AIzaSyBjWrzmvercTNk-GwvteLmNi_gUR8LbK-o";
const ADMIN_PASSWORD = "Lemon1429!";

// --- Global State ---
let state = {
    health: 50,
    economy: 50,
    hope: 50,
    security: 50,
    milestones: { work: false, court: false, greencard: false, citizen: false },
    aiEnabled: false
};

// Database structure for cards
let db = {
    cards: []
};

// Default fallback cards if AI is disabled or fails
const defaultCards = [
    {
        "title": "El Lenguaje Oficial",
        "desc": "Recibes un formulario de actualizaci\u00f3n de USCIS con lenguaje t\u00e9cnico incomprensible. Un error puede ser fatal para tu caso.",
        "svg": "<svg viewBox='0 0 100 100'><rect x='20' y='10' width='60' height='80' fill='none' stroke='black' stroke-width='3'/><path d='M30 30 L70 30 M30 50 L70 50 M30 70 L50 70' stroke='black' stroke-width='3'/></svg>",
        "right": {
            "text": "Pagar a un traductor",
            "effect": {
                "economy": -20,
                "security": 15,
                "health": -10,
                "hope": 10
            },
            "msg": "Aseguras que el documento vaya perfecto al gobierno y evitas errores t\u00e9cnicos."
        },
        "left": {
            "text": "Usar app gratuita",
            "effect": {
                "economy": 15,
                "security": -20,
                "health": 10,
                "hope": -15
            },
            "msg": "Vives con el miedo constante de haber cometido un error que detone tu deportaci\u00f3n."
        }
    },
    {
        "title": "El Techo de Cristal",
        "desc": "Una empresa descubre tu talento y te ofrece el trabajo de tus sue\u00f1os, pero el sistema exige un estatus que el I-220A no te garantiza.",
        "svg": "<svg viewBox='0 0 100 100'><path d='M20 80 L20 40 L50 20 L80 40 L80 80 Z' fill='none' stroke='black' stroke-width='3'/><rect x='40' y='60' width='20' height='20' fill='none' stroke='black' stroke-width='3'/><line x1='10' y1='10' x2='90' y2='30' stroke='black' stroke-width='4'/></svg>",
        "right": {
            "text": "Rogar por patrocinio",
            "effect": {
                "hope": -15,
                "health": -10,
                "security": 10,
                "economy": 10
            },
            "msg": "Evitas cometer fraude legal y mantienes tu historial limpio para el futuro."
        },
        "left": {
            "text": "Mentir en aplicaci\u00f3n",
            "effect": {
                "hope": 20,
                "economy": 15,
                "security": -25,
                "health": -15
            },
            "msg": "Vives aterrorizado de que una auditor\u00eda federal descubra la discrepancia y te arreste."
        }
    },
    {
        "title": "Testigo en las Sombras",
        "desc": "Eres el \u00fanico testigo de un crimen violento en tu vecindario. La polic\u00eda local busca a alguien que declare.",
        "svg": "<svg viewBox='0 0 100 100'><circle cx='50' cy='40' r='15' fill='none' stroke='black' stroke-width='3'/><path d='M30 90 Q50 60 70 90' fill='none' stroke='black' stroke-width='3'/><rect x='10' y='10' width='20' height='80' fill='none' stroke='black' stroke-width='3'/></svg>",
        "right": {
            "text": "Cooperar con polic\u00eda",
            "effect": {
                "hope": 15,
                "security": -25,
                "economy": -10,
                "health": 10
            },
            "msg": "La polic\u00eda anota tu estatus I-220A y quedas expuesto ante las autoridades migratorias."
        },
        "left": {
            "text": "Huir y silencio",
            "effect": {
                "security": 20,
                "economy": 10,
                "health": -20,
                "hope": -15
            },
            "msg": "La culpa y el miedo a la criminalidad impune en tu zona destruyen tu paz mental."
        }
    },
    {
        "title": "El Dolor Silencioso",
        "desc": "Llevas d\u00edas con un dolor agudo que te impide trabajar bien. No tienes seguro m\u00e9dico por tu estatus migratorio.",
        "svg": "<svg viewBox='0 0 100 100'><path d='M50 20 L50 80 M20 50 L80 50' stroke='black' stroke-width='10'/><circle cx='50' cy='50' r='40' fill='none' stroke='black' stroke-width='3'/></svg>",
        "right": {
            "text": "Ir a emergencias",
            "effect": {
                "health": 25,
                "economy": -30,
                "hope": 10,
                "security": -10
            },
            "msg": "Adquieres una deuda aplastante que mancha tu historial crediticio en el pa\u00eds."
        },
        "left": {
            "text": "Comprar calmantes",
            "effect": {
                "economy": 20,
                "security": 10,
                "health": -30,
                "hope": -15
            },
            "msg": "El da\u00f1o f\u00edsico empeora y sientes que tu cuerpo es desechable para esta sociedad."
        }
    },
    {
        "title": "El Ret\u00e9n de Tr\u00e1nsito",
        "desc": "Conduces hacia tu trabajo y te topas con un control policial aleatorio. Las leyes estatales recientes son hostiles con los inmigrantes.",
        "svg": "<svg viewBox='0 0 100 100'><circle cx='30' cy='70' r='10' fill='none' stroke='black' stroke-width='3'/><circle cx='70' cy='70' r='10' fill='none' stroke='black' stroke-width='3'/><path d='M10 70 L10 40 L40 40 L60 20 L90 20 L90 70 Z' fill='none' stroke='black' stroke-width='3'/></svg>",
        "right": {
            "text": "Mostrar I-220A",
            "effect": {
                "hope": 15,
                "security": -20,
                "health": -10,
                "economy": 10
            },
            "msg": "Te ahorras una multa, pero el p\u00e1nico de estar a un paso de la detenci\u00f3n afecta tu sistema nervioso."
        },
        "left": {
            "text": "Dar vuelta y huir",
            "effect": {
                "security": 20,
                "health": 10,
                "economy": -20,
                "hope": -15
            },
            "msg": "Pierdes tu turno de trabajo del d\u00eda y la paranoia de ser perseguido no te deja dormir."
        }
    },
    {
        "title": "La Noticia Nativista",
        "desc": "Las noticias anuncian nuevas pol\u00edticas radicales para restringir derechos a personas con tu mismo estatus, llam\u00e1ndolos 'indeseables'.",
        "svg": "<svg viewBox='0 0 100 100'><rect x='20' y='30' width='60' height='40' fill='none' stroke='black' stroke-width='3'/><path d='M40 30 L50 10 L60 30' fill='none' stroke='black' stroke-width='3'/></svg>",
        "right": {
            "text": "Apagar TV",
            "effect": {
                "health": 20,
                "security": 10,
                "hope": -15,
                "economy": -10
            },
            "msg": "Tu ignorancia voluntaria te hace perder fechas l\u00edmite importantes para proteger tu caso legal."
        },
        "left": {
            "text": "Unirte a defensa",
            "effect": {
                "hope": 20,
                "security": -15,
                "health": -10,
                "economy": 10
            },
            "msg": "Te expones p\u00fablicamente como indocumentado y el desgaste emocional de la lucha te agota."
        }
    },
    {
        "title": "El Robo de Salario",
        "desc": "Trabajas la semana entera en construcci\u00f3n, pero tu jefe te paga mucho menos de lo acordado, aprovech\u00e1ndose de tu estatus.",
        "svg": "<svg viewBox='0 0 100 100'><rect x='30' y='40' width='40' height='20' fill='none' stroke='black' stroke-width='3'/><circle cx='50' cy='50' r='5' fill='none' stroke='black' stroke-width='3'/><path d='M20 20 L40 40' stroke='black' stroke-width='3'/></svg>",
        "right": {
            "text": "Amenazar con denunciar",
            "effect": {
                "economy": 15,
                "hope": 10,
                "security": -25,
                "health": -15
            },
            "msg": "El jefe amenaza con llamar a ICE en represalia, poni\u00e9ndote en alerta m\u00e1xima."
        },
        "left": {
            "text": "Aceptar en silencio",
            "effect": {
                "security": 20,
                "health": 10,
                "economy": -25,
                "hope": -15
            },
            "msg": "El golpe financiero te deja sin poder pagar la renta y te sientes deshumanizado."
        }
    },
    {
        "title": "La Falsa Esperanza",
        "desc": "Un 'notario' de la comunidad te asegura que, por una tarifa alta, puede cambiar tu I-220A por una residencia en meses.",
        "svg": "<svg viewBox='0 0 100 100'><path d='M30 70 L50 30 L70 70 Z' fill='none' stroke='black' stroke-width='3'/><circle cx='50' cy='50' r='5' fill='black'/></svg>",
        "right": {
            "text": "Pagar y confiar",
            "effect": {
                "economy": -30,
                "hope": 25,
                "security": -15,
                "health": 10
            },
            "msg": "El tr\u00e1mite resulta ser un fraude que mancha tu expediente federal con documentaci\u00f3n falsa."
        },
        "left": {
            "text": "Rechazar oferta",
            "effect": {
                "economy": 25,
                "security": 15,
                "hope": -20,
                "health": -10
            },
            "msg": "La desesperaci\u00f3n del limbo interminable sigue consumiendo tu mente d\u00eda a d\u00eda."
        }
    },
    {
        "title": "Tributo sin Representaci\u00f3n",
        "desc": "Es temporada de impuestos. Debes declarar usando un n\u00famero ITIN, aportando al sistema sin recibir beneficios sociales a cambio.",
        "svg": "<svg viewBox='0 0 100 100'><polygon points='20,20 80,20 60,80 40,80' fill='none' stroke='black' stroke-width='3'/><line x1='50' y1='30' x2='50' y2='70' stroke='black' stroke-width='3'/></svg>",
        "right": {
            "text": "Pagar impuestos",
            "effect": {
                "economy": -25,
                "security": 20,
                "hope": 10,
                "health": -10
            },
            "msg": "Te quedas sin dinero para alimentos b\u00e1sicos, financiando un sistema que te excluye."
        },
        "left": {
            "text": "Ocultar ingresos",
            "effect": {
                "economy": 25,
                "health": 10,
                "security": -20,
                "hope": -15
            },
            "msg": "Vives con el terror constante de que una auditor\u00eda del IRS descubra la evasi\u00f3n y destruya tu caso."
        }
    },
    {
        "title": "El Familiar Lejano",
        "desc": "Tu familia en tu pa\u00eds de origen enfrenta una crisis econ\u00f3mica grave y te piden que les env\u00edes dinero urgentemente.",
        "svg": "<svg viewBox='0 0 100 100'><circle cx='30' cy='50' r='15' fill='none' stroke='black' stroke-width='3'/><circle cx='70' cy='50' r='15' fill='none' stroke='black' stroke-width='3'/><path d='M45 50 L55 50' stroke='black' stroke-width='3' stroke-dasharray='2,2'/></svg>",
        "right": {
            "text": "Enviar ahorros",
            "effect": {
                "economy": -25,
                "health": 20,
                "hope": 10,
                "security": -15
            },
            "msg": "Te quedas sin los fondos requeridos para renovar tus propios tr\u00e1mites migratorios a tiempo."
        },
        "left": {
            "text": "Mentir y no enviar",
            "effect": {
                "economy": 20,
                "security": 15,
                "health": -25,
                "hope": -15
            },
            "msg": "La culpa y la desconexi\u00f3n forzada con tus ra\u00edces fracturan tu bienestar emocional."
        }
    },
    {
        "title": "Inspecci\u00f3n Inesperada",
        "desc": "Circula el rumor de que agentes de inmigraci\u00f3n est\u00e1n haciendo auditor\u00edas sorpresa en los negocios de tu zona laboral.",
        "svg": "<svg viewBox='0 0 100 100'><path d='M20 80 Q50 20 80 80' fill='none' stroke='black' stroke-width='3'/><circle cx='50' cy='50' r='10' fill='black'/></svg>",
        "right": {
            "text": "Faltar al trabajo",
            "effect": {
                "security": 25,
                "health": 10,
                "economy": -25,
                "hope": -10
            },
            "msg": "Pierdes tu \u00fanica fuente de ingresos por despido y tus finanzas colapsan r\u00e1pidamente."
        },
        "left": {
            "text": "Arriesgarte e ir",
            "effect": {
                "economy": 20,
                "hope": 10,
                "security": -25,
                "health": -15
            },
            "msg": "El p\u00e1nico de ver cada veh\u00edculo oficial en la calle te provoca taquicardia severa."
        }
    },
    {
        "title": "La Oportunidad Acad\u00e9mica",
        "desc": "Te aceptan en una clase avanzada que podr\u00eda mejorar tu futuro, pero el I-220A te impide acceder a ayuda financiera federal.",
        "svg": "<svg viewBox='0 0 100 100'><path d='M20 50 L50 20 L80 50' fill='none' stroke='black' stroke-width='3'/><rect x='30' y='50' width='40' height='30' fill='none' stroke='black' stroke-width='3'/></svg>",
        "right": {
            "text": "Pagar matr\u00edcula",
            "effect": {
                "economy": -30,
                "hope": 25,
                "health": -10,
                "security": 10
            },
            "msg": "El esfuerzo extremo de estudiar y trabajar doble turno sin ayuda merma tu salud."
        },
        "left": {
            "text": "Rechazar plaza",
            "effect": {
                "economy": 20,
                "health": 15,
                "hope": -25,
                "security": -10
            },
            "msg": "Ves c\u00f3mo tu potencial intelectual se estanca ante el muro burocr\u00e1tico del sistema."
        }
    },
    {
        "title": "El Retraso de la Corte",
        "desc": "Recibes una notificaci\u00f3n oficial. Por la sobrecarga del sistema, tu audiencia clave ha sido pospuesta por tres a\u00f1os m\u00e1s.",
        "svg": "<svg viewBox='0 0 100 100'><rect x='20' y='20' width='60' height='60' fill='none' stroke='black' stroke-width='3'/><path d='M30 40 L70 80 M70 40 L30 80' stroke='black' stroke-width='3'/></svg>",
        "right": {
            "text": "Aceptar retraso",
            "effect": {
                "health": 20,
                "economy": 15,
                "security": -20,
                "hope": -10
            },
            "msg": "Tu estatus legal queda fr\u00e1gil y congelado en el tiempo sin garant\u00edas de resoluci\u00f3n."
        },
        "left": {
            "text": "Mandar quejas",
            "effect": {
                "hope": 15,
                "security": 10,
                "health": -20,
                "economy": -15
            },
            "msg": "Gastas energ\u00eda mental y dinero vital en intentar mover una burocracia inamovible."
        }
    },
    {
        "title": "Contrato de Alquiler",
        "desc": "El propietario de tu apartamento exige seguro social v\u00e1lido para renovar el contrato, abusando de su poder para intimidarte.",
        "svg": "<svg viewBox='0 0 100 100'><circle cx='50' cy='30' r='10' fill='none' stroke='black' stroke-width='3'/><path d='M50 40 L50 70 M40 70 L60 70 M40 50 L60 50' stroke='black' stroke-width='3'/></svg>",
        "right": {
            "text": "Aceptar aumento",
            "effect": {
                "economy": -25,
                "security": 20,
                "health": 10,
                "hope": -15
            },
            "msg": "Cedes a la extorsi\u00f3n sistem\u00e1tica que normaliza el abuso contra los indocumentados."
        },
        "left": {
            "text": "Mudar inmediatamente",
            "effect": {
                "hope": 20,
                "economy": 10,
                "security": -25,
                "health": -15
            },
            "msg": "La b\u00fasqueda desesperada de vivienda sin papeles te expone y te agota f\u00edsicamente."
        }
    },
    {
        "title": "Conducci\u00f3n en el Limbo",
        "desc": "Tienes un trabajo excelente, pero est\u00e1 lejos y en tu estado el I-220A no te permite tramitar una licencia de conducir.",
        "svg": "<svg viewBox='0 0 100 100'><circle cx='50' cy='50' r='30' fill='none' stroke='black' stroke-width='4'/><circle cx='50' cy='50' r='10' fill='none' stroke='black' stroke-width='2'/><path d='M50 20 L50 40 M50 60 L50 80 M20 50 L40 50 M60 50 L80 50' stroke='black' stroke-width='3'/></svg>",
        "right": {
            "text": "Conducir sin licencia",
            "effect": {
                "economy": 25,
                "hope": 10,
                "security": -30,
                "health": -15
            },
            "msg": "El trayecto diario se convierte en una tortura psicol\u00f3gica por miedo a la deportaci\u00f3n."
        },
        "left": {
            "text": "Pagar taxis diarios",
            "effect": {
                "security": 25,
                "health": 15,
                "economy": -30,
                "hope": -10
            },
            "msg": "El costo del transporte se lleva casi toda tu ganancia de la semana."
        }
    },
    {
        "title": "La Enfermedad Aislada",
        "desc": "Contraes un virus estacional severo. El miedo a ser registrado en el sistema p\u00fablico te hace dudar sobre buscar ayuda.",
        "svg": "<svg viewBox='0 0 100 100'><path d='M30 50 Q50 10 70 50 Q50 90 30 50' fill='none' stroke='black' stroke-width='3'/><line x1='35' y1='50' x2='65' y2='50' stroke='black' stroke-width='2'/></svg>",
        "right": {
            "text": "Automedicarte",
            "effect": {
                "economy": 15,
                "security": 10,
                "health": -30,
                "hope": -15
            },
            "msg": "Tu cuerpo colapsa progresivamente y el aislamiento deteriora tu voluntad de seguir."
        },
        "left": {
            "text": "Cl\u00ednica comunitaria",
            "effect": {
                "health": 20,
                "hope": 15,
                "security": -20,
                "economy": -10
            },
            "msg": "Entregas tus datos personales a un sistema que podr\u00eda ser auditado por el gobierno federal."
        }
    },
    {
        "title": "El Censo Comunitario",
        "desc": "Trabajadores tocan tu puerta para un censo demogr\u00e1fico, buscando asegurar fondos federales para las escuelas de tu vecindario.",
        "svg": "<svg viewBox='0 0 100 100'><rect x='30' y='20' width='40' height='60' fill='none' stroke='black' stroke-width='3'/><circle cx='60' cy='50' r='3' fill='black'/></svg>",
        "right": {
            "text": "Abrir y participar",
            "effect": {
                "hope": 15,
                "health": 10,
                "security": -20,
                "economy": -10
            },
            "msg": "La paranoia de haber registrado tu direcci\u00f3n ante un agente estatal te quita el sue\u00f1o."
        },
        "left": {
            "text": "Fingir que no hay nadie",
            "effect": {
                "security": 20,
                "economy": 10,
                "hope": -15,
                "health": -10
            },
            "msg": "La sensaci\u00f3n de ser un fantasma sin representaci\u00f3n en el pa\u00eds alimenta tu depresi\u00f3n."
        }
    },
    {
        "title": "Choque Cultural",
        "desc": "En una oficina de correos, el empleado no te entiende y te trata con desprecio visible frente a todos por tu acento.",
        "svg": "<svg viewBox='0 0 100 100'><path d='M20 40 C30 10, 70 10, 80 40 C80 60, 60 70, 50 80 L40 90 L40 70 C20 60, 20 50, 20 40 Z' fill='none' stroke='black' stroke-width='3'/><path d='M40 40 L60 40 M40 50 L50 50' stroke='black' stroke-width='3'/></svg>",
        "right": {
            "text": "Exigir respeto",
            "effect": {
                "hope": 20,
                "health": 10,
                "security": -25,
                "economy": -15
            },
            "msg": "El empleado llama a seguridad alegando un disturbio y te arriesgas a una revisi\u00f3n de antecedentes."
        },
        "left": {
            "text": "Pedir disculpas",
            "effect": {
                "security": 20,
                "economy": 10,
                "hope": -25,
                "health": -15
            },
            "msg": "El peso de la humillaci\u00f3n fractura tu sentido de identidad y aplasta tu autoestima."
        }
    },
    {
        "title": "El Abogado Ocupado",
        "desc": "Tu abogado, sobrecargado por el sistema masivo de asilo, te dice que no tiene tiempo de revisar un detalle menor en tu expediente.",
        "svg": "<svg viewBox='0 0 100 100'><rect x='20' y='30' width='60' height='40' fill='none' stroke='black' stroke-width='3'/><circle cx='80' cy='30' r='10' fill='none' stroke='black' stroke-width='2'/></svg>",
        "right": {
            "text": "Exigir revisi\u00f3n",
            "effect": {
                "security": 20,
                "hope": 10,
                "health": -20,
                "economy": -15
            },
            "msg": "La relaci\u00f3n se vuelve muy hostil y te cobra recargos por el tiempo extra."
        },
        "left": {
            "text": "Confiar en \u00e9l",
            "effect": {
                "health": 15,
                "economy": 15,
                "security": -25,
                "hope": -15
            },
            "msg": "El error t\u00e9cnico no revisado podr\u00eda causar la denegaci\u00f3n definitiva de tu asilo."
        }
    },
    {
        "title": "La Oferta Desesperada",
        "desc": "Alguien te ofrece casarse contigo solo por los papeles, garantizando resolver tu I-220A a cambio de una suma inmensa de dinero.",
        "svg": "<svg viewBox='0 0 100 100'><circle cx='40' cy='50' r='15' fill='none' stroke='black' stroke-width='3'/><circle cx='60' cy='50' r='15' fill='none' stroke='black' stroke-width='3'/></svg>",
        "right": {
            "text": "Aceptar trato",
            "effect": {
                "economy": -30,
                "security": -20,
                "hope": 25,
                "health": 10
            },
            "msg": "Te endeudas con prestamistas y cometes un fraude migratorio castigado con a\u00f1os de c\u00e1rcel."
        },
        "left": {
            "text": "Rechazar categ\u00f3ricamente",
            "effect": {
                "security": 25,
                "economy": 20,
                "hope": -30,
                "health": -10
            },
            "msg": "Desechar una salida r\u00e1pida te obliga a enfrentar la brutal realidad de tu limbo indefinido."
        }
    },
    {
        "title": "Solidaridad Clandestina",
        "desc": "Una familia vecina indocumentada pierde su empleo repentinamente y te pide ayuda econ\u00f3mica y refugio en tu sala por unos d\u00edas.",
        "svg": "<svg viewBox='0 0 100 100'><path d='M50 20 L20 50 L20 80 L80 80 L80 50 Z' fill='none' stroke='black' stroke-width='3'/><circle cx='40' cy='60' r='5' fill='black'/><circle cx='60' cy='60' r='5' fill='black'/></svg>",
        "right": {
            "text": "Acogerlos",
            "effect": {
                "economy": -20,
                "security": -15,
                "hope": 25,
                "health": 10
            },
            "msg": "Pones en riesgo tu propio contrato de alquiler y divides tus ya escasos ingresos diarios."
        },
        "left": {
            "text": "Cerrarles la puerta",
            "effect": {
                "economy": 20,
                "security": 15,
                "hope": -25,
                "health": -15
            },
            "msg": "El ego\u00edsmo impuesto por la supervivencia destruye tu empat\u00eda y te a\u00edsla de tu comunidad."
        }
    },
    {
        "title": "El Cambio de Rumbo",
        "desc": "Escuchas que un estado muy lejano procesa las peticiones de asilo mucho m\u00e1s r\u00e1pido y de manera menos punitiva que donde vives.",
        "svg": "<svg viewBox='0 0 100 100'><path d='M20 50 L80 50 M60 30 L80 50 L60 70' stroke='black' stroke-width='5' fill='none'/></svg>",
        "right": {
            "text": "Mudarte a ciegas",
            "effect": {
                "economy": -30,
                "security": -15,
                "hope": 25,
                "health": 10
            },
            "msg": "Al cambiar de corte, tu papeleo se traspapela y arriesgas faltar a una audiencia cr\u00edtica."
        },
        "left": {
            "text": "Quedarte y resistir",
            "effect": {
                "economy": 20,
                "security": 15,
                "hope": -25,
                "health": -10
            },
            "msg": "Sigues soportando el abuso sistem\u00e1tico y la asfixia de un gobierno estatal que te rechaza."
        }
    },
    {
        "title": "Terapia Imposible",
        "desc": "La constante amenaza de deportaci\u00f3n te ha provocado insomnio cr\u00f3nico y ataques de p\u00e1nico que no puedes controlar.",
        "svg": "<svg viewBox='0 0 100 100'><circle cx='50' cy='50' r='30' fill='none' stroke='black' stroke-width='3'/><path d='M35 40 Q50 30 65 40 M35 60 Q50 70 65 60' fill='none' stroke='black' stroke-width='3'/></svg>",
        "right": {
            "text": "Psic\u00f3logo privado",
            "effect": {
                "economy": -25,
                "security": -10,
                "health": 25,
                "hope": 15
            },
            "msg": "Recuperas la claridad mental para seguir luchando, aunque dejas un registro cl\u00ednico de tu estado."
        },
        "left": {
            "text": "Ocultar s\u00edntomas",
            "effect": {
                "economy": 20,
                "security": 15,
                "health": -30,
                "hope": -15
            },
            "msg": "Tu salud mental empeora dr\u00e1sticamente, acerc\u00e1ndote a un punto de quiebre incapacitante."
        }
    },
    {
        "title": "La Protesta C\u00edvica",
        "desc": "Activistas organizan una marcha pac\u00edfica para pedir soluciones. Te invitan a unirte para darle rostro a la crisis.",
        "svg": "<svg viewBox='0 0 100 100'><rect x='30' y='20' width='40' height='30' fill='none' stroke='black' stroke-width='3'/><line x1='50' y1='50' x2='50' y2='90' stroke='black' stroke-width='3'/></svg>",
        "right": {
            "text": "Asistir a marcha",
            "effect": {
                "hope": 20,
                "health": 10,
                "security": -25,
                "economy": -15
            },
            "msg": "Te expones ante c\u00e1maras gubernamentales y pierdes los ingresos del d\u00eda laboral."
        },
        "left": {
            "text": "Quedarte en casa",
            "effect": {
                "security": 20,
                "economy": 15,
                "hope": -25,
                "health": -10
            },
            "msg": "La impotencia de no poder defender tu propio futuro destruye tu sentido de voluntad."
        }
    },
    {
        "title": "El Formulario Extraviado",
        "desc": "Recibes una carta diciendo que USCIS 'perdi\u00f3' el pago de tus huellas. Te exigen pagar nuevamente o tu caso ser\u00e1 cerrado.",
        "svg": "<svg viewBox='0 0 100 100'><path d='M20 20 L80 20 L50 80 Z' fill='none' stroke='black' stroke-width='3'/><line x1='20' y1='20' x2='50' y2='40' stroke='black' stroke-width='3'/></svg>",
        "right": {
            "text": "Pagar de nuevo",
            "effect": {
                "economy": -25,
                "security": 15,
                "health": -15,
                "hope": 10
            },
            "msg": "Mantienes tu historial limpio y evitas darle al sistema excusas para negarte."
        },
        "left": {
            "text": "Apelar error",
            "effect": {
                "economy": -15,
                "security": -15,
                "hope": 20,
                "health": 10
            },
            "msg": "La apelaci\u00f3n retrasa todo tu caso y atrae un escrutinio federal excesivo sobre tu expediente."
        }
    }
];

// Load from localStorage
function initDB() {
    const savedDB = localStorage.getItem('limboDB');
    if (savedDB) {
        db = JSON.parse(savedDB);
    }
    if (db.cards.length === 0) {
        db.cards = [...defaultCards];
        saveDB();
    }
}

function saveDB() {
    localStorage.setItem('limboDB', JSON.stringify(db));
}

// --- Status Management ---
function updateUI() {
    document.getElementById('bar-health').style.width = `${state.health}%`;
    document.getElementById('bar-economy').style.width = `${state.economy}%`;
    document.getElementById('bar-hope').style.width = `${state.hope}%`;
    document.getElementById('bar-security').style.width = `${state.security}%`;

    if (state.milestones.work) document.getElementById('ms-work').classList.add('achieved');
    if (state.milestones.court) document.getElementById('ms-court').classList.add('achieved');
    if (state.milestones.greencard) document.getElementById('ms-greencard').classList.add('achieved');
    if (state.milestones.citizen) document.getElementById('ms-citizen').classList.add('achieved');

    checkGameOver();
}

function applyEffect(effect) {
    if (effect.health) state.health = Math.max(0, Math.min(100, state.health + effect.health));
    if (effect.economy) state.economy = Math.max(0, Math.min(100, state.economy + effect.economy));
    if (effect.hope) state.hope = Math.max(0, Math.min(100, state.hope + effect.hope));
    if (effect.security) state.security = Math.max(0, Math.min(100, state.security + effect.security));
    updateUI();
}

function checkGameOver() {
    if (state.health <= 0 || state.economy <= 0 || state.hope <= 0 || state.security <= 0) {
        document.getElementById('modal-gameover').classList.add('mostrar');
    } else if (state.milestones.work && state.milestones.court && state.milestones.greencard && state.milestones.citizen) {
        document.getElementById('modal-victory').classList.add('mostrar');
    }
}

// --- Card Logic & Swipe ---
const cardEl = document.getElementById('active-card');
const swipeLeftInd = document.getElementById('swipe-left');
const swipeRightInd = document.getElementById('swipe-right');
let currentCard = null;

let isDragging = false;
let startX = 0;
let currentX = 0;
const SWIPE_THRESHOLD = 100;

cardEl.addEventListener('mousedown', dragStart);
cardEl.addEventListener('touchstart', dragStart, {passive: true});

window.addEventListener('mousemove', dragMove);
window.addEventListener('touchmove', dragMove, {passive: false});

window.addEventListener('mouseup', dragEnd);
window.addEventListener('touchend', dragEnd);

function dragStart(e) {
    if (e.target.closest('#admin-overlay')) return; // Ignore admin clicks
    isDragging = true;
    startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    cardEl.style.transition = 'none';
}

function dragMove(e) {
    if (!isDragging) return;
    const x = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    currentX = x - startX;

    // Rotate and translate
    const rotate = currentX * 0.05;
    cardEl.style.transform = `translate(${currentX}px, 0) rotate(${rotate}deg)`;

    // Show indicators
    if (currentX > 50) {
        swipeRightInd.style.opacity = 1;
        swipeLeftInd.style.opacity = 0;
    } else if (currentX < -50) {
        swipeLeftInd.style.opacity = 1;
        swipeRightInd.style.opacity = 0;
    } else {
        swipeLeftInd.style.opacity = 0;
        swipeRightInd.style.opacity = 0;
    }
}

function dragEnd(e) {
    if (!isDragging) return;
    isDragging = false;
    cardEl.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
    swipeLeftInd.style.opacity = 0;
    swipeRightInd.style.opacity = 0;

    if (currentX > SWIPE_THRESHOLD) {
        handleSwipe('right');
    } else if (currentX < -SWIPE_THRESHOLD) {
        handleSwipe('left');
    } else {
        cardEl.style.transform = 'translate(0, 0) rotate(0deg)';
    }
    currentX = 0;
}

function handleSwipe(dir) {
    // Apply effects
    if (currentCard) {
        let decisionMsg = "";
        if (dir === 'right') {
            applyEffect(currentCard.right.effect);
            decisionMsg = currentCard.right.msg || "";
        } else {
            applyEffect(currentCard.left.effect);
            decisionMsg = currentCard.left.msg || "";
        }

        // Show result modal
        if (decisionMsg) {
            showResultModal(decisionMsg, () => {
                // Animate out
                cardEl.style.transform = `translate(${dir === 'right' ? '100vw' : '-100vw'}, 0) rotate(${dir === 'right' ? '30deg' : '-30deg'})`;
                setTimeout(() => {
                    cardEl.style.transition = 'none';
                    cardEl.style.transform = 'translate(0, -100vh) rotate(0deg)';
                    loadNextCard();
                }, 300);
            });
            return;
        }
    }

    // Animate out
    cardEl.style.transform = `translate(${dir === 'right' ? '100vw' : '-100vw'}, 0) rotate(${dir === 'right' ? '30deg' : '-30deg'})`;
    setTimeout(() => {
        cardEl.style.transition = 'none';
        cardEl.style.transform = 'translate(0, -100vh) rotate(0deg)';
        loadNextCard();
    }, 300);
}

function showResultModal(msg, callback) {
    const modal = document.getElementById('modal-resultado');
    document.getElementById('resultado-texto').textContent = msg;
    modal.classList.add('mostrar');

    const btn = document.getElementById('btn-continuar');
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);

    newBtn.addEventListener('click', () => {
        const clickSound = document.getElementById('click-sound');
        if (clickSound) {
            clickSound.currentTime = 0;
            clickSound.play().catch(e => console.log('Audio error:', e));
        }
        modal.classList.remove('mostrar');
        callback();
    });
}

async function loadNextCard() {
    if (state.aiEnabled) {
        document.getElementById('card-title').textContent = "Generando...";
        document.getElementById('card-desc').textContent = "Esperando al sistema...";
        document.getElementById('card-image').innerHTML = `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="20" fill="none" stroke="black" stroke-width="4" stroke-dasharray="31.4 31.4"><animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="1s" repeatCount="indefinite"/></circle></svg>`;

        cardEl.style.transition = 'transform 0.5s ease';
        cardEl.style.transform = 'translate(0, 0) rotate(0deg)';

        const newCard = await generateCardWithAI();
        if (newCard) {
            db.cards.push(newCard);
            saveDB();
            currentCard = newCard;
        } else {
            // Fallback
            currentCard = db.cards[Math.floor(Math.random() * db.cards.length)];
        }
    } else {
        currentCard = db.cards[Math.floor(Math.random() * db.cards.length)];
    }

    renderCard(currentCard);

    // Animate in if not already done
    cardEl.style.transition = 'transform 0.5s ease';
    cardEl.style.transform = 'translate(0, 0) rotate(0deg)';
}

function renderCard(card) {
    document.getElementById('card-title').textContent = card.title;
    document.getElementById('card-desc').textContent = card.desc;
    document.getElementById('card-image').innerHTML = card.svg;

    document.getElementById('swipe-left').innerHTML = `◀ ${card.left.text}`;
    document.getElementById('swipe-right').innerHTML = `${card.right.text} ▶`;
}

// --- Gemini AI Integration ---
async function generateCardWithAI() {
    const prompt = `Generate a JSON object for a 2D game card. The game is about the legal limbo of immigrants.
The card should present a daily life or legal challenge.
The JSON must have the following structure exactly:
{
    "title": "Short Title",
    "desc": "A short scenario description.",
    "svg": "<svg viewBox='0 0 100 100'>...</svg>", // A pure black-and-white simple SVG drawing using stroke='black' and fill='none'. Max 3 simple shapes/paths.
    "left": { "effect": { "health": -10, "economy": 0, "hope": 0, "security": 10 } }, // Rejecting
    "right": { "effect": { "health": 10, "economy": -20, "hope": 10, "security": -10 } } // Accepting
}
Do not include markdown or backticks. Return ONLY the raw JSON string. Effects must be integers between -30 and 30. Ensure it's valid JSON.`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.9,
                    topK: 1,
                    topP: 1,
                    maxOutputTokens: 2048,
                    responseMimeType: "application/json"
                }
            })
        });

        const data = await response.json();

        if (!data || !data.candidates || data.candidates.length === 0 || !data.candidates[0].content) {
            console.error("AI API Error: Invalid response structure", data);
            logAdmin(`[AI ERROR] Invalid response structure`);
            return null;
        }

        const jsonStr = data.candidates[0].content.parts[0].text;
        return JSON.parse(jsonStr);
    } catch (e) {
        console.error("AI Generation failed:", e);
        logAdmin(`[AI ERROR] ${e.message}`);
        return null;
    }
}

// --- Admin Console ---
let adminMode = false;
let adminAuthed = false;
const adminOverlay = document.getElementById('admin-overlay');
const adminInput = document.getElementById('admin-input');
const adminLog = document.getElementById('admin-log');

window.addEventListener('keydown', (e) => {
    if (e.key === '/' && !adminMode && document.activeElement !== adminInput) {
        e.preventDefault();
        adminMode = true;
        adminOverlay.style.display = 'flex';
        adminInput.focus();
    } else if (e.key === 'Escape' && adminMode) {
        adminMode = false;
        adminOverlay.style.display = 'none';
        adminAuthed = false;
        adminLog.innerHTML = '<div>[SYSTEM] Ingrese contraseña:</div>';
        adminInput.value = '';
    }
});

adminInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const val = adminInput.value.trim();
        adminInput.value = '';
        if (!val) return;

        if (!adminAuthed) {
            if (val === ADMIN_PASSWORD) {
                adminAuthed = true;
                logAdmin('[SYSTEM] Access Granted. Commands: enableai, disableai, deletecard');
            } else {
                logAdmin('[SYSTEM] Access Denied.');
                setTimeout(() => {
                    adminMode = false;
                    adminOverlay.style.display = 'none';
                }, 1000);
            }
        } else {
            handleAdminCommand(val);
        }
    }
});

function logAdmin(msg) {
    const div = document.createElement('div');
    div.textContent = msg;
    adminLog.appendChild(div);
    adminLog.scrollTop = adminLog.scrollHeight;
}

function handleAdminCommand(cmd) {
    logAdmin(`> ${cmd}`);
    if (cmd === 'enableai') {
        state.aiEnabled = true;
        logAdmin('[OK] AI Enabled.');
    } else if (cmd === 'disableai') {
        state.aiEnabled = false;
        logAdmin('[OK] AI Disabled.');
    } else if (cmd === 'deletecard') {
        if (db.cards.length > defaultCards.length) {
            db.cards.pop();
            saveDB();
            logAdmin('[OK] Last generated card deleted.');
        } else {
            logAdmin('[ERR] No generated cards to delete.');
        }
    } else {
        logAdmin('[ERR] Unknown command.');
    }
}

// --- Init ---
initDB();
updateUI();
loadNextCard();

// Buttons
document.getElementById('btn-restart').addEventListener('click', () => location.reload());
document.getElementById('btn-victory-restart').addEventListener('click', () => location.reload());
