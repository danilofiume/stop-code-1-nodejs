import fs from "node:fs";
import path from "node:path";
const colors = require("colors");
import { DateTime } from "ts-luxon";

export const printDocumenti = () => {
  //nome percorso
  const documenti = process.cwd();
  //nome percorso + documenti
  const cartellaDocumenti = path.join(documenti, "documenti");
  //ci prendiamo l'ultimo nome del percorso in questo caso documenti
  const nameDocumenti = path.basename(cartellaDocumenti);
  console.log(colors.red("|--", nameDocumenti.toUpperCase()));

  try {
    printFiles(cartellaDocumenti, 1);
  } catch (err) {
    console.error("Errore durante la lettura della cartella:", err);
  }
};

const printFiles = (folderPath:any, livello:any) => {
  //prende i file all'interno del path
  const filesInFolder = fs.readdirSync(folderPath);

  filesInFolder.forEach((file) => {
    const pathToFile = path.join(folderPath, file);
    //stato attuale della cartella
    const stats = fs.statSync(pathToFile);
    const isDirectory = stats.isDirectory();

    if (isDirectory) {
      console.log(colors.red("|   ".repeat(livello) + "|--", file));
      printFiles(pathToFile, livello + 1);
    } else {
      printFileDetails(pathToFile, file, stats, livello);
    }
  });
};

const printFileDetails = (filePath:any, fileName:any, stats:any, livello:any) => {
  const lastModified = DateTime.fromJSDate(stats.mtime);
  const now = DateTime.now();
  let diffMinutes:any = now.diff(lastModified, "minutes").toObject().minutes;
  diffMinutes = Math.trunc(diffMinutes);

  if (diffMinutes < 5) {
    console.log(colors.yellow("|   ".repeat(livello) + "|--", fileName, "- Ultima Modifica", diffMinutes, "minuti fa"));
  } else if (diffMinutes < 30 && diffMinutes > 5) {
    console.log(colors.green("|   ".repeat(livello) + "|--", fileName, "- Ultima Modifica", diffMinutes, "minuti fa"));
  } else {
    console.log(colors.white("|   ".repeat(livello) + "|--", fileName, "- Ultima Modifica", diffMinutes, "minuti fa"));
  }
};
