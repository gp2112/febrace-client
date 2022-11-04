{ pkgs, mkYarnPackage, nodejs, ... }:


mkYarnPackage rec {
  name = "febrace-client";

  buildInputs = with pkgs; [
    nodejs
  ];

  src = ./.;

  yarnPreBuild = ''
    mkdir -p $HOME/.node-gyp/${nodejs.version}
    echo 9 > $HOME/.node-gyp/${nodejs.version}/installVersion
    ln -sfv ${nodejs}/include $HOME/.node-gyp/${nodejs.version}
    export npm_config_nodedir=${nodejs}
  '';

  buildPhase = ''
    yarn build --offline
  '';

  distPhase = "true";

  configurePhase = "ln -s $node_modules node_modules";

}
