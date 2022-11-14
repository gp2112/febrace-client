{
  description = "Febrace Analytics Client";

  inputs.nixpkgs.url = "github:nixos/nixpkgs/nixos-22.05";

  outputs = { self, nixpkgs }:
    let
      inherit (nixpkgs) lib;
      pkgsFor = nixpkgs.legacyPackages;
      name = "febraceclient";
      genSystems = lib.genAttrs [
        "aarch64-linux"
        "x86_64-linux"
      ];
    in
    rec {
      overlays.default = final: prev: rec {
        ${name} = final.callPackage ./febrace-client.nix { };
      };

      packages = genSystems (system:
        let
          pkgs = import nixpkgs {
            inherit system;
            overlays = [ overlays.default ];
          };
        in
        rec {
          febraceclient = pkgs.${name};
          default = febraceclient;
        });


      # nixosModules.default = import ./module.nix;
    };

}
