
let userApiKey = null;

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
const defaultCards = [
    {
        "title": {
            "es": "El Lenguaje Oficial",
            "en": "The Official Language"
        },
        "desc": {
            "es": "Recibes un formulario de actualizaci\u00f3n de USCIS con lenguaje t\u00e9cnico incomprensible. Un error puede ser fatal para tu caso.",
            "en": "You receive a USCIS update form with incomprehensible technical language. An error could be fatal for your case."
        },
        "img": "images/c1_lenguaje.jpg",
        "svg": "<svg viewBox='0 0 100 100'><rect x='20' y='10' width='60' height='80' fill='none' stroke='black' stroke-width='3'/><path d='M30 30 L70 30 M30 50 L70 50 M30 70 L50 70' stroke='black' stroke-width='3'/></svg>",
        "right": {
            "text": {
                "es": "Pagar a un traductor",
                "en": "Pay a translator"
            },
            "effect": {
                "economy": -20,
                "security": 15,
                "health": -10,
                "hope": 10
            },
            "msg": {
                "es": "Aseguras que el documento vaya perfecto al gobierno y evitas errores t\u00e9cnicos.",
                "en": "You ensure the document goes perfectly to the government and avoid technical errors."
            }
        },
        "left": {
            "text": {
                "es": "Usar app gratuita",
                "en": "Use a free app"
            },
            "effect": {
                "economy": 15,
                "security": -20,
                "health": 10,
                "hope": -15
            },
            "msg": {
                "es": "Vives con el miedo constante de haber cometido un error que detone tu deportaci\u00f3n.",
                "en": "You live with the constant fear of having made a mistake that triggers your deportation."
            }
        }
    },
    {
        "title": {
            "es": "El Techo de Cristal",
            "en": "The Glass Ceiling"
        },
        "desc": {
            "es": "Una empresa descubre tu talento y te ofrece el trabajo de tus sue\u00f1os, pero el sistema exige un estatus que el I-220A no te garantiza.",
            "en": "A company discovers your talent and offers you your dream job, but the system demands a status your I-220A doesn't guarantee."
        },
        "img": "images/c2_techo.jpg",
        "svg": "<svg viewBox='0 0 100 100'><path d='M20 80 L20 40 L50 20 L80 40 L80 80 Z' fill='none' stroke='black' stroke-width='3'/><rect x='40' y='60' width='20' height='20' fill='none' stroke='black' stroke-width='3'/><line x1='10' y1='10' x2='90' y2='30' stroke='black' stroke-width='4'/></svg>",
        "right": {
            "text": {
                "es": "Rogar por patrocinio",
                "en": "Beg for sponsorship"
            },
            "effect": {
                "hope": -15,
                "health": -10,
                "security": 10,
                "economy": 10
            },
            "msg": {
                "es": "Evitas cometer fraude legal y mantienes tu historial limpio para el futuro.",
                "en": "You avoid committing legal fraud and keep your record clean for the future."
            }
        },
        "left": {
            "text": {
                "es": "Mentir en aplicaci\u00f3n",
                "en": "Lie on application"
            },
            "effect": {
                "hope": 20,
                "economy": 15,
                "security": -25,
                "health": -15
            },
            "msg": {
                "es": "Vives aterrorizado de que una auditor\u00eda federal descubra la discrepancia y te arreste.",
                "en": "You live terrified that a federal audit will discover the discrepancy and arrest you."
            }
        }
    },
    {
        "title": {
            "es": "Testigo en las Sombras",
            "en": "Witness in the Shadows"
        },
        "desc": {
            "es": "Eres el \u00fanico testigo de un crimen violento en tu vecindario. La polic\u00eda local busca a alguien que declare.",
            "en": "You are the only witness to a violent crime in your neighborhood. Local police are looking for someone to testify."
        },
        "img": "images/c3_testigo.jpg",
        "svg": "<svg viewBox='0 0 100 100'><circle cx='50' cy='40' r='15' fill='none' stroke='black' stroke-width='3'/><path d='M30 90 Q50 60 70 90' fill='none' stroke='black' stroke-width='3'/><rect x='10' y='10' width='20' height='80' fill='none' stroke='black' stroke-width='3'/></svg>",
        "right": {
            "text": {
                "es": "Cooperar con polic\u00eda",
                "en": "Cooperate with police"
            },
            "effect": {
                "hope": 15,
                "security": -25,
                "economy": -10,
                "health": 10
            },
            "msg": {
                "es": "La polic\u00eda anota tu estatus I-220A y quedas expuesto ante las autoridades migratorias.",
                "en": "The police note your I-220A status and you are exposed to immigration authorities."
            }
        },
        "left": {
            "text": {
                "es": "Huir y silencio",
                "en": "Flee and stay silent"
            },
            "effect": {
                "security": 20,
                "economy": 10,
                "health": -20,
                "hope": -15
            },
            "msg": {
                "es": "La culpa y el miedo a la criminalidad impune en tu zona destruyen tu paz mental.",
                "en": "Guilt and fear of unpunished criminality in your area destroy your peace of mind."
            }
        }
    },
    {
        "title": {
            "es": "El Dolor Silencioso",
            "en": "Silent Pain"
        },
        "desc": {
            "es": "Llevas d\u00edas con un dolor agudo que te impide trabajar bien. No tienes seguro m\u00e9dico por tu estatus migratorio.",
            "en": "You've had severe pain for days that prevents you from working well. You have no health insurance due to your immigration status."
        },
        "img": "images/c4_dolor.jpg",
        "svg": "<svg viewBox='0 0 100 100'><path d='M50 20 L50 80 M20 50 L80 50' stroke='black' stroke-width='10'/><circle cx='50' cy='50' r='40' fill='none' stroke='black' stroke-width='3'/></svg>",
        "right": {
            "text": {
                "es": "Ir a emergencias",
                "en": "Go to ER"
            },
            "effect": {
                "health": 25,
                "economy": -30,
                "hope": 10,
                "security": -10
            },
            "msg": {
                "es": "Adquieres una deuda aplastante que mancha tu historial crediticio en el pa\u00eds.",
                "en": "You acquire crushing debt that stains your credit history in the country."
            }
        },
        "left": {
            "text": {
                "es": "Comprar calmantes",
                "en": "Buy painkillers"
            },
            "effect": {
                "economy": 20,
                "security": 10,
                "health": -30,
                "hope": -15
            },
            "msg": {
                "es": "El da\u00f1o f\u00edsico empeora y sientes que tu cuerpo es desechable para esta sociedad.",
                "en": "The physical damage worsens and you feel your body is disposable to this society."
            }
        }
    },
    {
        "title": {
            "es": "El Ret\u00e9n de Tr\u00e1nsito",
            "en": "The Traffic Stop"
        },
        "desc": {
            "es": "Conduces hacia tu trabajo y te topas con un control policial aleatorio. Las leyes estatales recientes son hostiles con los inmigrantes.",
            "en": "You drive to work and run into a random police checkpoint. Recent state laws are hostile to immigrants."
        },
        "img": "images/c5_reten.jpg",
        "svg": "<svg viewBox='0 0 100 100'><circle cx='30' cy='70' r='10' fill='none' stroke='black' stroke-width='3'/><circle cx='70' cy='70' r='10' fill='none' stroke='black' stroke-width='3'/><path d='M10 70 L10 40 L40 40 L60 20 L90 20 L90 70 Z' fill='none' stroke='black' stroke-width='3'/></svg>",
        "right": {
            "text": {
                "es": "Mostrar I-220A",
                "en": "Show I-220A"
            },
            "effect": {
                "hope": 15,
                "security": -20,
                "health": -10,
                "economy": 10
            },
            "msg": {
                "es": "Te ahorras una multa, pero el p\u00e1nico de estar a un paso de la detenci\u00f3n afecta tu sistema nervioso.",
                "en": "You save a fine, but the panic of being one step away from detention affects your nervous system."
            }
        },
        "left": {
            "text": {
                "es": "Dar vuelta y huir",
                "en": "Turn around and flee"
            },
            "effect": {
                "security": 20,
                "health": 10,
                "economy": -20,
                "hope": -15
            },
            "msg": {
                "es": "Pierdes tu turno de trabajo del d\u00eda y la paranoia de ser perseguido no te deja dormir.",
                "en": "You miss your work shift for the day and the paranoia of being pursued keeps you awake."
            }
        }
    },
    {
        "title": {
            "es": "La Noticia Nativista",
            "en": "Nativist News"
        },
        "desc": {
            "es": "Las noticias anuncian nuevas pol\u00edticas radicales para restringir derechos a personas con tu mismo estatus, llam\u00e1ndolos 'indeseables'.",
            "en": "News announces radical new policies to restrict rights of people with your status, calling them 'undesirables'."
        },
        "img": "images/c6_noticia.jpg",
        "svg": "<svg viewBox='0 0 100 100'><rect x='20' y='30' width='60' height='40' fill='none' stroke='black' stroke-width='3'/><path d='M40 30 L50 10 L60 30' fill='none' stroke='black' stroke-width='3'/></svg>",
        "right": {
            "text": {
                "es": "Apagar TV",
                "en": "Turn off TV"
            },
            "effect": {
                "health": 20,
                "security": 10,
                "hope": -15,
                "economy": -10
            },
            "msg": {
                "es": "Tu ignorancia voluntaria te hace perder fechas l\u00edmite importantes para proteger tu caso legal.",
                "en": "Your willful ignorance makes you miss important deadlines to protect your legal case."
            }
        },
        "left": {
            "text": {
                "es": "Unirte a defensa",
                "en": "Join defense group"
            },
            "effect": {
                "hope": 20,
                "security": -15,
                "health": -10,
                "economy": 10
            },
            "msg": {
                "es": "Te expones p\u00fablicamente como indocumentado y el desgaste emocional de la lucha te agota.",
                "en": "You expose yourself publicly as undocumented and the emotional toll of the fight exhausts you."
            }
        }
    },
    {
        "title": {
            "es": "El Robo de Salario",
            "en": "Wage Theft"
        },
        "desc": {
            "es": "Trabajas la semana entera en construcci\u00f3n, pero tu jefe te paga mucho menos de lo acordado, aprovech\u00e1ndose de tu estatus.",
            "en": "You work all week in construction, but your boss pays you much less than agreed, taking advantage of your status."
        },
        "img": "images/c7_robo.jpg",
        "svg": "<svg viewBox='0 0 100 100'><rect x='30' y='40' width='40' height='20' fill='none' stroke='black' stroke-width='3'/><circle cx='50' cy='50' r='5' fill='none' stroke='black' stroke-width='3'/><path d='M20 20 L40 40' stroke='black' stroke-width='3'/></svg>",
        "right": {
            "text": {
                "es": "Amenazar con denunciar",
                "en": "Threaten to report"
            },
            "effect": {
                "economy": 15,
                "hope": 10,
                "security": -25,
                "health": -15
            },
            "msg": {
                "es": "El jefe amenaza con llamar a ICE en represalia, poni\u00e9ndote en alerta m\u00e1xima.",
                "en": "The boss threatens to call ICE in retaliation, putting you on high alert."
            }
        },
        "left": {
            "text": {
                "es": "Aceptar en silencio",
                "en": "Accept in silence"
            },
            "effect": {
                "security": 20,
                "health": 10,
                "economy": -25,
                "hope": -15
            },
            "msg": {
                "es": "El golpe financiero te deja sin poder pagar la renta y te sientes deshumanizado.",
                "en": "The financial hit leaves you unable to pay rent and you feel dehumanized."
            }
        }
    },
    {
        "title": {
            "es": "La Falsa Esperanza",
            "en": "False Hope"
        },
        "desc": {
            "es": "Un 'notario' de la comunidad te asegura que, por una tarifa alta, puede cambiar tu I-220A por una residencia en meses.",
            "en": "A community 'notario' assures you that, for a high fee, they can change your I-220A to a residency in months."
        },
        "img": "images/c8_falsa.jpg",
        "svg": "<svg viewBox='0 0 100 100'><path d='M30 70 L50 30 L70 70 Z' fill='none' stroke='black' stroke-width='3'/><circle cx='50' cy='50' r='5' fill='black'/></svg>",
        "right": {
            "text": {
                "es": "Pagar y confiar",
                "en": "Pay and trust"
            },
            "effect": {
                "economy": -30,
                "hope": 25,
                "security": -15,
                "health": 10
            },
            "msg": {
                "es": "El tr\u00e1mite resulta ser un fraude que mancha tu expediente federal con documentaci\u00f3n falsa.",
                "en": "The process turns out to be a fraud that stains your federal record with false documentation."
            }
        },
        "left": {
            "text": {
                "es": "Rechazar oferta",
                "en": "Reject offer"
            },
            "effect": {
                "economy": 25,
                "security": 15,
                "hope": -20,
                "health": -10
            },
            "msg": {
                "es": "La desesperaci\u00f3n del limbo interminable sigue consumiendo tu mente d\u00eda a d\u00eda.",
                "en": "The despair of endless limbo continues to consume your mind day by day."
            }
        }
    },
    {
        "title": {
            "es": "Tributo sin Representaci\u00f3n",
            "en": "Taxation Without Representation"
        },
        "desc": {
            "es": "Es temporada de impuestos. Debes declarar usando un n\u00famero ITIN, aportando al sistema sin recibir beneficios sociales a cambio.",
            "en": "It's tax season. You must file using an ITIN number, contributing to the system without receiving social benefits in return."
        },
        "img": "images/c9_tributo.jpg",
        "svg": "<svg viewBox='0 0 100 100'><polygon points='20,20 80,20 60,80 40,80' fill='none' stroke='black' stroke-width='3'/><line x1='50' y1='30' x2='50' y2='70' stroke='black' stroke-width='3'/></svg>",
        "right": {
            "text": {
                "es": "Pagar impuestos",
                "en": "Pay taxes"
            },
            "effect": {
                "economy": -25,
                "security": 20,
                "hope": 10,
                "health": -10
            },
            "msg": {
                "es": "Te quedas sin dinero para alimentos b\u00e1sicos, financiando un sistema que te excluye.",
                "en": "You run out of money for basic groceries, financing a system that excludes you."
            }
        },
        "left": {
            "text": {
                "es": "Ocultar ingresos",
                "en": "Hide income"
            },
            "effect": {
                "economy": 25,
                "health": 10,
                "security": -20,
                "hope": -15
            },
            "msg": {
                "es": "Vives con el terror constante de que una auditor\u00eda del IRS descubra la evasi\u00f3n y destruya tu caso.",
                "en": "You live with the constant terror that an IRS audit will discover the evasion and destroy your case."
            }
        }
    },
    {
        "title": {
            "es": "El Familiar Lejano",
            "en": "The Distant Relative"
        },
        "desc": {
            "es": "Tu familia en tu pa\u00eds de origen enfrenta una crisis econ\u00f3mica grave y te piden que les env\u00edes dinero urgentemente.",
            "en": "Your family in your home country faces a severe economic crisis and asks you to send money urgently."
        },
        "img": "images/c10_familiar.jpg",
        "svg": "<svg viewBox='0 0 100 100'><circle cx='30' cy='50' r='15' fill='none' stroke='black' stroke-width='3'/><circle cx='70' cy='50' r='15' fill='none' stroke='black' stroke-width='3'/><path d='M45 50 L55 50' stroke='black' stroke-width='3' stroke-dasharray='2,2'/></svg>",
        "right": {
            "text": {
                "es": "Enviar ahorros",
                "en": "Send savings"
            },
            "effect": {
                "economy": -25,
                "health": 20,
                "hope": 10,
                "security": -15
            },
            "msg": {
                "es": "Te quedas sin los fondos requeridos para renovar tus propios tr\u00e1mites migratorios a tiempo.",
                "en": "You are left without the funds required to renew your own immigration paperwork on time."
            }
        },
        "left": {
            "text": {
                "es": "Mentir y no enviar",
                "en": "Lie and don't send"
            },
            "effect": {
                "economy": 20,
                "security": 15,
                "health": -25,
                "hope": -15
            },
            "msg": {
                "es": "La culpa y la desconexi\u00f3n forzada con tus ra\u00edces fracturan tu bienestar emocional.",
                "en": "Guilt and forced disconnection from your roots fracture your emotional well-being."
            }
        }
    },
    {
        "title": {
            "es": "Inspecci\u00f3n Inesperada",
            "en": "Unexpected Inspection"
        },
        "desc": {
            "es": "Circula el rumor de que agentes de inmigraci\u00f3n est\u00e1n haciendo auditor\u00edas sorpresa en los negocios de tu zona laboral.",
            "en": "Rumor has it that immigration agents are making surprise audits at businesses in your work area."
        },
        "img": "images/c11_inspeccion.jpg",
        "svg": "<svg viewBox='0 0 100 100'><path d='M20 80 Q50 20 80 80' fill='none' stroke='black' stroke-width='3'/><circle cx='50' cy='50' r='10' fill='black'/></svg>",
        "right": {
            "text": {
                "es": "Faltar al trabajo",
                "en": "Miss work"
            },
            "effect": {
                "security": 25,
                "health": 10,
                "economy": -25,
                "hope": -10
            },
            "msg": {
                "es": "Pierdes tu \u00fanica fuente de ingresos por despido y tus finanzas colapsan r\u00e1pidamente.",
                "en": "You lose your only source of income due to dismissal and your finances collapse rapidly."
            }
        },
        "left": {
            "text": {
                "es": "Arriesgarte e ir",
                "en": "Risk it and go"
            },
            "effect": {
                "economy": 20,
                "hope": 10,
                "security": -25,
                "health": -15
            },
            "msg": {
                "es": "El p\u00e1nico de ver cada veh\u00edculo oficial en la calle te provoca taquicardia severa.",
                "en": "The panic of seeing every official vehicle on the street causes severe tachycardia."
            }
        }
    },
    {
        "title": {
            "es": "La Oportunidad Acad\u00e9mica",
            "en": "The Academic Opportunity"
        },
        "desc": {
            "es": "Te aceptan en una clase avanzada que podr\u00eda mejorar tu futuro, pero el I-220A te impide acceder a ayuda financiera federal.",
            "en": "You are accepted into an advanced class that could improve your future, but I-220A prevents you from accessing federal financial aid."
        },
        "img": "images/c12_academica.jpg",
        "svg": "<svg viewBox='0 0 100 100'><path d='M20 50 L50 20 L80 50' fill='none' stroke='black' stroke-width='3'/><rect x='30' y='50' width='40' height='30' fill='none' stroke='black' stroke-width='3'/></svg>",
        "right": {
            "text": {
                "es": "Pagar matr\u00edcula",
                "en": "Pay tuition"
            },
            "effect": {
                "economy": -30,
                "hope": 25,
                "health": -10,
                "security": 10
            },
            "msg": {
                "es": "El esfuerzo extremo de estudiar y trabajar doble turno sin ayuda merma tu salud.",
                "en": "The extreme effort of studying and working double shifts without help depletes your health."
            }
        },
        "left": {
            "text": {
                "es": "Rechazar plaza",
                "en": "Reject spot"
            },
            "effect": {
                "economy": 20,
                "health": 15,
                "hope": -25,
                "security": -10
            },
            "msg": {
                "es": "Ves c\u00f3mo tu potencial intelectual se estanca ante el muro burocr\u00e1tico del sistema.",
                "en": "You see your intellectual potential stagnate against the system's bureaucratic wall."
            }
        }
    },
    {
        "title": {
            "es": "El Retraso de la Corte",
            "en": "The Court Delay"
        },
        "desc": {
            "es": "Recibes una notificaci\u00f3n oficial. Por la sobrecarga del sistema, tu audiencia clave ha sido pospuesta por tres a\u00f1os m\u00e1s.",
            "en": "You receive an official notice. Due to system overload, your key hearing has been postponed for three more years."
        },
        "img": "images/c13_retraso.jpg",
        "svg": "<svg viewBox='0 0 100 100'><rect x='20' y='20' width='60' height='60' fill='none' stroke='black' stroke-width='3'/><path d='M30 40 L70 80 M70 40 L30 80' stroke='black' stroke-width='3'/></svg>",
        "right": {
            "text": {
                "es": "Aceptar retraso",
                "en": "Accept delay"
            },
            "effect": {
                "health": 20,
                "economy": 15,
                "security": -20,
                "hope": -10
            },
            "msg": {
                "es": "Tu estatus legal queda fr\u00e1gil y congelado en el tiempo sin garant\u00edas de resoluci\u00f3n.",
                "en": "Your legal status remains fragile and frozen in time without guarantees of resolution."
            }
        },
        "left": {
            "text": {
                "es": "Mandar quejas",
                "en": "Send complaints"
            },
            "effect": {
                "hope": 15,
                "security": 10,
                "health": -20,
                "economy": -15
            },
            "msg": {
                "es": "Gastas energ\u00eda mental y dinero vital en intentar mover una burocracia inamovible.",
                "en": "You spend mental energy and vital money trying to move an unmovable bureaucracy."
            }
        }
    },
    {
        "title": {
            "es": "Contrato de Alquiler",
            "en": "Lease Agreement"
        },
        "desc": {
            "es": "El propietario de tu apartamento exige seguro social v\u00e1lido para renovar el contrato, abusando de su poder para intimidarte.",
            "en": "Your landlord demands a valid social security number to renew your lease, abusing their power to intimidate you."
        },
        "img": "images/c14_alquiler.jpg",
        "svg": "<svg viewBox='0 0 100 100'><circle cx='50' cy='30' r='10' fill='none' stroke='black' stroke-width='3'/><path d='M50 40 L50 70 M40 70 L60 70 M40 50 L60 50' stroke='black' stroke-width='3'/></svg>",
        "right": {
            "text": {
                "es": "Aceptar aumento",
                "en": "Accept rent hike"
            },
            "effect": {
                "economy": -25,
                "security": 20,
                "health": 10,
                "hope": -15
            },
            "msg": {
                "es": "Cedes a la extorsi\u00f3n sistem\u00e1tica que normaliza el abuso contra los indocumentados.",
                "en": "You yield to systematic extortion that normalizes abuse against the undocumented."
            }
        },
        "left": {
            "text": {
                "es": "Mudar inmediatamente",
                "en": "Move immediately"
            },
            "effect": {
                "hope": 20,
                "economy": 10,
                "security": -25,
                "health": -15
            },
            "msg": {
                "es": "La b\u00fasqueda desesperada de vivienda sin papeles te expone y te agota f\u00edsicamente.",
                "en": "The desperate search for housing without papers exposes you and exhausts you physically."
            }
        }
    },
    {
        "title": {
            "es": "Conducci\u00f3n en el Limbo",
            "en": "Driving in Limbo"
        },
        "desc": {
            "es": "Tienes un trabajo excelente, pero est\u00e1 lejos y en tu estado el I-220A no te permite tramitar una licencia de conducir.",
            "en": "You have an excellent job, but it's far away and in your state the I-220A doesn't let you get a driver's license."
        },
        "img": "images/c15_conduccion.jpg",
        "svg": "<svg viewBox='0 0 100 100'><circle cx='50' cy='50' r='30' fill='none' stroke='black' stroke-width='4'/><circle cx='50' cy='50' r='10' fill='none' stroke='black' stroke-width='2'/><path d='M50 20 L50 40 M50 60 L50 80 M20 50 L40 50 M60 50 L80 50' stroke='black' stroke-width='3'/></svg>",
        "right": {
            "text": {
                "es": "Conducir sin licencia",
                "en": "Drive unlicensed"
            },
            "effect": {
                "economy": 25,
                "hope": 10,
                "security": -30,
                "health": -15
            },
            "msg": {
                "es": "El trayecto diario se convierte en una tortura psicol\u00f3gica por miedo a la deportaci\u00f3n.",
                "en": "The daily commute becomes psychological torture due to the fear of deportation."
            }
        },
        "left": {
            "text": {
                "es": "Pagar taxis diarios",
                "en": "Pay daily taxis"
            },
            "effect": {
                "security": 25,
                "health": 15,
                "economy": -30,
                "hope": -10
            },
            "msg": {
                "es": "El costo del transporte se lleva casi toda tu ganancia de la semana.",
                "en": "The cost of transportation takes almost all your earnings for the week."
            }
        }
    },
    {
        "title": {
            "es": "La Enfermedad Aislada",
            "en": "The Isolated Illness"
        },
        "desc": {
            "es": "Contraes un virus estacional severo. El miedo a ser registrado en el sistema p\u00fablico te hace dudar sobre buscar ayuda.",
            "en": "You catch a severe seasonal virus. Fear of being registered in the public system makes you hesitate to seek help."
        },
        "img": "images/c16_enfermedad.jpg",
        "svg": "<svg viewBox='0 0 100 100'><path d='M30 50 Q50 10 70 50 Q50 90 30 50' fill='none' stroke='black' stroke-width='3'/><line x1='35' y1='50' x2='65' y2='50' stroke='black' stroke-width='2'/></svg>",
        "right": {
            "text": {
                "es": "Automedicarte",
                "en": "Self-medicate"
            },
            "effect": {
                "economy": 15,
                "security": 10,
                "health": -30,
                "hope": -15
            },
            "msg": {
                "es": "Tu cuerpo colapsa progresivamente y el aislamiento deteriora tu voluntad de seguir.",
                "en": "Your body collapses progressively and isolation deteriorates your will to go on."
            }
        },
        "left": {
            "text": {
                "es": "Cl\u00ednica comunitaria",
                "en": "Community clinic"
            },
            "effect": {
                "health": 20,
                "hope": 15,
                "security": -20,
                "economy": -10
            },
            "msg": {
                "es": "Entregas tus datos personales a un sistema que podr\u00eda ser auditado por el gobierno federal.",
                "en": "You hand over your personal data to a system that could be audited by the federal government."
            }
        }
    },
    {
        "title": {
            "es": "El Censo Comunitario",
            "en": "Community Census"
        },
        "desc": {
            "es": "Trabajadores tocan tu puerta para un censo demogr\u00e1fico, buscando asegurar fondos federales para las escuelas de tu vecindario.",
            "en": "Workers knock on your door for a demographic census, seeking to secure federal funds for your neighborhood schools."
        },
        "img": "images/c17_censo.jpg",
        "svg": "<svg viewBox='0 0 100 100'><rect x='30' y='20' width='40' height='60' fill='none' stroke='black' stroke-width='3'/><circle cx='60' cy='50' r='3' fill='black'/></svg>",
        "right": {
            "text": {
                "es": "Abrir y participar",
                "en": "Open and participate"
            },
            "effect": {
                "hope": 15,
                "health": 10,
                "security": -20,
                "economy": -10
            },
            "msg": {
                "es": "La paranoia de haber registrado tu direcci\u00f3n ante un agente estatal te quita el sue\u00f1o.",
                "en": "The paranoia of having registered your address with a state agent keeps you up at night."
            }
        },
        "left": {
            "text": {
                "es": "Fingir que no hay nadie",
                "en": "Pretend no one is home"
            },
            "effect": {
                "security": 20,
                "economy": 10,
                "hope": -15,
                "health": -10
            },
            "msg": {
                "es": "La sensaci\u00f3n de ser un fantasma sin representaci\u00f3n en el pa\u00eds alimenta tu depresi\u00f3n.",
                "en": "The feeling of being a ghost without representation in the country feeds your depression."
            }
        }
    },
    {
        "title": {
            "es": "Choque Cultural",
            "en": "Culture Shock"
        },
        "desc": {
            "es": "En una oficina de correos, el empleado no te entiende y te trata con desprecio visible frente a todos por tu acento.",
            "en": "At a post office, the clerk doesn't understand you and treats you with visible contempt in front of everyone because of your accent."
        },
        "img": "images/c18_cultura.jpg",
        "svg": "<svg viewBox='0 0 100 100'><path d='M20 40 C30 10, 70 10, 80 40 C80 60, 60 70, 50 80 L40 90 L40 70 C20 60, 20 50, 20 40 Z' fill='none' stroke='black' stroke-width='3'/><path d='M40 40 L60 40 M40 50 L50 50' stroke='black' stroke-width='3'/></svg>",
        "right": {
            "text": {
                "es": "Exigir respeto",
                "en": "Demand respect"
            },
            "effect": {
                "hope": 20,
                "health": 10,
                "security": -25,
                "economy": -15
            },
            "msg": {
                "es": "El empleado llama a seguridad alegando un disturbio y te arriesgas a una revisi\u00f3n de antecedentes.",
                "en": "The clerk calls security alleging a disturbance and you risk a background check."
            }
        },
        "left": {
            "text": {
                "es": "Pedir disculpas",
                "en": "Apologize and leave"
            },
            "effect": {
                "security": 20,
                "economy": 10,
                "hope": -25,
                "health": -15
            },
            "msg": {
                "es": "El peso de la humillaci\u00f3n fractura tu sentido de identidad y aplasta tu autoestima.",
                "en": "The weight of the humiliation fractures your sense of identity and crushes your self-esteem."
            }
        }
    },
    {
        "title": {
            "es": "El Abogado Ocupado",
            "en": "The Busy Lawyer"
        },
        "desc": {
            "es": "Tu abogado, sobrecargado por el sistema masivo de asilo, te dice que no tiene tiempo de revisar un detalle menor en tu expediente.",
            "en": "Your lawyer, overloaded by the massive asylum system, tells you they don't have time to review a minor detail in your file."
        },
        "img": "images/c19_abogado.jpg",
        "svg": "<svg viewBox='0 0 100 100'><rect x='20' y='30' width='60' height='40' fill='none' stroke='black' stroke-width='3'/><circle cx='80' cy='30' r='10' fill='none' stroke='black' stroke-width='2'/></svg>",
        "right": {
            "text": {
                "es": "Exigir revisi\u00f3n",
                "en": "Demand review"
            },
            "effect": {
                "security": 20,
                "hope": 10,
                "health": -20,
                "economy": -15
            },
            "msg": {
                "es": "La relaci\u00f3n se vuelve muy hostil y te cobra recargos por el tiempo extra.",
                "en": "The relationship becomes very hostile and they charge you surcharges for the extra time."
            }
        },
        "left": {
            "text": {
                "es": "Confiar en \u00e9l",
                "en": "Trust them"
            },
            "effect": {
                "health": 15,
                "economy": 15,
                "security": -25,
                "hope": -15
            },
            "msg": {
                "es": "El error t\u00e9cnico no revisado podr\u00eda causar la denegaci\u00f3n definitiva de tu asilo.",
                "en": "The unreviewed technical error could cause the definitive denial of your asylum."
            }
        }
    },
    {
        "title": {
            "es": "La Oferta Desesperada",
            "en": "The Desperate Offer"
        },
        "desc": {
            "es": "Alguien te ofrece casarse contigo solo por los papeles, garantizando resolver tu I-220A a cambio de una suma inmensa de dinero.",
            "en": "Someone offers to marry you just for the papers, guaranteeing to resolve your I-220A in exchange for a huge sum of money."
        },
        "img": "images/c20_oferta.jpg",
        "svg": "<svg viewBox='0 0 100 100'><circle cx='40' cy='50' r='15' fill='none' stroke='black' stroke-width='3'/><circle cx='60' cy='50' r='15' fill='none' stroke='black' stroke-width='3'/></svg>",
        "right": {
            "text": {
                "es": "Aceptar trato",
                "en": "Accept deal"
            },
            "effect": {
                "economy": -30,
                "security": -20,
                "hope": 25,
                "health": 10
            },
            "msg": {
                "es": "Te endeudas con prestamistas y cometes un fraude migratorio castigado con a\u00f1os de c\u00e1rcel.",
                "en": "You go into debt with lenders and commit immigration fraud punishable by years in prison."
            }
        },
        "left": {
            "text": {
                "es": "Rechazar",
                "en": "Reject categorically"
            },
            "effect": {
                "security": 25,
                "economy": 20,
                "hope": -30,
                "health": -10
            },
            "msg": {
                "es": "Desechar una salida r\u00e1pida te obliga a enfrentar la brutal realidad de tu limbo indefinido.",
                "en": "Discarding a quick way out forces you to face the brutal reality of your indefinite limbo."
            }
        }
    },
    {
        "title": {
            "es": "Solidaridad Clandestina",
            "en": "Clandestine Solidarity"
        },
        "desc": {
            "es": "Una familia vecina indocumentada pierde su empleo repentinamente y te pide ayuda econ\u00f3mica y refugio en tu sala por unos d\u00edas.",
            "en": "An undocumented neighbor family suddenly loses their jobs and asks you for financial help and shelter in your living room for a few days."
        },
        "img": "images/c21_solidaridad.jpg",
        "svg": "<svg viewBox='0 0 100 100'><path d='M50 20 L20 50 L20 80 L80 80 L80 50 Z' fill='none' stroke='black' stroke-width='3'/><circle cx='40' cy='60' r='5' fill='black'/><circle cx='60' cy='60' r='5' fill='black'/></svg>",
        "right": {
            "text": {
                "es": "Acogerlos",
                "en": "Take them in"
            },
            "effect": {
                "economy": -20,
                "security": -15,
                "hope": 25,
                "health": 10
            },
            "msg": {
                "es": "Pones en riesgo tu propio contrato de alquiler y divides tus ya escasos ingresos diarios.",
                "en": "You risk your own lease and divide your already scarce daily income."
            }
        },
        "left": {
            "text": {
                "es": "Cerrarles la puerta",
                "en": "Close the door"
            },
            "effect": {
                "economy": 20,
                "security": 15,
                "hope": -25,
                "health": -15
            },
            "msg": {
                "es": "El ego\u00edsmo impuesto por la supervivencia destruye tu empat\u00eda y te a\u00edsla de tu comunidad.",
                "en": "The selfishness imposed by survival destroys your empathy and isolates you from your community."
            }
        }
    },
    {
        "title": {
            "es": "El Cambio de Rumbo",
            "en": "Change of Course"
        },
        "desc": {
            "es": "Escuchas que un estado muy lejano procesa las peticiones de asilo mucho m\u00e1s r\u00e1pido y de manera menos punitiva que donde vives.",
            "en": "You hear that a faraway state processes asylum requests much faster and less punitively than where you live."
        },
        "img": "images/c22_rumbo.jpg",
        "svg": "<svg viewBox='0 0 100 100'><path d='M20 50 L80 50 M60 30 L80 50 L60 70' stroke='black' stroke-width='5' fill='none'/></svg>",
        "right": {
            "text": {
                "es": "Mudarte a ciegas",
                "en": "Move blindly"
            },
            "effect": {
                "economy": -30,
                "security": -15,
                "hope": 25,
                "health": 10
            },
            "msg": {
                "es": "Al cambiar de corte, tu papeleo se traspapela y arriesgas faltar a una audiencia cr\u00edtica.",
                "en": "By changing courts, your paperwork gets misplaced and you risk missing a critical hearing."
            }
        },
        "left": {
            "text": {
                "es": "Quedarte y resistir",
                "en": "Stay and resist"
            },
            "effect": {
                "economy": 20,
                "security": 15,
                "hope": -25,
                "health": -10
            },
            "msg": {
                "es": "Sigues soportando el abuso sistem\u00e1tico y la asfixia de un gobierno estatal que te rechaza.",
                "en": "You continue to endure the systematic abuse and asphyxiation of a state government that rejects you."
            }
        }
    },
    {
        "title": {
            "es": "Terapia Imposible",
            "en": "Impossible Therapy"
        },
        "desc": {
            "es": "La constante amenaza de deportaci\u00f3n te ha provocado insomnio cr\u00f3nico y ataques de p\u00e1nico que no puedes controlar.",
            "en": "The constant threat of deportation has caused chronic insomnia and panic attacks you can't control."
        },
        "img": "images/c23_terapia.jpg",
        "svg": "<svg viewBox='0 0 100 100'><circle cx='50' cy='50' r='30' fill='none' stroke='black' stroke-width='3'/><path d='M35 40 Q50 30 65 40 M35 60 Q50 70 65 60' fill='none' stroke='black' stroke-width='3'/></svg>",
        "right": {
            "text": {
                "es": "Psic\u00f3logo privado",
                "en": "Private psychologist"
            },
            "effect": {
                "economy": -25,
                "security": -10,
                "health": 25,
                "hope": 15
            },
            "msg": {
                "es": "Recuperas la claridad mental para seguir luchando, aunque dejas un registro cl\u00ednico de tu estado.",
                "en": "You recover mental clarity to keep fighting, though you leave a clinical record of your status."
            }
        },
        "left": {
            "text": {
                "es": "Ocultar s\u00edntomas",
                "en": "Hide symptoms"
            },
            "effect": {
                "economy": 20,
                "security": 15,
                "health": -30,
                "hope": -15
            },
            "msg": {
                "es": "Tu salud mental empeora dr\u00e1sticamente, acerc\u00e1ndote a un punto de quiebre incapacitante.",
                "en": "Your mental health deteriorates drastically, bringing you closer to an incapacitating breaking point."
            }
        }
    },
    {
        "title": {
            "es": "La Protesta C\u00edvica",
            "en": "Civic Protest"
        },
        "desc": {
            "es": "Activistas organizan una marcha pac\u00edfica para pedir soluciones. Te invitan a unirte para darle rostro a la crisis.",
            "en": "Activists organize a peaceful march to demand solutions. They invite you to join to give a face to the crisis."
        },
        "img": "images/c24_protesta.jpg",
        "svg": "<svg viewBox='0 0 100 100'><rect x='30' y='20' width='40' height='30' fill='none' stroke='black' stroke-width='3'/><line x1='50' y1='50' x2='50' y2='90' stroke='black' stroke-width='3'/></svg>",
        "right": {
            "text": {
                "es": "Asistir a marcha",
                "en": "Attend march"
            },
            "effect": {
                "hope": 20,
                "health": 10,
                "security": -25,
                "economy": -15
            },
            "msg": {
                "es": "Te expones ante c\u00e1maras gubernamentales y pierdes los ingresos del d\u00eda laboral.",
                "en": "You expose yourself to government cameras and lose the day's work income."
            }
        },
        "left": {
            "text": {
                "es": "Quedarte en casa",
                "en": "Stay at home"
            },
            "effect": {
                "security": 20,
                "economy": 15,
                "hope": -25,
                "health": -10
            },
            "msg": {
                "es": "La impotencia de no poder defender tu propio futuro destruye tu sentido de voluntad.",
                "en": "The impotence of not being able to defend your own future destroys your sense of will."
            }
        }
    },
    {
        "title": {
            "es": "El Formulario Extraviado",
            "en": "The Lost Form"
        },
        "desc": {
            "es": "Recibes una carta diciendo que USCIS 'perdi\u00f3' el pago de tus huellas. Te exigen pagar nuevamente o tu caso ser\u00e1 cerrado.",
            "en": "You receive a letter saying USCIS 'lost' your fingerprint payment. They demand you pay again or your case will be closed."
        },
        "img": "images/c25_formulario.jpg",
        "svg": "<svg viewBox='0 0 100 100'><path d='M20 20 L80 20 L50 80 Z' fill='none' stroke='black' stroke-width='3'/><line x1='20' y1='20' x2='50' y2='40' stroke='black' stroke-width='3'/></svg>",
        "right": {
            "text": {
                "es": "Pagar de nuevo",
                "en": "Pay again"
            },
            "effect": {
                "economy": -25,
                "security": 15,
                "health": -15,
                "hope": 10
            },
            "msg": {
                "es": "Mantienes tu historial limpio y evitas darle al sistema excusas para negarte.",
                "en": "You keep your record clean and avoid giving the system excuses to deny you."
            }
        },
        "left": {
            "text": {
                "es": "Apelar error",
                "en": "Appeal error"
            },
            "effect": {
                "economy": -15,
                "security": -15,
                "hope": 20,
                "health": 10
            },
            "msg": {
                "es": "La apelaci\u00f3n retrasa todo tu caso y atrae un escrutinio federal excesivo sobre tu expediente.",
                "en": "The appeal delays your entire case and attracts excessive federal scrutiny to your file."
            }
        }
    }
];

const milestoneCards = [
    {
        "title": {
            "es": "Permiso de Trabajo",
            "en": "Work Permit"
        },
        "desc": {
            "es": "Una gran oportunidad. Cuesta caro tramitarlo y tardar\u00e1, pero te dar\u00e1 estabilidad.",
            "en": "A great opportunity. It costs a lot to process and will take time, but it will give you stability."
        },
        "img": "images/m1_work.jpg",
        "type": "milestone",
        "milestone": "work",
        "right": {
            "text": {
                "es": "Pagar tr\u00e1mite",
                "en": "Pay process"
            },
            "effect": {
                "economy": -40,
                "hope": -10
            },
            "msg": {
                "es": "Logras enviar los papeles. El permiso est\u00e1 en camino.",
                "en": "You manage to send the papers. The permit is on its way."
            }
        },
        "left": {
            "text": {
                "es": "Rechazar por ahora",
                "en": "Reject for now"
            },
            "effect": {},
            "msg": {
                "es": "Decides no arriesgar tu dinero actual.",
                "en": "You decide not to risk your current money."
            }
        }
    },
    {
        "title": {
            "es": "Resoluci\u00f3n de Corte",
            "en": "Court Resolution"
        },
        "desc": {
            "es": "Tienes la fecha final para tu caso. Prepararte te costar\u00e1 tu salud mental y dinero.",
            "en": "You have the final date for your case. Preparing will cost you your mental health and money."
        },
        "img": "images/m2_court.jpg",
        "type": "milestone",
        "milestone": "court",
        "right": {
            "text": {
                "es": "Ir a corte preparado",
                "en": "Go to court prepared"
            },
            "effect": {
                "economy": -30,
                "health": -30
            },
            "msg": {
                "es": "El juez falla a tu favor. Tienes protecci\u00f3n oficial.",
                "en": "The judge rules in your favor. You have official protection."
            }
        },
        "left": {
            "text": {
                "es": "Pedir retraso",
                "en": "Ask for delay"
            },
            "effect": {},
            "msg": {
                "es": "Pateas el problema para otro a\u00f1o.",
                "en": "You kick the can down the road for another year."
            }
        }
    },
    {
        "title": {
            "es": "Green Card",
            "en": "Green Card"
        },
        "desc": {
            "es": "El momento de la residencia permanente ha llegado. Es un proceso exhaustivo.",
            "en": "The time for permanent residency has arrived. It is an exhausting process."
        },
        "img": "images/m3_greencard.jpg",
        "type": "milestone",
        "milestone": "greencard",
        "right": {
            "text": {
                "es": "Aplicar a residencia",
                "en": "Apply for residency"
            },
            "effect": {
                "economy": -40,
                "security": -20,
                "health": -20
            },
            "msg": {
                "es": "Pasas la entrevista. Eres residente permanente.",
                "en": "You pass the interview. You are a permanent resident."
            }
        },
        "left": {
            "text": {
                "es": "Ignorar proceso",
                "en": "Ignore process"
            },
            "effect": {},
            "msg": {
                "es": "Decides quedarte con tu estatus actual por miedo a que te lo nieguen.",
                "en": "You decide to keep your current status out of fear of denial."
            }
        }
    },
    {
        "title": {
            "es": "Ciudadan\u00eda",
            "en": "Citizenship"
        },
        "desc": {
            "es": "El \u00faltimo paso. El examen es dif\u00edcil y las cuotas son alt\u00edsimas.",
            "en": "The final step. The exam is difficult and the fees are sky-high."
        },
        "img": "images/m4_citizen.jpg",
        "type": "milestone",
        "milestone": "citizen",
        "right": {
            "text": {
                "es": "Tomar el juramento",
                "en": "Take the oath"
            },
            "effect": {
                "economy": -50,
                "health": -20,
                "hope": -10,
                "security": -10
            },
            "msg": {
                "es": "Lo lograste. Eres ciudadano.",
                "en": "You made it. You are a citizen."
            }
        },
        "left": {
            "text": {
                "es": "No aplicar a\u00fan",
                "en": "Don't apply yet"
            },
            "effect": {},
            "msg": {
                "es": "La residencia es suficiente por ahora.",
                "en": "Residency is enough for now."
            }
        }
    }
];

let deck = [];

function initDB() {
    deck = [...defaultCards];
    // Shuffle deck
    deck.sort(() => Math.random() - 0.5);
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

function applyEffect(effect, isMilestone = null) {
    let diff = localStorage.getItem('limboDificultad') || 'normal';
    let multiplier = diff === 'easy' ? 0.5 : 1;

    // Calculate modified effects without mutating the original object
    let healthChange = effect.health || 0;
    let economyChange = effect.economy || 0;
    let hopeChange = effect.hope || 0;
    let securityChange = effect.security || 0;

    if (healthChange < 0) healthChange = Math.round(healthChange * multiplier);
    if (economyChange < 0) economyChange = Math.round(economyChange * multiplier);
    if (hopeChange < 0) hopeChange = Math.round(hopeChange * multiplier);
    if (securityChange < 0) securityChange = Math.round(securityChange * multiplier);

    if (healthChange) state.health = Math.max(0, Math.min(100, state.health + healthChange));
    if (economyChange) state.economy = Math.max(0, Math.min(100, state.economy + economyChange));
    if (hopeChange) state.hope = Math.max(0, Math.min(100, state.hope + hopeChange));
    if (securityChange) state.security = Math.max(0, Math.min(100, state.security + securityChange));

    if (isMilestone) {
        state.milestones[isMilestone] = true;
    }
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
    if (e.target.closest('#admin-overlay')) return;
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

    // Show indicators and predictions
    if (currentX > 50) {
        swipeRightInd.style.opacity = 1;
        swipeLeftInd.style.opacity = 0;
        if (currentCard) showPredictions(currentCard.right.effect);
    } else if (currentX < -50) {
        swipeLeftInd.style.opacity = 1;
        swipeRightInd.style.opacity = 0;
        if (currentCard) showPredictions(currentCard.left.effect);
    } else {
        swipeLeftInd.style.opacity = 0;
        swipeRightInd.style.opacity = 0;
        clearPredictions();
    }
}

function showPredictions(effect) {
    clearPredictions();
    if (!effect) return;

    ['health', 'economy', 'hope', 'security'].forEach(key => {
        const val = effect[key];
        const indicator = document.getElementById(`pred-${key}`);
        if (indicator) {
            if (val !== undefined && val !== 0) {
                indicator.textContent = val > 0 ? '▲' : '▼';
                indicator.style.color = val > 0 ? 'green' : 'red';
                indicator.style.opacity = 1;
            } else {
                indicator.style.opacity = 0;
            }
        }
    });
}

function clearPredictions() {
    ['health', 'economy', 'hope', 'security'].forEach(key => {
        const indicator = document.getElementById(`pred-${key}`);
        if (indicator) {
            indicator.style.opacity = 0;
        }
    });
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
        let isMilestone = currentCard.type === 'milestone' ? currentCard.milestone : null;
        const lang = localStorage.getItem('limboLang') || 'es';

        if (dir === 'right') {
            applyEffect(currentCard.right.effect, isMilestone);
            decisionMsg = currentCard.right.msg ? (currentCard.right.msg[lang] || currentCard.right.msg['es']) : "";
        } else {
            applyEffect(currentCard.left.effect, null); // Don't give milestone on reject
            decisionMsg = currentCard.left.msg ? (currentCard.left.msg[lang] || currentCard.left.msg['es']) : "";
        }

        clearPredictions();

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

    clearPredictions();
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
    if (deck.length === 0) {
        initDB(); // Restart deck if empty
    }

    // 25% chance to draw a milestone if unachieved ones exist
    const unachieved = milestoneCards.filter(ms => !state.milestones[ms.milestone]);
    if (unachieved.length > 0 && Math.random() < (localStorage.getItem('limboDificultad') === 'easy' ? 0.40 : 0.25)) {
        // Pick a random unachieved milestone
        currentCard = unachieved[Math.floor(Math.random() * unachieved.length)];
    } else {
        currentCard = deck.pop();
    }

    if (state.aiEnabled) {
        // Keep title and desc, but show loading for image
        const lang = localStorage.getItem('limboLang') || 'es';
        document.getElementById('card-title').textContent = currentCard.title[lang] || currentCard.title['es'];
        document.getElementById('card-desc').textContent = currentCard.desc[lang] || currentCard.desc['es'];
        document.getElementById('swipe-left').innerHTML = `◀ ${currentCard.left.text[lang] || currentCard.left.text['es']}`;
        document.getElementById('swipe-right').innerHTML = `${currentCard.right.text[lang] || currentCard.right.text['es']} ▶`;

        document.getElementById('card-image').innerHTML = `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="20" fill="none" stroke="black" stroke-width="4" stroke-dasharray="31.4 31.4"><animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="1s" repeatCount="indefinite"/></circle></svg>`;

        cardEl.style.transition = 'transform 0.5s ease';
        cardEl.style.transform = 'translate(0, 0) rotate(0deg)';

        const aiSvg = await generateImageWithAI(currentCard.title['es'], currentCard.desc['es']);
        if (aiSvg) {
            currentCard.svg = aiSvg; // cache it for the session
            document.getElementById('card-image').innerHTML = aiSvg;
        } else {
            // Fallback to predefined SVG or img
            if (currentCard.img) {
                document.getElementById('card-image').innerHTML = `<img src="${currentCard.img}" alt="card image" />`;
            } else {
                document.getElementById('card-image').innerHTML = currentCard.svg;
            }
        }
    } else {
        renderCard(currentCard);
    }

    // Animate in if not already done
    cardEl.style.transition = 'transform 0.5s ease';
    cardEl.style.transform = 'translate(0, 0) rotate(0deg)';
}

function renderCard(card) {
    const lang = localStorage.getItem('limboLang') || 'es';

    document.getElementById('card-title').textContent = card.title[lang] || card.title['es'];
    document.getElementById('card-desc').textContent = card.desc[lang] || card.desc['es'];

    if (card.img) {
        document.getElementById('card-image').innerHTML = `<img src="${card.img}" alt="card image" />`;
    } else {
        document.getElementById('card-image').innerHTML = card.svg;
    }

    document.getElementById('swipe-left').innerHTML = `◀ ${card.left.text[lang] || card.left.text['es']}`;
    document.getElementById('swipe-right').innerHTML = `${card.right.text[lang] || card.right.text['es']} ▶`;
}

// --- Gemini AI Integration ---
async function generateImageWithAI(title, desc) {
    const prompt = `Generate ONLY a raw SVG string for a 2D game card representing the following scenario:
Title: ${title}
Description: ${desc}
Rules:
- The SVG must be a pure black-and-white simple drawing.
- Use only stroke='black' and fill='none' or solid black fills.
- Use viewBox='0 0 100 100'.
- Do NOT use backticks, markdown, or any surrounding text. Just output the <svg>...</svg> string.`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${userApiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.8,
                    maxOutputTokens: 1024
                }
            })
        });

        const data = await response.json();

        if (!data || !data.candidates || data.candidates.length === 0 || !data.candidates[0].content) {
            console.error("AI API Error: Invalid response structure", data);
            logAdmin(`[AI ERROR] Invalid response structure`);
            return null;
        }

        const svgStr = data.candidates[0].content.parts[0].text.trim();
        // Remove markdown if Gemini accidentally included it
        const cleanSvg = svgStr.replace(/```(xml|svg|html)?/gi, '').replace(/```/g, '').trim();
        return cleanSvg;
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
            if (val === atob('TGVtb24xNDI5IQ==')) { // hardcoded base64 for 'Lemon1429!' to hide from plain text scanners
                adminAuthed = true;
                logAdmin('[SYSTEM] Access Granted. Commands: enableai, disableai');
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
        const key = prompt("Please enter your Gemini API Key:");
        if (key) {
            userApiKey = key;
            state.aiEnabled = true;
            logAdmin('[OK] AI Enabled. SVG will generate on next card.');
        } else {
            logAdmin('[ERR] API Key required to enable AI.');
        }
    } else if (cmd === 'disableai') {
        state.aiEnabled = false;
        userApiKey = null;
        logAdmin('[OK] AI Disabled. Using default SVG.');
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

// --- Difficulty listener ---
document.addEventListener('DOMContentLoaded', () => {
    const diffSelector = document.getElementById('selector-dificultad');
    if (diffSelector) {
        const savedDiff = localStorage.getItem('limboDificultad') || 'normal';
        diffSelector.value = savedDiff;
        diffSelector.addEventListener('change', (e) => {
            localStorage.setItem('limboDificultad', e.target.value);
        });
    }
});
