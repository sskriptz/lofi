const songs = [
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
    { title: "So Bitter", artist: "Stxlkin", src: "https://www.dropbox.com/scl/fi/bw3dxh1ol8f71r3iz8leq/Stxlkin-So-Bitter-TubeRipper.com.mp3?rlkey=zg76tq2yhr5bcqu8yfj5khj6o&st=ekxsgw05&raw=1" },
    { title: "Kids", artist: "Current Joys", src: "https://www.dropbox.com/scl/fi/zopu24acu99ax2t0ydb08/SpotiDownloader.com-Kids-Current-Joys.mp3?rlkey=mpprophuoz0dxywbxbekv3zpc&st=i5kunm98&raw=1" },
    { title: "Sunflower", artist: "Post Malone, Swae Lee", src: "https://www.dropbox.com/scl/fi/2zbt049ym33oqutgxtrvd/SpotiDownloader.com-Sunflower-Spider-Man_-Into-the-Spider-Verse-Post-Malone.mp3?rlkey=ahg0sp1i34z45w3saugyebhd6&st=wxsslnlt&raw=1" }, 
    { title: "CARNIVAL", artist: "Kanye West, Ty Dolla $ign", src: "https://www.dropbox.com/scl/fi/jdm2pc5i0z4tssbtf6t2c/12-Carnival.mp3?rlkey=n9ncc8egcnwes2a9bw5660dky&st=cn0g5e0o&raw=1" },
    { title: "Magnolia", artist: "Playboi Carti", src: "https://www.dropbox.com/scl/fi/91dvrw5bzro2p89fddcyf/spotifydown.com-Magnolia-Playboi-Carti.mp3?rlkey=z6zq0vva6dimgy39ywilvtuwf&st=3l1tw5pz&raw=1" },
    { title: "IDGAF", artist: "BoyWithUke, blackbear", src: "https://www.dropbox.com/scl/fi/5c858z7y3ouz8nqem6jxd/spotifydown.com-IDGAF-with-blackbear-BoyWithUke.mp3?rlkey=1fa4hysag7ggge2u6sh5nyawh&st=m0l0ao9o&raw=1" },
    { title: "Kerosene", artist: "Crystal Castles", src: "https://www.dropbox.com/scl/fi/pssm1vnhnf6yfbkzuz9yf/spotifydown.com-Kerosene-Crystal-Castles.mp3?rlkey=xzbkqsfjxhq8eyrv91nbchiv3&st=05674r11&raw=1"},
    { title: "3D OUTRO", artist: "LUCKI", src: "https://www.dropbox.com/scl/fi/gh1o71q4315gzhof9l45l/spotifydown.com-3D-Outro-LUCKI.mp3?rlkey=bfrc47lgyt4d1y6w7mc1pfw2q&st=fndbxgh7&raw=1"},
    { title: "Diamonds (feat. Gunna)", artist: "Young Thug, Gunna", src: "https://www.dropbox.com/scl/fi/q0sexnbnjgssrwy6xqack/spotifydown.com-Diamonds-feat.-Gunna-Young-Thug.mp3?rlkey=x7v1rwuc3j5tu12xt7u0riwps&st=bdwwpevw&raw=1" },
    { title: "ILoveUIHateU", artist: "Playboi Carti", src: "https://www.dropbox.com/scl/fi/t0cypq0lvqe0xiehfhai4/spotifydown.com-ILoveUIHateU-Playboi-Carti.mp3?rlkey=6utr3gxwy2ggdhb9rxghxtm3e&st=cn00wqkv&raw=1" },
    { title: "New N3on", artist: "Playboi Carti", src: "https://www.dropbox.com/scl/fi/wi1sae8fogv4bgdk5ei8y/spotifydown.com-New-N3on-Playboi-Carti.mp3?rlkey=0qkhbb16iy1iqxep7jzfa32o6&st=ehj7wx21&raw=1" },
    { title: "Our Time", artist: "Lil Tecca", src: "https://www.dropbox.com/scl/fi/adiktphs5yqeweepi3p29/spotifydown.com-Our-Time-Lil-Tecca.mp3?rlkey=h521ror9j3s5asc9ewbcx5diw&st=p9xkgdnj&raw=1" },
    { title: "Gang Baby", artist: "NLE Choppa", src: "https://www.dropbox.com/scl/fi/yqxibbvz1b4a4edv7ojr0/spotifydown.com-Gang-Baby-NLE-Choppa.mp3?rlkey=pd51n0sxphvyi2ets34bnddjt&st=8enciim4&raw=1" },
    { title: "Trauma", artist: "BoyWithUke", src: "https://www.dropbox.com/scl/fi/qcjgcmkx0663eiaofioi8/SpotiDownloader.com-Trauma-BoyWithUke.mp3?rlkey=vothvkrt7brfskezi0vz383vi&st=6koskq71&raw=1" },
    { title: "Long Drives", artist: "BoyWithUke", src: "https://www.dropbox.com/scl/fi/cjtt31epcyr30979yz87d/SpotiDownloader.com-Long-Drives-BoyWithUke.mp3?rlkey=jqyoedls2r9hsx7zdepmh99og&st=bl31be8g&raw=1" },
    { title: "Migraine", artist: "BoyWithUke", src: "https://www.dropbox.com/scl/fi/obcpfo4jou69zte3pl6ed/SpotiDownloader.com-Migraine-BoyWithUke.mp3?rlkey=d1ba94a49eq2coajjj9sw1nxq&st=q9gw4ars&raw=1" },
    { title: "Two Moons", artist: "BoyWithUke", src: "https://www.dropbox.com/scl/fi/4z9jkdxtzz5nkflenoumo/SpotiDownloader.com-Two-Moons-BoyWithUke.mp3?rlkey=fx98e10t26zjyesw0go7h1yue&st=5r6goyn2&raw=1" },
    { title: "Closer", artist: "The Chainsmokers, Halsey", src: "https://www.dropbox.com/scl/fi/t729ccffzllv84dna9lqg/SpotiDownloader.com-Closer-The-Chainsmokers.mp3?rlkey=byz7n50ua9eq328xvu2aih9q1&st=mss1xyko&raw=1" },
    { title: "RATHER LIE", artist: "Playboi Carti, The Weeknd", src: "https://www.dropbox.com/scl/fi/d2rgfhtn5tbjv26v3w4hk/SpotiDownloader.com-RATHER-LIE-with-The-Weeknd-Playboi-Carti.mp3?rlkey=j1a77utv0abunflcqixspbb48&st=7wzfahsp&raw=1" },
    { title: "It's Up (feat. Young Thug & 21 Savage)", artist: "Drake, Young Thug, 21 Savage", src: "https://www.dropbox.com/scl/fi/4ud61zqfi9q7uraojklmg/SpotiDownloader.com-It-s-Up-feat.-Young-Thug-21-Savage-Drake.mp3?rlkey=zm0p0nz9vjvwhnfu8dk03f97v&st=5ox5z3ga&raw=1" },
    { title: "God's Plan", artist: "Drake", src: "https://www.dropbox.com/scl/fi/o3dvxdm8v02zbnfnzya39/SpotiDownloader.com-God-s-Plan-Drake.mp3?rlkey=51afu94zd0khjldw3yyjdzbg2&st=r7d7v5h0&raw=1" },
    { title: "for when it's warmer", artist: "Sleepy Fish", src: "https://www.dropbox.com/scl/fi/akxfw2u3x59yge6kbjylb/SpotiDownloader.com-for-when-it-s-warmer-Sleepy-Fish.mp3?rlkey=xhaupx1szu37229wv4979q3c6&st=v9tmt5vm&raw=1" },
    { title: "Timeless (feat. Playboi Carti)", artist: "The Weeknd, Playboi Carti", src: "https://www.dropbox.com/scl/fi/1b8pmscp7ym7ylma363zn/SpotiDownloader.com-Timeless-feat.-Playboi-Carti-The-Weeknd.mp3?rlkey=d8avr0g3o5k5d6x85mk2ee5ho&st=5k9xysdn&raw=1" },
    { title: "I KNOW?", artist: "Travis Scott", src: "https://www.dropbox.com/scl/fi/l1l6um1kcm3nprr90i67p/SpotiDownloader.com-I-KNOW-_-Travis-Scott.mp3?rlkey=gast3b0in18k9oa86o2cajc1s&st=7fi2wkko&raw=1" },
    { title: "Me N My Kup", artist: "Ken Carson", src: "https://www.dropbox.com/scl/fi/rsff4ck8p1fr1ijjs7okb/SpotiDownloader.com-Me-N-My-Kup-Ken-Carson.mp3?rlkey=dgwljlh15j88hk0kcy8u6eh7t&st=76bin9dk&raw=1" },
    { title: "Mama, I'm Sorry", artist: "Lil Uzi Vert", src: "https://www.dropbox.com/scl/fi/uy3e2rlucw4vs5pmcxiwh/SpotiDownloader.com-Mama-I-m-Sorry-Lil-Uzi-Vert.mp3?rlkey=unll3st0u6bhq13ui0aso4nbq&st=6pg0sxox&raw=1" },
    { title: "EVIL J0RDAN", artist: "Playboi Carti", src: "https://www.dropbox.com/scl/fi/olev7t09rb5nep3qn1rcz/SpotiDownloader.com-EVIL-J0RDAN-Playboi-Carti.mp3?rlkey=3q9901byn2k6vb0mk096geeie&st=thsuq9f5&raw=1" },
    { title: "Sunroof", artist: "Nicky Youre, hey daisy", src: "https://www.dropbox.com/scl/fi/rmzchb54cyslkxrsvaf34/SpotiDownloader.com-Sunroof-Nicky-Youre.mp3?rlkey=hak80uqd75ss91f45gmmbnu6i&st=9t0q05hu&raw=1" },
    { title: "Flight", artist: "Jared Anthony", src: "https://www.dropbox.com/scl/fi/dh8t0pjx2ayxleuybo7n9/SpotiDownloader.com-Flight-Jared-Anthony.mp3?rlkey=k69ee2z1xf6r72hlibhswbelq&st=6sq3jx76&raw=1" },
    { title: "MY EYES", artist: "Travis Scott", src: "https://www.dropbox.com/scl/fi/jre33hudf7s4755g7byxk/SpotiDownloader.com-MY-EYES-Travis-Scott.mp3?rlkey=gkmeolcxuywy2kz4i29m3bac4&st=hbaakc1r&raw=1"},
    { title: "Mood (feat. iann dior)", artist: "24kGoldn, iann dior", src: "https://www.dropbox.com/scl/fi/4kny8a1xrrv9v8alf40sq/SpotiDownloader.com-Mood-feat.-iann-dior-24kGoldn.mp3?rlkey=bdidni83gtubbu6x7vdqeu4na&st=prg1bz8j&raw=1"},
    { title: "Glow", artist: "Livingston", src: "https://www.dropbox.com/scl/fi/med9ni40xtejrpk1ommqi/SpotiDownloader.com-Glow-Livingston.mp3?rlkey=36w0opq9aa2ww9vgo5drag0xp&st=1ksq9j99&raw=1" },
];



export default songs;
