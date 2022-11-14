{ pkgs, mkYarnPackage, nodejs, ... }:


mkYarnPackage rec {
  name = "febrace-client";

  buildInputs = with pkgs; [
    nodejs
  ];

  src = ./.;

  packageJSON = ./package.json;
  yarnLock = ./yarn.lock;
  yarnNix = ./yarn.nix;

  doDist = false;

  buildPhase = ''
    runHook preBuild
    shopt -s dotglob

    rm -f deps/${name}/node_modules
    mkdir deps/${name}/node_modules

    pushd deps/${name}/node_modules
      ln -s ../../../node_modules/* ./
    popd

    cd deps/${name}
    yarn --offline build
    cd ../../
    runHook postBuild
  '';

  installPhase = ''
    runHook preInstall
    mv deps/${name}/build $out
    runHook postInstall
  '';

  distPhase = ''
  
  '';

}
