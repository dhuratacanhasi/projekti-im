// Përkthimet angleze të përmbajtjes së katalogut (restorante + menu).
// Baza e të dhënave mban vetëm tekstin shqip, ndaj këto mapa plotësojnë
// fushat name_en / description_en kur ato mungojnë.

export const PERSHKRIME_RESTORANTESH: Record<string, string> = {
  "Burgers, wraps dhe ushqim i shpejtë i bërë në moment.":
    "Burgers, wraps and fast food made to order.",
  "Doner, gyros dhe specialitete të shpejta të Lindjes.":
    "Doner, gyros and quick Eastern specialties.",
  "Pulë e krokantë, buckets dhe sides klasike.": "Crispy chicken, buckets and classic sides.",
  "Kafe, mëngjes dhe ëmbëlsira për çdo kohë të ditës.":
    "Coffee, breakfast and desserts at any time of day.",
  "Kuzhinë tradicionale shqiptare dhe zgjedhje familjare.":
    "Traditional Albanian cuisine and family favourites.",
  "Bistro moderne me pasta, sallata dhe ëmbëlsira.":
    "Modern bistro with pasta, salads and desserts.",
  "Pasta të freskëta dhe salca të bëra në shtëpi.": "Fresh pasta and homemade sauces.",
  "Burgers artizanale dhe milkshake të trasha.": "Artisan burgers and thick milkshakes.",
  "Pica me brumë të fermentuar 48 orë dhe furrë guri.":
    "Pizza with 48-hour fermented dough from a stone oven.",
  "Hot dog, burgers dhe ushqim rrugës.": "Hot dogs, burgers and food on the go.",
  "Pica nordike me përbërës të freskët dhe brumë të hollë.":
    "Nordic pizza with fresh ingredients and a thin crust.",
  "Restorant i qetë me grill, peshk dhe kuzhinë mesdhetare.":
    "Quiet restaurant with grill, fish and Mediterranean cuisine.",
  "Grill dhe specialitete të qytetit.": "Grill and city specialties.",
  "Sushi i freskët dhe rolls të përgatitur në moment.": "Fresh sushi and rolls made to order.",
  "Bagels, kafe speciale dhe mëngjes gjatë gjithë ditës.":
    "Bagels, specialty coffee and all-day breakfast.",
  "Kuzhinë malësore dhe produkte të freskëta vendore.":
    "Highland cuisine and fresh local produce.",
  "Pica të pjekura në furrë druri në zemër të Prizrenit.":
    "Wood-fired pizza in the heart of Prizren.",
  "Pasta italiane dhe salca të freskëta.": "Italian pasta and fresh sauces.",
  "Grill, qebapa dhe specialitete tradicionale të qytetit.":
    "Grill, qebapa and traditional city specialties.",
  "Kafe speciale, mëngjes gjatë gjithë ditës dhe ëmbëlsira.":
    "Specialty coffee, all-day breakfast and desserts.",
};

export const EMRAT_ARTIKUJVE: Record<string, string> = {
  "Wrap pule": "Chicken Wrap",
  "Patate të skuqura": "French Fries",
  "Ujë 0.5": "Water 0.5 L",
  "Doner klasik": "Classic Doner",
  "Doner me djathë": "Cheese Doner",
  "Gyros pule": "Chicken Gyros",
  "Pita falafel": "Falafel Pita",
  "Patate me cheddar": "Cheddar Fries",
  "Sallatë greke": "Greek Salad",
  "Bucket 8 copë": "8-Piece Bucket",
  "Hot Wings 6 copë": "Hot Wings (6 pcs)",
  "Sallatë coleslaw": "Coleslaw",
  "Mëngjes Koha": "Koha Breakfast",
  "Omletë me perime": "Veggie Omelette",
  "Croissant me çokollatë": "Chocolate Croissant",
  "Lëng portokalli": "Orange Juice",
  "Tavë kosi": "Baked Lamb with Yogurt",
  Flija: "Flija Pancake",
  "Pleskavicë e madhe": "Large Pljeskavica",
  "Qebapa 10 copë": "Qebapa (10 pcs)",
  "Sallatë shope": "Shopska Salad",
  "Supë pile": "Chicken Soup",
  Bakllava: "Baklava",
  "Çaj mali": "Mountain Tea",
  "Rizoto me kërpudha": "Mushroom Risotto",
  "Salmon i pjekur": "Grilled Salmon",
  Limonadë: "Lemonade",
  "Pizza Margarita": "Margherita Pizza",
  "Sallatë Caprese": "Caprese Salad",
  "Ujë me gaz 0.5": "Sparkling Water 0.5 L",
  "Patate truffle": "Truffle Fries",
  "Sallatë e shtëpisë": "House Salad",
  "Milkshake çokollatë": "Chocolate Milkshake",
  "Lëng molle": "Apple Juice",
  "Birrë artizanale 0.33": "Craft Beer 0.33 L",
  "Patate me djathë": "Cheese Fries",
  "Nuggets 6 copë": "Nuggets (6 pcs)",
  "Milkshake vanilje": "Vanilla Milkshake",
  "Sallatë Rukola": "Arugula Salad",
  "Biftek viçi": "Beef Steak",
  "Qengji i pjekur": "Roast Lamb",
  "Fileto pule": "Chicken Fillet",
  "Salmon i freskët": "Fresh Salmon",
  "Rizoto frutti di mare": "Seafood Risotto",
  "Sallatë mesdhetare": "Mediterranean Salad",
  Pleskavicë: "Pljeskavica",
  "Shish qebap": "Shish Kebab",
  "Supë qengji": "Lamb Soup",
  "California Roll 8 copë": "California Roll (8 pcs)",
  "Salmon Nigiri 4 copë": "Salmon Nigiri (4 pcs)",
  "Miso Supë": "Miso Soup",
  "Sallatë Wakame": "Wakame Salad",
  "Çaj jeshil": "Green Tea",
  "Bagel Avokado": "Avocado Bagel",
  "Lëng i gjelbër": "Green Juice",
  "Trout i pjekur": "Grilled Trout",
  "Mish i thatë me kajmak": "Cured Meat with Kajmak",
  "Sallatë fshati": "Village Salad",
  "Ujë burimi 0.5": "Spring Water 0.5 L",
  "Mëngjes i plotë": "Full Breakfast",
};

export const PERSHKRIME_ARTIKUJSH: Record<string, string> = {
  "Mish viçi, cheddar, sallatë, domate dhe sos shtëpiak":
    "Beef, cheddar, lettuce, tomato and house sauce",
  "Dy kotoleta viçi, cheddar i dyfishtë dhe kripë e tymosur":
    "Two beef patties, double cheddar and smoked salt",
  "Pulë krokante, majonezë e lehtë dhe sallatë iceberg":
    "Crispy chicken, light mayo and iceberg lettuce",
  "Tortiljë me pulë të grirë, perime dhe sos i bardhë":
    "Tortilla with shredded chicken, vegetables and white sauce",
  "Patate të freskëta me kripë deti dhe sos": "Fresh potatoes with sea salt and sauce",
  "6 krahë pule me sos BBQ": "6 chicken wings with BBQ sauce",
  "Pije e ftohtë": "Cold drink",
  "Ujë natyral": "Natural water",
  "Mish doner, sallatë, domate, qepë dhe sos jogurti":
    "Doner meat, lettuce, tomato, onion and yogurt sauce",
  "Doner, cheddar i shkrirë dhe sos i thartë": "Doner, melted cheddar and tangy sauce",
  "Pulë e pjekur në vertikal, perime dhe tzatziki":
    "Vertical-roasted chicken, vegetables and tzatziki",
  "Falafel vegjetarian, hummus dhe perime të freskëta":
    "Vegetarian falafel, hummus and fresh vegetables",
  "Patate të skuqura me cheddar dhe jalapeño": "Fries with cheddar and jalapeño",
  "Domate, kastravec, ullinj dhe djathë feta": "Tomato, cucumber, olives and feta cheese",
  "Pije tradicionale jogurti": "Traditional yogurt drink",
  "Pije e ftohtë me portokall": "Chilled orange drink",
  "8 copë pulë e krokantë me erëza origjinale":
    "8 pieces of crispy chicken with original spices",
  "Pulë e krokantë, sallatë dhe majonezë": "Crispy chicken, lettuce and mayonnaise",
  "Krahë pule pikantë": "Spicy chicken wings",
  "Copëza pule të krokanta": "Crispy chicken bites",
  "Porcion i madh": "Large portion",
  "Lakër e freskët me sos kremoz": "Fresh cabbage with creamy sauce",
  "Vezë, proshutë, djathë, domate dhe bukë e thekur":
    "Eggs, ham, cheese, tomato and toasted bread",
  "Vezë bio, spec, kërpudha dhe djathë": "Organic eggs, pepper, mushrooms and cheese",
  "Pulë, proshutë, djathë dhe perime": "Chicken, ham, cheese and vegetables",
  "I freskët, i pjekur çdo mëngjes": "Fresh, baked every morning",
  "Kafe e pjekur lokalisht": "Locally roasted coffee",
  "Espresso me qumësht të rrahur": "Espresso with steamed milk",
  "Me salcë mjedre dhe biskota": "With forest berry sauce and biscuits",
  "I shtrydhur në moment": "Freshly squeezed",
  "Mish qengji me salcë jogurti dhe oriz": "Lamb with yogurt sauce and rice",
  "Shtresa të holla me kajmak dhe gjalpë": "Thin layers with kajmak and butter",
  "Mish i grirë i përzier me erëza dhe kajmak":
    "Minced meat mixed with spices and kajmak",
  "Mish viçi dhe qengji, bukë dhe qepë": "Beef and lamb, bread and onion",
  "Domate, kastravec, qepë dhe djathë i bardhë": "Tomato, cucumber, onion and white cheese",
  "Supë e ngrohtë me perime": "Warm vegetable soup",
  "Me arra dhe shurup sheqeri": "With walnuts and sugar syrup",
  "Çaj i ngrohtë me mjaltë": "Warm tea with honey",
  "Spaghetti, guanciale, vezë dhe pecorino": "Spaghetti, guanciale, egg and pecorino",
  "Krem tartufi, parmezan dhe kërpudha": "Truffle cream, parmesan and mushrooms",
  "Oriz arborio, kërpudha dhe parmezan": "Arborio rice, mushrooms and parmesan",
  "Sallatë romaine, pulë, krutona dhe dressing":
    "Romaine lettuce, chicken, croutons and dressing",
  "Bukë e thekur, domate qershi dhe borzilok": "Toasted bread, cherry tomato and basil",
  "Me perime të stinës dhe limon": "With seasonal vegetables and lemon",
  "Klasi i ëmbël italian": "The classic Italian dessert",
  "Limon i freskët me nenexhik": "Fresh lemon with mint",
  "Mish viçi i grirë, domate dhe parmezan": "Minced beef, tomato and parmesan",
  "Pulë, krem dhe parmezan": "Chicken, cream and parmesan",
  "Domate pikante, hudhër dhe spec djegës": "Spicy tomato, garlic and chilli",
  "Shtresa pasta, mish dhe bechamel": "Layers of pasta, meat and béchamel",
  "Domate, mozarella dhe borzilok": "Tomato, mozzarella and basil",
  "Mozarella, domate dhe vaj ulliri": "Mozzarella, tomato and olive oil",
  "Me salcë frutash pylli": "With forest fruit sauce",
  "I ftohtë": "Served cold",
  "Dy kotoleta të shtypura, cheddar dhe qepë karamelizuar":
    "Two smashed patties, cheddar and caramelised onion",
  "Salcë tartufi, djathë gruyere dhe rukola": "Truffle sauce, gruyère cheese and arugula",
  "Pulë e marinua, sallatë dhe sos i bardhë": "Marinated chicken, lettuce and white sauce",
  "Patate me vaj tartufi dhe parmezan": "Fries with truffle oil and parmesan",
  "Unaza qepe të krokanta": "Crispy onion rings",
  "Gjethore, domate qershi dhe feta": "Greens, cherry tomato and feta",
  "Akullore, çokollatë dhe krem": "Ice cream, chocolate and cream",
  "Domate San Marzano, mozarella dhe borzilok": "San Marzano tomato, mozzarella and basil",
  "Pepperoni pikant dhe mozarella": "Spicy pepperoni and mozzarella",
  "Katër djathëra të zgjedhur": "Four selected cheeses",
  "Proshutë, rukola dhe parmezan": "Prosciutto, arugula and parmesan",
  "Pica e mbyllur me mish dhe djathë": "Folded pizza with meat and cheese",
  "Feta, ullinj, domate dhe kastravec": "Feta, olives, tomato and cucumber",
  "Desert klasik italian": "Classic Italian dessert",
  "E prodhuar lokalisht": "Locally brewed",
  "Suxhuk viçi, mustardë dhe qepë të karamelizuar":
    "Beef sausage, mustard and caramelised onion",
  "Suxhuk, chili con carne dhe cheddar": "Sausage, chilli con carne and cheddar",
  "Mish viçi, cheddar dhe turshi": "Beef, cheddar and pickles",
  "Sos BBQ, qepë krokante dhe bacon": "BBQ sauce, crispy onion and bacon",
  "Patate të skuqura me sos cheddar": "Fries with cheddar sauce",
  "Pulë e grirë e krokantë": "Crispy shredded chicken",
  "I trashë dhe i ftohtë": "Thick and cold",
  "Mozarella, proshutë, kërpudha dhe ullinj": "Mozzarella, ham, mushrooms and olives",
  "Ton, qepë të kuqe dhe ullinj": "Tuna, red onion and olives",
  "Spec, kërpudha, qepë dhe domate qershi": "Pepper, mushrooms, onion and cherry tomato",
  "Salami pikant dhe spec djegës": "Spicy salami and chilli",
  "Bukë italiane me rozmarinë dhe vaj ulliri":
    "Italian bread with rosemary and olive oil",
  "Rukola, parmezan dhe domate qershi": "Arugula, parmesan and cherry tomato",
  "Me çokollatë të zezë dhe arra": "With dark chocolate and walnuts",
  "Me gjalpë barishte dhe patate të pjekura": "With herb butter and roast potatoes",
  "I ngadaltë, me rozmarinë": "Slow-cooked with rosemary",
  "Me salcë limoni dhe perime": "With lemon sauce and vegetables",
  "I pjekur në skarë me perime": "Grilled with vegetables",
  "Oriz, kallamar, karkaleca dhe mussels": "Rice, squid, shrimp and mussels",
  "Me salcë mjedre": "With forest berry sauce",
  "Kafe italiane": "Italian coffee",
  "Me kajmak dhe bukë të ngrohtë": "With kajmak and warm bread",
  "Mish i përzier, qepë dhe ajvar": "Mixed meat, onion and ajvar",
  "Qengji i marinua në hell": "Lamb marinated on the spit",
  "Perime të freskëta dhe djathë": "Fresh vegetables and cheese",
  "E ngrohtë, me perime": "Warm, with vegetables",
  "Me arra": "With walnuts",
  "Jogurt i ftohtë": "Chilled yogurt",
  "Krab, avokado dhe kastravec": "Crab, avocado and cucumber",
  "Salmon i freskët mbi oriz": "Fresh salmon over rice",
  "Ton pikant dhe majonezë": "Spicy tuna and mayonnaise",
  "8 feta salmon të freskët": "8 slices of fresh salmon",
  "Me tofu dhe alga": "With tofu and seaweed",
  "Alga deti me susam": "Seaweed with sesame",
  "I ngrohtë": "Served warm",
  Natyral: "Natural",
  "Krem djathë, salmon i tymosur dhe kapar":
    "Cream cheese, smoked salmon and capers",
  "Avokado, vezë e zier dhe spec": "Avocado, boiled egg and pepper",
  "Me shurup panje dhe fruta": "With maple syrup and fruit",
  "Jogurt grek, granola dhe mjedër": "Greek yogurt, granola and raspberry",
  "Espresso i dyfishtë me qumësht": "Double espresso with milk",
  "Kafe e ftohtë e infuzuar 12 orë": "Cold brew infused for 12 hours",
  "Me biskota dhe mjedër": "With biscuits and raspberry",
  "Spinaq, mollë, xhenxhefil dhe limon": "Spinach, apple, ginger and lemon",
  "Mish qengji dhe jogurt": "Lamb and yogurt",
  "Peshk i freskët nga lumi": "Fresh river fish",
  "Specialitet i shtëpisë": "House specialty",
  "Perime vendore dhe djathë i bardhë": "Local vegetables and white cheese",
  "Me kajmak dhe mjaltë": "With kajmak and honey",
  "Me mjaltë vendas": "With local honey",
  "Nga burimet e Bjeshkëve": "From the mountain springs",
  "Proshutë, djathë i bardhë dhe spec": "Ham, white cheese and pepper",
  "Pepperoni dhe mozarella": "Pepperoni and mozzarella",
  "E mbyllur me mish dhe djathë": "Folded with meat and cheese",
  "Desert italian": "Italian dessert",
  "Limon i freskët": "Fresh lemon",
  "Mish viçi, domate dhe parmezan": "Beef, tomato and parmesan",
  "Domate pikante dhe hudhër": "Spicy tomato and garlic",
  "Krem, gjalpë dhe parmezan": "Cream, butter and parmesan",
  "Shtresa mish dhe bechamel": "Layers of meat and béchamel",
  "Romaine, krutona dhe parmezan": "Romaine, croutons and parmesan",
  "Domate qershi dhe borzilok": "Cherry tomato and basil",
  "Me fruta pylli": "With forest fruit",
  "I shtrydhur": "Freshly squeezed",
  "Mish viçi dhe qengji, bukë e ngrohtë dhe qepë":
    "Beef and lamb, warm bread and onion",
  "Me kajmak dhe erëza shtëpiake": "With kajmak and house spices",
  "Me salcë limoni dhe perime të pjekura": "With lemon sauce and roasted vegetables",
  "Vezë, djathë, proshutë, domate dhe bukë e thekur":
    "Eggs, cheese, ham, tomato and toasted bread",
  "Me shurup panje dhe fruta të stinës": "With maple syrup and seasonal fruit",
  "Me biskota dhe salcë mjedre": "With biscuits and forest berry sauce",
};

/** Kthen emrin anglez të artikullit, ose null kur s'ka përkthim. */
export function emriAnglisht(shqip: string | null | undefined): string | null {
  if (!shqip) return null;
  return EMRAT_ARTIKUJVE[shqip.trim()] ?? null;
}

/** Kthen përshkrimin anglez (artikull ose restorant), ose null kur s'ka përkthim. */
export function pershkrimiAnglisht(shqip: string | null | undefined): string | null {
  if (!shqip) return null;
  const teksti = shqip.trim();
  return PERSHKRIME_ARTIKUJSH[teksti] ?? PERSHKRIME_RESTORANTESH[teksti] ?? null;
}
