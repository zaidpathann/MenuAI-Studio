function titleFromFile(file) {
    if (!file?.originalName) {
        return "";
    }
    return file.originalName
        .replace(/\.pdf$/i, "")
        .replace(/[-_]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}
export function getMockExtractedMenu(restaurantName, uploadedFile) {
    const sourceTitle = titleFromFile(uploadedFile);
    const brandName = restaurantName || sourceTitle || "Restaurant";
    return {
        restaurantName: brandName,
        sourceFile: uploadedFile
            ? {
                name: uploadedFile.originalName,
                size: uploadedFile.size
            }
            : undefined,
        logo: {
            text: brandName
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 3)
                .toUpperCase(),
            placement: "top-left"
        },
        currency: "USD",
        brandColors: {
            primary: "#111827",
            secondary: "#C8A45D",
            accent: "#B8442F",
            paper: "#F7F1E8"
        },
        style: {
            mood: "premium restaurant branding",
            typography: "editorial serif headings with clean sans body",
            spacing: "open, structured, print-ready"
        },
        businessDetails: {
            address: "18 Market Street, Downtown",
            phone: "+1 555 014 2800",
            website: "www.restaurant.example",
            serviceNote: "Seasonal menu. Ask about dietary preferences."
        },
        sections: [
            {
                name: "Small Plates",
                description: "Bright, shareable openings for the table.",
                items: [
                    {
                        name: "Truffle Parmesan Fries",
                        description: "Crisp hand-cut potatoes, aged parmesan, parsley, roasted garlic aioli",
                        price: 12
                    },
                    {
                        name: "Charred Caesar",
                        description: "Grilled romaine hearts, sourdough crumb, pecorino, lemon anchovy dressing",
                        price: 14
                    },
                    {
                        name: "Burrata & Citrus",
                        description: "Creamy burrata, blood orange, basil oil, toasted pistachio",
                        price: 16
                    }
                ]
            },
            {
                name: "Signature Mains",
                description: "Composed plates with seasonal produce.",
                items: [
                    {
                        name: "Herb Roasted Chicken",
                        description: "Lemon thyme jus, seasonal greens, potato gratin",
                        price: 28
                    },
                    {
                        name: "Wild Mushroom Risotto",
                        description: "Arborio rice, porcini, mascarpone, chive oil, parmesan crisp",
                        price: 24
                    },
                    {
                        name: "Seared Atlantic Salmon",
                        description: "Fennel puree, charred broccolini, caper brown butter",
                        price: 31
                    }
                ]
            },
            {
                name: "Desserts",
                description: "Finished in-house daily.",
                items: [
                    {
                        name: "Vanilla Bean Panna Cotta",
                        description: "Berry compote, almond crumble",
                        price: 11
                    },
                    {
                        name: "Dark Chocolate Torte",
                        description: "Espresso ganache, sea salt, creme fraiche",
                        price: 13
                    }
                ]
            },
            {
                name: "Beverages",
                description: "Curated non-alcoholic pairings.",
                items: [
                    {
                        name: "House Citrus Spritz",
                        description: "Grapefruit, rosemary, sparkling mineral water",
                        price: 8
                    },
                    {
                        name: "Cold Brew Tonic",
                        description: "Single-origin cold brew, tonic, orange peel",
                        price: 7
                    }
                ]
            }
        ]
    };
}
