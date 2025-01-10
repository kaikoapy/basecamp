"use client";

import { Button } from "@/components/ui/button";
import { Download, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BookletLink {
  model: string;
  english: string;
  spanish: string;
}

const BOOKLET_LINKS: BookletLink[] = [
  {
    model: "S60",
    english:
      "https://8mgpxhnb75.ufs.sh/f/Fo2rp67OWrlIL2YGccdgePT3OhM9YuJR6KfBZsAW8XnUpNrQ",
    spanish:
      "https://8mgpxhnb75.ufs.sh/f/Fo2rp67OWrlIhKpGLvyNnFocRZ9KPUtubwL1rD7SB0GQ4I8T",
  },
  {
    model: "S90",
    english:
      "https://8mgpxhnb75.ufs.sh/f/Fo2rp67OWrlIbuTAgLHeIxkX8y7zVFd3BHwrmRaJpQDiKqgY",
    spanish:
      "https://8mgpxhnb75.ufs.sh/f/Fo2rp67OWrlIamkjIKMHmT1yVgUO6pIEzFqeR8rtldNf3soY",
  },
  {
    model: "V60 Cross Country",
    english:
      "https://8mgpxhnb75.ufs.sh/f/Fo2rp67OWrlIRSoKFnXh0T2Q3dSCnae6coZrNtUzi4HyMDBu",
    spanish:
      "https://8mgpxhnb75.ufs.sh/f/Fo2rp67OWrlIX47KwrO68wiY9uMOAFIgnDRhfbKloxykTJdE",
  },
  {
    model: "V90 Cross Country",
    english:
      "https://8mgpxhnb75.ufs.sh/f/Fo2rp67OWrlIyKtDvnpbDMW9XCxK1vmquOFa7Bldt2AR0pLc",
    spanish:
      "https://8mgpxhnb75.ufs.sh/f/Fo2rp67OWrlIX47KwrO68wiY9uMOAFIgnDRhfbKloxykTJdE",
  },
  {
    model: "XC40 & XC40 Recharge",
    english:
      "https://8mgpxhnb75.ufs.sh/f/Fo2rp67OWrlIRUk3HZXh0T2Q3dSCnae6coZrNtUzi4HyMDBu",
    spanish:
      "https://8mgpxhnb75.ufs.sh/f/Fo2rp67OWrlIik3VONgG0jriAflnpkYLsMWu7vdDzO2Swhye",
  },
  {
    model: "XC60",
    english:
      "https://8mgpxhnb75.ufs.sh/f/Fo2rp67OWrlIDuhB9ALROkxFSfM45cUZA8I9mWBYXiHuh6GD",
    spanish:
      "https://8mgpxhnb75.ufs.sh/f/Fo2rp67OWrlIDuhB9ALROkxFSfM45cUZA8I9mWBYXiHuh6GD",
  },

  {
    model: "XC90",
    english:
      "https://8mgpxhnb75.ufs.sh/f/Fo2rp67OWrlI0Ou3o0SRopnZSU7DNAw9lOERCjyd43KbxXLV",
    spanish:
      "https://8mgpxhnb75.ufs.sh/f/Fo2rp67OWrlI0OjzoiMRopnZSU7DNAw9lOERCjyd43KbxXLV",
  },
];

export function ProductBooklets() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">MY25 Product Booklets</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {BOOKLET_LINKS.map((booklet) => (
          <Card key={booklet.model}>
            <CardHeader>
              <CardTitle>{booklet.model}</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button variant="outline" className="flex-1" asChild>
                <a
                  href={booklet.english}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={`${booklet.model} Booklet_MY25.pdf`}
                >
                  <Download className="w-4 h-4 mr-2" />
                  English
                </a>
              </Button>
              {booklet.spanish && (
                <Button variant="outline" className="flex-1" asChild>
                  <a
                    href={booklet.spanish}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={`${booklet.model} Booklet_MY25 - Spanish.pdf`}
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Spanish
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
