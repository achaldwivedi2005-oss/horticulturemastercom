import fruitImage0 from "@/assets/fruits/mango.jpg.asset.json";
import fruitImage1 from "@/assets/fruits/banana.jpg.asset.json";
import fruitImage2 from "@/assets/fruits/apple.jpg.asset.json";
import fruitImage3 from "@/assets/fruits/grape.jpg.asset.json";
import fruitImage4 from "@/assets/fruits/guava.jpg.asset.json";
import fruitImage5 from "@/assets/fruits/papaya.jpg.asset.json";
import fruitImage6 from "@/assets/fruits/pineapple.jpg.asset.json";
import fruitImage7 from "@/assets/fruits/litchi.jpg.asset.json";
import fruitImage8 from "@/assets/fruits/pomegranate.jpg.asset.json";
import fruitImage9 from "@/assets/fruits/sapota.jpg.asset.json";
import fruitImage10 from "@/assets/fruits/aonla.jpg.asset.json";
import fruitImage11 from "@/assets/fruits/ber.jpg.asset.json";
import fruitImage12 from "@/assets/fruits/jackfruit.jpg.asset.json";
import fruitImage13 from "@/assets/fruits/pear.jpg.asset.json";
import fruitImage14 from "@/assets/fruits/peach-and-nectarines.jpg.asset.json";
import fruitImage15 from "@/assets/fruits/plum.jpg.asset.json";
import fruitImage16 from "@/assets/fruits/apricot.jpg.asset.json";
import fruitImage17 from "@/assets/fruits/cherry.jpg.asset.json";
import fruitImage18 from "@/assets/fruits/almond.jpg.asset.json";
import fruitImage19 from "@/assets/fruits/walnut.jpg.asset.json";
import fruitImage20 from "@/assets/fruits/strawberry.jpg.asset.json";
import fruitImage21 from "@/assets/fruits/date-palm.jpg.asset.json";
import fruitImage22 from "@/assets/fruits/fig.jpg.asset.json";
import fruitImage23 from "@/assets/fruits/kiwifruit.jpg.asset.json";
import fruitImage24 from "@/assets/fruits/sweet-orange.jpg.asset.json";
import fruitImage25 from "@/assets/fruits/mandarin.jpg.asset.json";
import fruitImage26 from "@/assets/fruits/limes-lemons.jpg.asset.json";
import fruitImage27 from "@/assets/fruits/grapefruit.jpg.asset.json";
import fruitImage28 from "@/assets/fruits/pummelo.jpg.asset.json";
import fruitImage29 from "@/assets/fruits/annonaceous-fruits.jpg.asset.json";
import fruitImage30 from "@/assets/fruits/avocado.jpg.asset.json";
import fruitImage31 from "@/assets/fruits/bael.jpg.asset.json";
import fruitImage32 from "@/assets/fruits/breadfruit.jpg.asset.json";
import fruitImage33 from "@/assets/fruits/cape-gooseberry.jpg.asset.json";
import fruitImage34 from "@/assets/fruits/carambola.jpg.asset.json";
import fruitImage35 from "@/assets/fruits/chironji.jpg.asset.json";
import fruitImage36 from "@/assets/fruits/durian.jpg.asset.json";
import fruitImage37 from "@/assets/fruits/jamun.jpg.asset.json";
import fruitImage38 from "@/assets/fruits/karonda.jpg.asset.json";
import fruitImage39 from "@/assets/fruits/kokum.jpg.asset.json";
import fruitImage40 from "@/assets/fruits/loquat.jpg.asset.json";
import fruitImage41 from "@/assets/fruits/macadamia-nuts.jpg.asset.json";
import fruitImage42 from "@/assets/fruits/mahua.jpg.asset.json";
import fruitImage43 from "@/assets/fruits/mangosteen.jpg.asset.json";
import fruitImage44 from "@/assets/fruits/minor-arid-fruits.jpg.asset.json";
import fruitImage45 from "@/assets/fruits/minor-temperate-nut-crops.jpg.asset.json";
import fruitImage46 from "@/assets/fruits/olive.jpg.asset.json";
import fruitImage47 from "@/assets/fruits/opuntia-pear.jpg.asset.json";
import fruitImage48 from "@/assets/fruits/passion-fruit.jpg.asset.json";
import fruitImage49 from "@/assets/fruits/pecan-nut.jpg.asset.json";
import fruitImage50 from "@/assets/fruits/persimmon.jpg.asset.json";
import fruitImage51 from "@/assets/fruits/phalsa.jpg.asset.json";
import fruitImage52 from "@/assets/fruits/rambutan.jpg.asset.json";
import fruitImage53 from "@/assets/fruits/sea-buckthorn.jpg.asset.json";
import fruitImage54 from "@/assets/fruits/tamarind.jpg.asset.json";
import fruitImage55 from "@/assets/fruits/wood-apple.jpg.asset.json";

/** Fruit Science crop list (from the syllabus contents the admin shared). Photos: Wikipedia/Wikimedia Commons. */
export type Fruit = { name: string; englishName: string; otherNames: string; image: string | null };

export const fruitGroups: { id: string; title: string; description: string; fruits: Fruit[] }[] = [
  {
    id: "major",
    title: "Major fruit crops",
    description: "Commercially important fruit crops — most asked in exams.",
    fruits: [
    { name: "Mango", englishName: "Mango", otherNames: "Aam", image: fruitImage0.url },
    { name: "Banana", englishName: "Banana", otherNames: "Kela", image: fruitImage1.url },
    { name: "Apple", englishName: "Apple", otherNames: "Seb", image: fruitImage2.url },
    { name: "Grape", englishName: "Grape", otherNames: "Angoor", image: fruitImage3.url },
    { name: "Guava", englishName: "Guava", otherNames: "Amrood / Peru", image: fruitImage4.url },
    { name: "Papaya", englishName: "Papaya", otherNames: "Papita", image: fruitImage5.url },
    { name: "Pineapple", englishName: "Pineapple", otherNames: "Ananas", image: fruitImage6.url },
    { name: "Litchi", englishName: "Lychee", otherNames: "Litchi", image: fruitImage7.url },
    { name: "Pomegranate", englishName: "Pomegranate", otherNames: "Anar", image: fruitImage8.url },
    { name: "Sapota", englishName: "Sapodilla", otherNames: "Chikoo / Sapota", image: fruitImage9.url },
    { name: "Aonla", englishName: "Indian gooseberry", otherNames: "Amla / Aonla", image: fruitImage10.url },
    { name: "Ber", englishName: "Indian jujube", otherNames: "Ber", image: fruitImage11.url },
    { name: "Jackfruit", englishName: "Jackfruit", otherNames: "Kathal", image: fruitImage12.url },
    { name: "Pear", englishName: "Pear", otherNames: "Nashpati", image: fruitImage13.url },
    { name: "Peach and Nectarines", englishName: "Peach and nectarine", otherNames: "Aadoo (peach); nectarine is a smooth-skinned peach", image: fruitImage14.url },
    { name: "Plum", englishName: "Plum", otherNames: "Aloo bukhara", image: fruitImage15.url },
    { name: "Apricot", englishName: "Apricot", otherNames: "Khubani", image: fruitImage16.url },
    { name: "Cherry", englishName: "Cherry", otherNames: "Sweet and sour cherry types", image: fruitImage17.url },
    { name: "Almond", englishName: "Almond", otherNames: "Badam", image: fruitImage18.url },
    { name: "Walnut", englishName: "Walnut", otherNames: "Akhrot", image: fruitImage19.url },
    { name: "Strawberry", englishName: "Strawberry", otherNames: "Garden strawberry", image: fruitImage20.url },
    { name: "Date Palm", englishName: "Date palm", otherNames: "Khajoor", image: fruitImage21.url },
    { name: "Fig", englishName: "Fig", otherNames: "Anjeer", image: fruitImage22.url },
    { name: "Kiwifruit", englishName: "Kiwifruit", otherNames: "Kiwi / Chinese gooseberry", image: fruitImage23.url }
    ],
  },
  {
    id: "citrus",
    title: "Citrus fruits",
    description: "Oranges, mandarins, limes, lemons and their relatives.",
    fruits: [
    { name: "Sweet Orange", englishName: "Sweet orange", otherNames: "Orange", image: fruitImage24.url },
    { name: "Mandarin", englishName: "Mandarin orange", otherNames: "Mandarin / Santra", image: fruitImage25.url },
    { name: "Limes/Lemons", englishName: "Lime and lemon", otherNames: "Nimbu", image: fruitImage26.url },
    { name: "Grapefruit", englishName: "Grapefruit", otherNames: "Grapefruit", image: fruitImage27.url },
    { name: "Pummelo", englishName: "Pomelo", otherNames: "Pummelo / Chakotra", image: fruitImage28.url }
    ],
  },
  {
    id: "minor",
    title: "Minor fruit crops",
    description: "Underutilised, arid, tropical and temperate nut crops.",
    fruits: [
    { name: "Annonaceous Fruits", englishName: "Annonaceous fruits", otherNames: "Examples: sugar apple, custard apple, soursop", image: fruitImage29.url },
    { name: "Avocado", englishName: "Avocado", otherNames: "Butter fruit", image: fruitImage30.url },
    { name: "Bael", englishName: "Bael", otherNames: "Bel / Bengal quince", image: fruitImage31.url },
    { name: "Breadfruit", englishName: "Breadfruit", otherNames: "Breadfruit", image: fruitImage32.url },
    { name: "Cape Gooseberry", englishName: "Cape gooseberry", otherNames: "Goldenberry / Rasbhari", image: fruitImage33.url },
    { name: "Carambola", englishName: "Star fruit", otherNames: "Carambola / Kamrakh", image: fruitImage34.url },
    { name: "Chironji", englishName: "Chironji", otherNames: "Charoli / Piyal / Almondette", image: fruitImage35.url },
    { name: "Durian", englishName: "Durian", otherNames: "Durian", image: fruitImage36.url },
    { name: "Jamun", englishName: "Java plum", otherNames: "Jamun / Black plum", image: fruitImage37.url },
    { name: "Karonda", englishName: "Bengal currant", otherNames: "Karonda", image: fruitImage38.url },
    { name: "Kokum", englishName: "Kokum", otherNames: "Kokam", image: fruitImage39.url },
    { name: "Loquat", englishName: "Loquat", otherNames: "Japanese medlar", image: fruitImage40.url },
    { name: "Macadamia Nuts", englishName: "Macadamia nuts", otherNames: "Queensland nut", image: fruitImage41.url },
    { name: "Mahua", englishName: "Mahua", otherNames: "Mahua / Mahuwa", image: fruitImage42.url },
    { name: "Mangosteen", englishName: "Mangosteen", otherNames: "Purple mangosteen", image: fruitImage43.url },
    { name: "Minor Arid Fruits", englishName: "Minor arid fruits", otherNames: "Examples: ker, lasora, pilu", image: fruitImage44.url },
    { name: "Minor Temperate Nut Crops", englishName: "Minor temperate nut crops", otherNames: "Examples: hazelnut, chestnut", image: fruitImage45.url },
    { name: "Olive", englishName: "Olive", otherNames: "Zaitoon", image: fruitImage46.url },
    { name: "Opuntia Pear", englishName: "Prickly pear", otherNames: "Cactus pear / Opuntia fruit", image: fruitImage47.url },
    { name: "Passion Fruit", englishName: "Passion fruit", otherNames: "Passionfruit", image: fruitImage48.url },
    { name: "Pecan nut", englishName: "Pecan", otherNames: "Pecan nut", image: fruitImage49.url },
    { name: "Persimmon", englishName: "Persimmon", otherNames: "Japanese persimmon (cultivated type)", image: fruitImage50.url },
    { name: "Phalsa", englishName: "Phalsa", otherNames: "Falsa / Indian sherbet berry", image: fruitImage51.url },
    { name: "Rambutan", englishName: "Rambutan", otherNames: "Rambutan", image: fruitImage52.url },
    { name: "Sea Buckthorn", englishName: "Sea buckthorn", otherNames: "Seaberry", image: fruitImage53.url },
    { name: "Tamarind", englishName: "Tamarind", otherNames: "Imli", image: fruitImage54.url },
    { name: "Wood Apple", englishName: "Wood apple", otherNames: "Kaitha / Kavit", image: fruitImage55.url }
    ],
  },
];
