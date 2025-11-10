#!/bin/bash

echo "===================================="
echo "Verstanuló App - Telepítés és Indítás"
echo "===================================="
echo ""

# Ellenőrizzük hogy telepítve van-e a Node.js
if ! command -v node &> /dev/null; then
    echo "HIBA: A Node.js nincs telepítve!"
    echo ""
    echo "Kérlek telepítsd a Node.js-t a következő oldalról:"
    echo "https://nodejs.org/"
    echo ""
    echo "Válaszd a LTS (Long Term Support) verziót."
    exit 1
fi

echo "Node.js verzió:"
node --version
echo ""

echo "npm verzió:"
npm --version
echo ""

# Ellenőrizzük hogy létezik-e a package.json
if [ ! -f "package.json" ]; then
    echo "HIBA: A package.json fájl nem található!"
    echo "Bizonyosodj meg hogy a scriptet a projekt könyvtárában futtatod."
    exit 1
fi

# Ellenőrizzük hogy telepítve vannak-e a függőségek
if [ ! -d "node_modules" ]; then
    echo "Függőségek telepítése..."
    echo "Ez eltarthat néhány percig..."
    echo ""
    npm install
    if [ $? -ne 0 ]; then
        echo ""
        echo "HIBA: A függőségek telepítése sikertelen volt!"
        exit 1
    fi
    echo ""
    echo "Függőségek sikeresen telepítve!"
    echo ""
else
    echo "Függőségek már telepítve vannak."
    echo ""
fi

echo "===================================="
echo "Alkalmazás indítása..."
echo "===================================="
echo ""
echo "Az alkalmazás megnyílik a böngészőben."
echo "A leállításhoz nyomd meg a Ctrl+C billentyűkombinációt."
echo ""

npm start
