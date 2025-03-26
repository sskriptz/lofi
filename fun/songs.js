const songs = [
    // { title: "CARNIVAL", artist: "Kanye West, Ty Dolla $ign", src: "https://www.dropbox.com/scl/fi/jdm2pc5i0z4tssbtf6t2c/12-Carnival.mp3?rlkey=n9ncc8egcnwes2a9bw5660dky&st=cn0g5e0o&raw=1" },
    // { title: "Magnolia", artist: "Playboi Carti", src: "https://www.dropbox.com/scl/fi/91dvrw5bzro2p89fddcyf/spotifydown.com-Magnolia-Playboi-Carti.mp3?rlkey=z6zq0vva6dimgy39ywilvtuwf&st=3l1tw5pz&raw=1" },
    // { title: "IDGAF", artist: "BoyWithUke, blackbear", src: "https://www.dropbox.com/scl/fi/5c858z7y3ouz8nqem6jxd/spotifydown.com-IDGAF-with-blackbear-BoyWithUke.mp3?rlkey=1fa4hysag7ggge2u6sh5nyawh&st=m0l0ao9o&raw=1" },
    // { title: "Kerosene", artist: "Crystal Castles", src: "https://www.dropbox.com/scl/fi/pssm1vnhnf6yfbkzuz9yf/spotifydown.com-Kerosene-Crystal-Castles.mp3?rlkey=xzbkqsfjxhq8eyrv91nbchiv3&st=05674r11&raw=1"},
    // { title: "3D OUTRO", artist: "LUCKI", src: "https://www.dropbox.com/scl/fi/gh1o71q4315gzhof9l45l/spotifydown.com-3D-Outro-LUCKI.mp3?rlkey=bfrc47lgyt4d1y6w7mc1pfw2q&st=fndbxgh7&raw=1"},
    // { title: "Diamonds (feat. Gunna)", artist: "Young Thug, Gunna", src: "https://www.dropbox.com/scl/fi/q0sexnbnjgssrwy6xqack/spotifydown.com-Diamonds-feat.-Gunna-Young-Thug.mp3?rlkey=x7v1rwuc3j5tu12xt7u0riwps&st=bdwwpevw&raw=1" },
    // { title: "ILoveUIHateU", artist: "Playboi Carti", src: "https://www.dropbox.com/scl/fi/t0cypq0lvqe0xiehfhai4/spotifydown.com-ILoveUIHateU-Playboi-Carti.mp3?rlkey=6utr3gxwy2ggdhb9rxghxtm3e&st=cn00wqkv&raw=1" },
    // { title: "New N3on", artist: "Playboi Carti", src: "https://www.dropbox.com/scl/fi/wi1sae8fogv4bgdk5ei8y/spotifydown.com-New-N3on-Playboi-Carti.mp3?rlkey=0qkhbb16iy1iqxep7jzfa32o6&st=ehj7wx21&raw=1" },
    // { title: "Our Time", artist: "Lil Tecca", src: "https://www.dropbox.com/scl/fi/adiktphs5yqeweepi3p29/spotifydown.com-Our-Time-Lil-Tecca.mp3?rlkey=h521ror9j3s5asc9ewbcx5diw&st=p9xkgdnj&raw=1" },
    // { title: "Gang Baby", artist: "NLE Choppa", src: "https://www.dropbox.com/scl/fi/yqxibbvz1b4a4edv7ojr0/spotifydown.com-Gang-Baby-NLE-Choppa.mp3?rlkey=pd51n0sxphvyi2ets34bnddjt&st=8enciim4&raw=1" },




    { title: "223s ~ lofi", artist: "Closed on Sunday", src: "https://www.dropbox.com/s/5af7w8zt7md2fac/spotidownloader.com%20-%20223s%20~%20lofi%20-%20Closed%20on%20Sunday.mp3?st=djhweg8i&raw=1" },
    { title: "My Head Hurts", artist: "strxwberrymilk", src: "https://www.dropbox.com/s/ikcftb7mvkthcap/spotidownloader.com%20-%20My%20Head%20Hurts%20-%20strxwberrymilk.mp3?st=ydqrb6d0&raw=1" },
    { title: "snowfall", artist: "Øneheart, reidenshi", src: "https://www.dropbox.com/s/d148hu4csuk8itr/spotidownloader.com%20-%20snowfall%20-%20%C3%98neheart.mp3?st=c0gdkay5&raw=1" },
    { title: "Onion", artist: "Lukrembo", src: "https://www.dropbox.com/s/sz88kxu4nfhs8op/spotidownloader.com%20-%20Onion%20-%20Lukrembo.mp3?st=t7fw7j7m&raw=1" },
    { title: "The Perfect Girl", artist: "Mareux, The Motion", src: "https://www.dropbox.com/s/1o8e4qtz7gqy7fm/spotidownloader.com%20-%20The%20Perfect%20Girl%20-%20The%20Motion%20Retrowave%20Remix%20-%20Mareux.mp3?st=h7lglels&raw=1" },
    { title: "Resonance", artist: "Home", src: "https://www.dropbox.com/s/ituxeb5x0ycy5ia/spotidownloader.com%20-%20Resonance%20-%20Home.mp3?st=fvj4k3jf&raw=1" },
    { title: "Horizons", artist: "Scott Buckley", src: "https://www.dropbox.com/s/sx0eyv4rn3tjtlo/spotidownloader.com%20-%20Horizons%20-%20Scott%20Buckley.mp3?st=j47w7n2u&raw=1" },
    { title: "Aria Math", artist: "C418", src: "https://www.dropbox.com/s/71npzaqei68woi7/spotidownloader.com%20-%20Aria%20Math%20-%20C418.mp3?st=psq1h1bo&raw=1" },
    { title: "Sahara", artist: "Hensonn", src: "https://www.dropbox.com/s/wuhctp0n48n2qw0/spotidownloader.com%20-%20Sahara%20-%20Hensonn.mp3?st=jr2996aw&raw=1" },
    { title: "Memory Reboot - Slowed", artist: "VØJ, Narvent", src: "https://www.dropbox.com/s/a4d8877gjcn8wli/spotidownloader.com%20-%20Memory%20Reboot%20-%20Slowed%20-%20V%C3%98J.mp3?st=0kz25s2i&raw=1" },
    { title: "Save Your Tears", artist: "The Weeknd", src: "https://www.dropbox.com/scl/fi/20acf6hqe3zrbb4ywg9v4/spotifydown.com-Save-Your-Tears-The-Weeknd.mp3?rlkey=klhtvkr7f4wwuzwnui1a2bwzi&st=pe6fiyir&raw=1" },
    { title: "Flamin Hot Cheetos (slowed + reverb)", artist: "Clairo", src: "https://www.dropbox.com/scl/fi/vcf10gqhedr364nhl8lxd/clairo-flamin-hot-cheetos-slowed-reverb-TubeRipper.com.mp3?rlkey=tvodjy8uqsbm1vu8w61dv4iao&st=rbhda1b4&raw=1" },
    { title: "Lovely", artist: "Eric Godlow", src: "https://www.dropbox.com/scl/fi/p8njklpse4gvlzkl7l3n4/FREE-Lo-fi-Type-Beat-Lovely-TubeRipper.com.mp3?rlkey=q3ihtfa5fn8b914d1vqwxq5ed&st=nws4d2qz&raw=1" },
    { title: "You're Never Around", artist: "Eric Godlow", src: "https://www.dropbox.com/scl/fi/9zoajlj7bmyfcij7iqwmi/FREE-Lo-fi-Type-Beat-Youre-never-around-TubeRipper.com.mp3?rlkey=43i4mz311ehjvndj2hag6c99e&st=4ciwd2ym&raw=1" },
    { title: "Cry For Me", artist: "The Weeknd", src: "https://www.dropbox.com/scl/fi/szai6ueone4k2hx9ktz5u/Cry-For-Me-The-Weeknd.mp3?rlkey=phi8k5gzet1kldjww9xivsc0u&st=8zxvpa33&raw=1" },
    { title: "BURN", artist: "Kanye West, Ty Dolla $ign", src: "https://www.dropbox.com/scl/fi/kptzdit2rgx87d1uizdzb/09-Burn.mp3?rlkey=ukc7xnuxbvr1epg27ps2dg5be&st=py6tbav3&raw=1" },
    { title: "Better in the Dark", artist: "Jordana, TV Girl", src: "https://www.dropbox.com/scl/fi/76acxhkpskzo8e35tjxra/Better-in-the-Dark-Jordana.mp3?rlkey=jm6m2jyqkcx7e0yas944rjtui&st=3zq97guw&raw=1" },
    { title: "Taking What's Not Yours", artist: "TV Girl", src: "https://www.dropbox.com/scl/fi/85f0k35a01oez3x2oew75/Taking-What-s-Not-Yours-TV-Girl.mp3?rlkey=omecdlykgkb8s26q4kanth1qm&st=s252iy7d&raw=1" },
    { title: "Not Allowed", artist: "TV Girl", src: "https://www.dropbox.com/scl/fi/l7qd2zztyx9e5r6vkzyhb/Not-Allowed-TV-Girl.mp3?rlkey=fz8jjb06hmushd5dn27gzi7c2&st=g5cclm68&raw=1" },
];



export default songs;
